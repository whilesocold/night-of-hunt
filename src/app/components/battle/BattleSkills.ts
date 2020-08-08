import * as PIXI from 'pixi.js'
import { TweenMax } from 'gsap'

import { BattleSkill } from './BattleSkill'
import { BattleSkillCombo } from './BattleSkillCombo'
import { BattleSkillSuperCombo } from './BattleSkillSuperCombo'
import { State } from '../../App'
import { BattleDataUtils } from '../../data/BattleDataUtils'

export class BattleSkills extends PIXI.Container {
  protected skills: any[]
  protected container: PIXI.Container

  constructor() {
    super()

    this.skills = []

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
  }

  protected initFromState(): void {
    const userState = State.get('user')
    const userDeck = BattleDataUtils.getGroups(userState.fightDeck)

    for (const school in userDeck) {
      const groupData = userDeck[school]

      for (let i = 0; i < groupData.length; i++) {
        this.addSkill([groupData[i].id], groupData[i].school, groupData[i].damage, this.skills.length)
      }
    }

    const skillGroups = this.getSkillGroups(this.skills)

    console.log(skillGroups)

    for (const key in skillGroups) {
      const skillGroup = skillGroups[key]
      console.log(skillGroup)

      if (skillGroup.length === 2) {

        this.morphSkillsToCombo(
          [skillGroup[0].index, skillGroup[1].index],
          [skillGroup[0].skillId, skillGroup[1].skillId],
          skillGroup[0].schoolId,
          skillGroup[0].damage)
      }
    }

  }

  protected getSkillGroups(skills: any): any {
    const result = {}

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i]
      const schoolKey = 'school' + skill.schoolId.toString()

      if (!result[schoolKey]) {
        result[schoolKey] = []
      }

      result[schoolKey].push(skill)
    }

    return result
  }

  public async addSkill(skillIds: number[], schoolId: number, damage: number, index: number, x: number = undefined): Promise<void> {
    return new Promise(resolve => {
      let skill = null

      if (skillIds.length === 1) {
        skill = new BattleSkill(skillIds[0], schoolId, damage, index)

      } else if (skillIds.length === 2) {
        skill = new BattleSkillCombo(skillIds, schoolId, damage, index)

      } else if (skillIds.length === 3) {
        skill = new BattleSkillSuperCombo(skillIds, schoolId, damage, index)
      }

      if (!skill) {
        return resolve()
      }

      const margin = 40
      //const index = this.skills.length
      //const previousSkill = index > 0 ? this.skills[index - 1] : null

      skill.alpha = 0
      skill.x = typeof x !== 'undefined' ? x : (96 + margin) * index

      this.skills.push(skill)
      this.container.addChild(skill)

      TweenMax.to(skill, 1, {
        alpha: 1, onComplete: () => {
          skill.buttonMode = true
          skill.interactive = true
          skill.on('pointerdown', () => this.onSkillPointerDown(skill.index))

          resolve()
        },
      })
    })
  }

  public async morphSkillsToCombo(indices: number [], skillIds: number[], schoolId: number, damage: number): Promise<void> {
    const indexA = indices[0]
    const indexB = indices[1]

    const skillA = this.skills[indexA]
    const skillB = this.skills[indexB]

    const offset = 50

    this.skills.splice(indexA, 1)
    this.skills.splice(indexB - 1, 1)

    const targetSkill = indexA === 0 ? skillB : skillA
    const targetPosition = indexA === 0 ? skillB.x - offset : skillA.x + offset

    TweenMax.to(targetSkill, 0.5, { x: targetPosition })

    setTimeout(async () => {
      const morphIndex = indexA === 0 ? 0 : 1

      await this.addSkill(skillIds, schoolId, damage, morphIndex, targetPosition)

      //this.container.removeChild(skillA)
      //this.container.removeChild(skillB)
    }, 250)
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

  protected onSkillPointerDown(index: number): void {
    console.log(index, this.skills)
    this.removeSkill(index)
      .then(() => {
        this.addSkill([1], 1, 1, index)
        this.addSkill([3], 1, 1, index + 1)
      })
  }
}