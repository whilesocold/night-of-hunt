import React, { Component } from 'react'
import PIXI from 'pixi.js'

import { BattleSkill } from './BattleSkill'
import { ResourceManager } from '../../src/app/utils/resources/ResourceManager'
import { BattleSkillCombo } from './BattleSkillCombo'
import { Container } from 'react-pixi-fiber'
import { BattleSkillSuperCombo } from './BattleSkillSuperCombo'
import { BattleDataUtils } from '../../src/app/data/BattleDataUtils'

export class BattleSkillGroup extends Component<any, any> {
  render() {
    let { x, y, fightDeck, onSkillDown } = this.props
    const skills = []

    const skillTexture = ResourceManager.instance.getTexture('skill_1.png') || PIXI.Texture.WHITE
    const skillGroups = BattleDataUtils.getGroups(fightDeck)

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
      const groupSkills = group.length

      if (groupSkills === 1) {
        const data = group[0]
        const skillWidth = skillTexture.width

        skills.push(<BattleSkill key={data.id}
                                 x={skillX - totalWidth / 2 + skillTexture.width / 2}
                                 y={0}
                                 index={index + 1}
                                 id={data.id}
                                 school={data.school}
                                 damage={data.damage}
                                 onSkillDown={card => onSkillDown(card)}
        />)

        skillX += skillWidth

      } else if (groupSkills === 2) {
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
                                      onSkillDown={(card, comboType) => onSkillDown(0, comboType)}
        />)

        skillX += skillWidth

      } else if (groupSkills === 3) {
        const skillA = group[0]
        const skillB = group[1]
        const skillC = group[2]

        const id = skillA.id
        const school = skillA.school
        const damage = skillA.damage + skillB.damage + skillC.damage

        const skillWidth = skillTexture.width * 2

        skills.push(<BattleSkillSuperCombo key={id}
                                           x={skillX - totalWidth / 2 + skillTexture.width}
                                           y={0}
                                           index={index}
                                           idA={skillA.id}
                                           idB={skillB.id}
                                           idC={skillC.id}
                                           school={school}
                                           damage={damage}
                                           onSkillDown={(card, comboType) => onSkillDown(0, comboType)}
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