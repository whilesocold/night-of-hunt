import React, { Component } from 'react'
import { BattleSkill } from './BattleSkill'
import { ResourceManager } from '../../utils/resources/ResourceManager'
import { BattleSkillCombo } from './BattleSkillCombo'
import { Container } from 'react-pixi-fiber'
import PIXI from 'pixi.js'

export class BattleSkillGroup extends Component<any, any> {
  private getCountSchool(fightDeck: any): number {
    let school = 0
    let countSchool = 1

    for (let i = 0; i < 3; i++) {
      if (fightDeck.length > i) {
        const fightCard = fightDeck[i]

        if (school == fightCard.school) {
          countSchool++
        }

        school = fightCard.school
      }
    }

    return countSchool
  }

  private getGroups(fightDeck: any): any {
    const result = {}

    console.log(fightDeck)

    for (let i = 0; i < fightDeck.length; i++) {
      const fightCard = fightDeck[i]
      const schoolKey = 'school' + fightCard.school.toString()

      if (!result[schoolKey]) {
        result[schoolKey] = []
      }

      result[schoolKey].push(fightCard)
    }

    return result
  }

  private getDamage(fightDeck: any, from: number, to: number, countSchool: number) {
    const X2 = 1.5
    const X3 = 2

    let k = 1

    if (countSchool == 2) {
      k = X2

    } else if (countSchool == 3) {
      k = X3
    }

    let damage = 0

    for (let i = 0; i < 3; i++) {
      if (fightDeck.length > i) {
        if (i >= from && i <= to) {
          damage += fightDeck[i].damage * k
        }
      }
    }

    return damage
  }

  render() {
    let { x, y, fightDeck, onSkillDown } = this.props
    const skills = []

    const skillTexture = ResourceManager.instance.getTexture('skill_1.png') || PIXI.Texture.WHITE
    const skillGroups = this.getGroups(fightDeck)

    const margin = 0

    let totalWidth = 0

    for (const key in skillGroups) {
      const group = skillGroups[key]

      // TODO: combo x3
      if (group.length === 1) {
        totalWidth += (skillTexture.width + margin)

      } else {
        totalWidth += (skillTexture.width + margin) * 2
      }
    }

    let skillX = 0
    let index = 0

    for (const key in skillGroups) {
      const group = skillGroups[key]

      // TODO: combo x3
      if (group.length === 1) {
        const data = group[0]
        const skillWidth = skillTexture.width

        skills.push(<BattleSkill key={data.id}
                                 x={skillX - totalWidth / 2 + skillTexture.width / 2}
                                 y={0}
                                 index={index}
                                 id={data.id}
                                 school={data.school}
                                 damage={data.damage}
                                 onSkillDown={card => onSkillDown(card)}
        />)

        skillX += skillWidth

      } else {
        const skillA = group[0]
        const skillB = group[1]

        const id = skillA.id
        const school = skillA.school
        const damage = skillA.damage + skillB.damage

        const skillWidth = skillTexture.width * 2

        skills.push(<BattleSkillCombo key={id}
                                      x={skillX - totalWidth / 2 + skillTexture.width}
                                      y={0}
                                      index={index}
                                      idA={skillA.id}
                                      idB={skillB.id}
                                      school={school}
                                      damage={damage}
                                      onSkillDown={card => onSkillDown(0)}
        />)

        skillX += skillWidth
      }

      index++
    }

    return <Container x={x} y={y}>
      {skills}
    </Container>
  }
}