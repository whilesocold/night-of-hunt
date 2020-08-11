import * as PIXI from 'pixi.js'
import { TweenMax } from 'gsap'
import _ from 'underscore'

import { BattleSkill } from './BattleSkill'
import { BattleSkillCombo } from './BattleSkillCombo'
import { BattleSkillSuperCombo } from './BattleSkillSuperCombo'
import { EventBus, State } from '../../App'
import { BattleDataUtils } from '../../data/BattleDataUtils'
import { GameEvent } from '../../data/GameEvent'

export class BattleSkills extends PIXI.Container {
  protected skills: any[]
  protected container: PIXI.Container

  protected canEnableSkills: boolean

  protected onPlayerTurnStartingBind: (state) => void
  protected onBattleEnemyTurnEndingBind: (state) => void
  protected onTurnWaitingBind: (state) => void

  constructor() {
    super()

    this.skills = []
    this.canEnableSkills = true

    this.container = new PIXI.Container()
    this.addChild(this.container)

    //this.skills.push(new BattleSkill(1, 1, 1), new BattleSkillCombo([1, 2], 1, 1))
    //this.skills.push(new BattleSkillSuperCombo([1, 2, 3], 1, 1))

    /*
    this.addSkill([1], 2, 1, 0)
    this.addSkill([2], 2, 1, 1)
    this.addSkill([3], 1, 1, 2)

    setTimeout(() => this.morphSkillsToCombo([0, 1], [1, 2], 2, 1), 200)
    //setTimeout(() => this.addSkill([2, 3], 2, 1, 0), 2000)

     */
    //this.rearrangeSkills(true)
    this.initFromState()

    this.onPlayerTurnStartingBind = this.onPlayerTurnStarting.bind(this)
    this.onBattleEnemyTurnEndingBind = this.onBattleEnemyTurnEnding.bind(this)
    this.onTurnWaitingBind = this.onTurnWaiting.bind(this)

    EventBus.on(GameEvent.BattlePlayerTurnStarting, this.onPlayerTurnStartingBind)
    EventBus.on(GameEvent.BattleEnemyTurnEnding, this.onBattleEnemyTurnEndingBind)
    EventBus.on(GameEvent.BattleTurnWaiting, this.onTurnWaitingBind)
  }

  protected onPlayerTurnStarting(state): void {
    this.initFromState()
  }

  protected onBattleEnemyTurnEnding(state): void {
    if (State.has('reward')) {
      this.disableSkills()
    }
  }

  protected onTurnWaiting(state): void {
    this.enableSkills()
  }

  protected getSkillPosition(index: number): number {
    const margin = 40
    const skillWidth = 96

    if (index === 0) {
      return -(skillWidth) - margin

    } else if (index === 2) {
      return skillWidth + margin
    }

    return 0
  }

  protected initFromState(): void {
    const previousSkills = _.clone(this.skills)

    while (this.container.children.length > 0) {
      this.container.removeChildAt(0)
    }

    this.skills = []

    const userState = State.get('user')
    const userDeck = userState.fightDeck//BattleDataUtils.getGroups(userState.fightDeck)

    for (let i = 0; i < userDeck.length; i++) {
      const groupData = userDeck[i]

      const index = this.skills.length
      const x = this.getSkillPosition(index)

      console.log('exist', this.isExistSkill(previousSkills, groupData.id), this.skills)

      this.addSkill([groupData.id], groupData.school, groupData.damage, index, x, this.isExistSkill(previousSkills, groupData.id))
    }

    const skillGroups = this.getSkillGroups(this.skills)

    console.log(skillGroups)

    for (const key in skillGroups) {
      const skillGroup = skillGroups[key]
      console.log(skillGroup)

      if (skillGroup.length === 2) {
        this.morphSkillsToCombo2(
          [skillGroup[0].index, skillGroup[1].index],
          [skillGroup[0].skillId, skillGroup[1].skillId],
          skillGroup[0].schoolId,
          [skillGroup[0].damage, skillGroup[1].damage],
          this.isExistSkillGroup(previousSkills, [skillGroup[0].skillId, skillGroup[1].skillId]))


      } else if (skillGroup.length === 3) {
        this.morphSkillsToCombo3(
          [skillGroup[0].index, skillGroup[1].index, skillGroup[2].index],
          [skillGroup[0].skillId, skillGroup[1].skillId, skillGroup[2].skillId],
          skillGroup[0].schoolId,
          [skillGroup[0].damage, skillGroup[1].damage, skillGroup[2].damage],
          this.isExistSkillGroup(previousSkills, [skillGroup[0].skillId, skillGroup[1].skillId, skillGroup[2].skillId]))
      }
    }
  }

  protected isExistSkill(previousSkills: any, skillId: number): boolean {
    return previousSkills.find(skill => skill instanceof BattleSkill && skill.skillId === skillId) !== null
  }

  protected isExistSkillGroup(previousSkills: any, skillIds: number[]): boolean {
    const combo = previousSkills.find(skill => skill instanceof BattleSkillCombo || skill instanceof BattleSkillSuperCombo)

    return combo && _.isEqual(skillIds, combo.skillIds)
  }

  protected getSkillGroups(skills: any): any {
    let result = {}
    let prevSchool = undefined
    let index = 0

    console.log('skills', skills)

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i]
      const school = skill.schoolId

      console.log(prevSchool, school, index)

      if (prevSchool !== school) {
        index++
      }

      if (!result[index]) {
        result[index] = []
      }

      result[index].push(skill)

      prevSchool = school
    }

    console.log('result', result)

    return result
  }

  public async addSkill(skillIds: number[], schoolId: number, damage: number, index: number, x: number, now: boolean = false): Promise<void> {
    return new Promise(resolve => {
      let skill = null

      if (skillIds.length === 1) {
        skill = new BattleSkill(skillIds[0], schoolId, damage, index)

      } else if (skillIds.length === 2) {
        skill = new BattleSkillCombo(skillIds, schoolId, damage, index, now)

      } else if (skillIds.length === 3) {
        skill = new BattleSkillSuperCombo(skillIds, schoolId, damage, index, now)
      }

      if (!skill) {
        return resolve()
      }

      skill.alpha = now ? 1 : 0
      skill.x = x

      this.skills.push(skill)
      this.container.addChild(skill)

      const handleOnComplete = () => {
        skill.buttonMode = this.canEnableSkills
        skill.interactive = this.canEnableSkills
        skill.on('pointerdown', () => this.onSkillPointerDown(index))

        resolve()
      }

      if (now) {
        handleOnComplete()

      } else {
        TweenMax.to(skill, 1, { alpha: 1, onComplete: () => handleOnComplete() })
      }
    })
  }

  public async morphSkillsToCombo2(indices: number [], skillIds: number[], schoolId: number, damages: number[], now: boolean = false): Promise<void> {
    const indexA = indices[0]
    const indexB = indices[1]

    const skillA = this.skills[indexA]
    const skillB = this.skills[indexB]

    this.skills.splice(indexA, 2)

    const targetSkill = indexA === 0 ? skillB : skillA
    const otherSkill = indexA === 0 ? skillA : skillB
    const targetPosition = indexA === 0 ? skillA.x + skillA.width : skillB.x - skillB.width

    if (now) {
      targetSkill.x = targetPosition
      targetSkill.alpha = 0

      this.addSkill(skillIds, schoolId, BattleDataUtils.getDamage(damages), indexA === 0 ? 0 : 1, this.getSkillPosition(indexA === 0 ? 0 : 2), true)

      this.container.removeChild(skillA)
      this.container.removeChild(skillB)

    } else {
      TweenMax.to(targetSkill, 0.5, { x: targetPosition })

      setTimeout(async () => {
        TweenMax.to(targetSkill, 0.2, { delay: 0.15, alpha: 0 })
        TweenMax.to(otherSkill, 0.2, { delay: 0.15, alpha: 0 })

        await this.addSkill(skillIds, schoolId, BattleDataUtils.getDamage(damages), indexA === 0 ? 0 : 1, this.getSkillPosition(indexA === 0 ? 0 : 2))

        this.container.removeChild(skillA)
        this.container.removeChild(skillB)
      }, 500)
    }
  }

  public async morphSkillsToCombo3(indices: number [], skillIds: number[], schoolId: number, damages: number[], now: boolean = false): Promise<void> {
    const indexA = indices[0]
    const indexB = indices[1]
    const indexC = indices[2]

    const skillA = this.skills[indexA]
    const skillB = this.skills[indexB]
    const skillC = this.skills[indexC]

    this.skills.splice(0, 3)

    if (now) {
      skillA.x = skillB.x - skillA.width
      skillA.alpha = 0

      skillC.x = skillB.x + skillC.width
      skillC.alpha = 0

      this.addSkill(skillIds, schoolId, BattleDataUtils.getDamage(damages), 0, this.getSkillPosition(1), true)

      this.container.removeChild(skillA)
      this.container.removeChild(skillB)
      this.container.removeChild(skillC)

    } else {
      TweenMax.to(skillA, 0.5, { x: skillB.x - skillA.width })
      TweenMax.to(skillC, 0.5, { x: skillB.x + skillC.width })

      setTimeout(async () => {
        TweenMax.to(skillA, 0.2, { delay: 0.15, alpha: 0 })
        TweenMax.to(skillB, 0.2, { delay: 0.15, alpha: 0 })
        TweenMax.to(skillC, 0.2, { delay: 0.15, alpha: 0 })

        await this.addSkill(skillIds, schoolId, BattleDataUtils.getDamage(damages), 0, this.getSkillPosition(1))

        this.container.removeChild(skillA)
        this.container.removeChild(skillB)
        this.container.removeChild(skillC)
      }, 500)
    }
  }

  public async removeSkill(index: number): Promise<void> {
    return new Promise(resolve => {
      const skill = this.skills.find(skill => skill.index === index)

      console.log(skill, index)

      if (!skill) {
        return resolve()
      }

      TweenMax.to(skill, 0.5, {
        alpha: 0, onComplete: () => {
          this.skills.splice(index, 1)
          this.container.removeChild(skill)
          resolve()
        },
      })
    })
  }

  protected rearrangeSkills(now: boolean = false): void {
    while (this.container.children.length > 0) {
      this.container.removeChildAt(0)
    }

    const margin = 30

    for (let i = 0; i < this.skills.length; i++) {
      const skill = this.skills[i]
      const previousSkill = i > 0 ? this.skills[i - 1] : null

      skill.x = previousSkill ? previousSkill.x + previousSkill.width + margin : 0
      skill.buttonMode = true
      skill.interactive = true
      skill.on('pointerdown', () => this.onSkillPointerDown(skill.index))

      this.container.addChild(skill)
    }
  }

  protected enableSkills(): void {
    this.canEnableSkills = true

    for (let i = 0; i < this.skills.length; i++) {
      this.skills[i].interactive = true
      this.skills[i].buttonMode = true
    }
  }

  protected disableSkills(): void {
    this.canEnableSkills = false

    for (let i = 0; i < this.skills.length; i++) {
      this.skills[i].interactive = false
      this.skills[i].buttonMode = false
    }
  }

  protected onSkillPointerDown(index: number): void {
    const skill = this.skills.find(skill => skill.index === index)
    const card = skill instanceof BattleSkill ? skill.index + 1 : 0

    this.removeSkill(index)
      .then(() => {
        this.disableSkills()

        EventBus.emit(GameEvent.BattleAttack, card)
      })
  }
}