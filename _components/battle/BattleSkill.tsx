import React, { Component } from 'react'
import { Container, Sprite, Text } from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'
import { ResourceManager } from '../../src/app/utils/resources/ResourceManager'
import { TweenUtils } from '../../src/app/utils/TweenUtils'

export const BattleSkillColor = ['#ffac4b', '#B3E246', '#8fecff']

export class BattleSkill extends Component<any, any> {
  private containerRef: any

  render() {
    const { x, y, index, id, damage, school, onSkillDown } = this.props

    const skillTexture = ResourceManager.instance.getTexture('skill_' + id + '.png') || PIXI.Texture.WHITE

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

    return <Container x={x} y={y} ref={div => (this.containerRef = div)}>
      <Sprite anchor={{ x: 0.5, y: 0.5 }}
              texture={skillTexture}
              buttonMode={true}
              interactive={true}
              interactiveChildren={false}
              pointerdown={async (e) => {
                await TweenUtils.buttonClick(this.containerRef)
                onSkillDown(index)
              }}
      />
      <Sprite anchor={{ x: 0.5, y: 0.5 }} y={skillTexture.height / 2 + digMargin}
              texture={digTexture}/>
      <Container x={-groupWidth / 2} y={skillTexture.height / 2 + digMargin}>
        <Sprite anchor={{ x: 0, y: 0.5 }} texture={schoolTexture}/>
        <Text x={schoolTexture.width + damageTextMargin} anchor={{ x: 0, y: 0.5 }} text={damage.toString()}
              style={damageStyle}/>
      </Container>
    </Container>
  }
}