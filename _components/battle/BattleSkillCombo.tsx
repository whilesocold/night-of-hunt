import React, { Component } from 'react'
import { Container, Sprite, Text } from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'
import { ResourceManager } from '../../src/app/utils/resources/ResourceManager'
import { TweenUtils } from '../../src/app/utils/TweenUtils'

import { Linear, TweenMax } from 'gsap'
import { BattleSkillComboType } from '../../src/app/data/BattleSkillComboType'


export const BattleSkillColor = ['#ffac4b', '#B3E246', '#8fecff']

export class BattleSkillCombo extends Component<any, any> {
  private containerRef: any
  private glowRef: any
  private skillRefs: any

  constructor(props: any) {
    super(props)

    this.skillRefs = []
  }

  componentDidMount(): void {
    this.glowRef.alpha = 0
    this.glowRef.scale.set(0, 0)

    TweenMax.to(this.glowRef, 0.8, { alpha: 1, ease: Linear.easeOut })
    TweenMax.to(this.glowRef.scale, 0.8, {
      x: 1.2, y: 1.2, ease: Linear.easeOut, onComplete: () => {
        TweenMax.to(this.glowRef.scale, 0.5, { x: 1, y: 1, yoyo: true, repeat: -1, ease: Linear.easeIn })
      },
    })
  }

  render() {
    const { x, y, index, idA, idB, damage, school, onSkillDown } = this.props

    const schoolGlowTexture = ResourceManager.instance.getTexture('school_glow_' + school + '.png')
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

    return <Container x={x} y={y} ref={div => this.containerRef = div}>
      <Sprite anchor={{ x: 0.5, y: 0.5 }} ref={div => this.glowRef = div} texture={schoolGlowTexture}/>
      <Sprite anchor={{ x: 0.5, y: 0.5 }} ref={div => this.skillRefs.push(div)} x={-skillATexture.width / 2}
              texture={skillATexture}/>
      <Sprite anchor={{ x: 0.5, y: 0.5 }} ref={div => this.skillRefs.push(div)} x={skillATexture.width / 2}
              texture={skillBTexture}/>
      <Sprite y={skillATexture.height / 2 + digMargin} anchor={{ x: 0.5, y: 0.5 }}
              texture={digTexture}/>
      <Container x={-groupWidth / 2} y={skillATexture.height / 2 + digMargin}>
        <Sprite anchor={{ x: 0, y: 0.5 }} texture={schoolTexture}/>
        <Text x={schoolTexture.width + damageTextMargin} anchor={{ x: 0, y: 0.5 }} text={damage.toString()}
              style={damageStyle}/>
      </Container>
      <Sprite anchor={{ x: 0.5, y: 0.5 }}
              texture={comboTexture}
              buttonMode={true}
              interactive={true}
              interactiveChildren={false}
              pointerdown={async (e) => {
                await TweenUtils.buttonClick(this.containerRef)
                onSkillDown(index,  BattleSkillComboType.Combo)
              }}
      />
    </Container>
  }
}