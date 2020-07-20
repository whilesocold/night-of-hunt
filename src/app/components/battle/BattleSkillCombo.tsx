import React, { Component } from 'react'
import { Container, Sprite, Text } from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'
import { ResourceManager } from '../../utils/resources/ResourceManager'

export const BattleSkillColor = ['#ffac4b', '#B3E246', '#8fecff']

export class BattleSkillCombo extends Component<any, any> {
  render() {
    const { x, y, index, idA, idB, damage, school, onSkillDown } = this.props

    const comboTexture = ResourceManager.instance.getTexture('combo.png')

    const skillATexture = ResourceManager.instance.getTexture('skill_' + idA + '.png') || PIXI.Texture.WHITE
    const skillBTexture = ResourceManager.instance.getTexture('skill_' + idB + '.png') || PIXI.Texture.WHITE

    const digTexture = ResourceManager.instance.getTexture('dig_fight.png')
    const digMargin = -10

    const schoolTexture = ResourceManager.instance.getTexture('school_' + school + '.png') || PIXI.Texture.WHITE

    const damageColor = (school - 1) < BattleSkillColor.length ? BattleSkillColor[school - 1] : '#ffffff'
    const damageStyle = new PIXI.TextStyle({
      fontFamily: 'Munchkin-fnt',
      fontSize: 16,
      fill: damageColor,
    })
    const damageTextMetrics = PIXI.TextMetrics.measureText(damage.toString(), damageStyle)
    const damageTextMargin = 4

    const groupWidth = schoolTexture.width + damageTextMetrics.width + damageTextMargin

    return <Container x={x} y={y}>
      <Sprite anchor={{ x: 0, y: 0.5 }} x={0} texture={skillATexture}/>
      <Sprite anchor={{ x: 0, y: 0.5 }} x={skillATexture.width} texture={skillBTexture}/>
      <Sprite x={skillATexture.width} y={skillATexture.height / 2 + digMargin} anchor={{ x: 0.5, y: 0.5 }}
              texture={digTexture}/>
      <Container x={skillATexture.width - groupWidth / 2} y={skillATexture.height / 2 + digMargin}>
        <Sprite anchor={{ x: 0, y: 0.5 }} texture={schoolTexture}/>
        <Text x={schoolTexture.width + damageTextMargin} anchor={{ x: 0, y: 0.5 }} text={damage.toString()}
              style={damageStyle}/>
      </Container>
      <Sprite anchor={{ x: 0.5, y: 0.5 }}
              x={skillATexture.width}
              texture={comboTexture}
              buttonMode={true}
              interactive={true}
              interactiveChildren={false}
              pointerdown={(e) => {
                onSkillDown(index)
              }}
      />
    </Container>
  }
}