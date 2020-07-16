import React, { Component } from 'react'
import { Container } from 'react-pixi-fiber'
import { BattleSkill } from './BattleSkill'
import { ResourceManager } from '../../utils/resources/ResourceManager'

export class BattleSkillGroup extends Component<any, any> {
  render() {
    let { x, y, fightDeck } = this.props
    const skills = []

    const margin = 20
    const skillTexture = ResourceManager.instance.getTexture('skill_1.png')

    const totalWidth = (skillTexture.width + margin) * fightDeck.length
    const skillWidth = totalWidth / fightDeck.length


    fightDeck.forEach((data, index) => {
      skills.push(<BattleSkill key={data.id}
                               x={-totalWidth / 2 + skillWidth * index + (skillTexture.width + margin) / 2}
                               y={0}
                               id={data.id}
                               school={data.school}
                               damage={data.damage}/>)
    })

    return <Container x={x} y={y}>
      {skills}
    </Container>
  }
}