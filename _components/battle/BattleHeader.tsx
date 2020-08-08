import React, { Component } from 'react'
import { Container, Sprite } from 'react-pixi-fiber'

import * as PIXI from 'pixi.js'

import { TweenMax } from 'gsap'

import { App } from '../../src/app/App'
import { Rectangle } from '../common/Rectangle'

import { ResourceManager } from '../../src/app/utils/resources/ResourceManager'
import { BattleUserPhoto } from './BattleUserPhoto'
import { BattleUserName } from './BattleUserName'
import { BattleHealth } from './BattleHealth'
import { BattleHealthbar } from './BattleHealthbar'
import { TweenUtils } from '../../src/app/utils/TweenUtils'
import { BattleDamage } from './BattleDamage'
import { Utils } from '../../src/app/utils/Utils'
import { MaskingEffect } from '../effects/MaskingEffect'
import RainEffectConfig from '../../src/app/configs/effects/RainEffectConfig'
import { BloodSplashEffect } from '../effects/BloodSplashEffect'
import { BattleSkillComboType } from '../../src/app/data/BattleSkillComboType'

export class BattleHeader extends Component<any, any> {
  private onResponseChangeBind: (changed: any) => void

  private bossRef: any
  private userPhotoRef: any
  private bossPhotoRef: any

  constructor(props: any) {
    super(props)

    const { response } = this.props

    const userHealth = response.user.currentHealth
    const userProgress = response.user.currentHealthPercent

    const bossHealth = response.enemy.currentHealth
    const bossProgress = response.enemy.currentHealthPercent

    this.state = {
      response: null,
      showDamage: false,
      userHealth: userHealth,
      userProgress: userProgress,
      bossHealth: bossHealth,
      bossProgress: bossProgress,
    }

    this.onResponseChangeBind = this.onResponseChange.bind(this)
  }

  componentDidMount(): void {
    App.instance.getStorage().on('change:response', this.onResponseChangeBind)

    TweenMax.to(this.bossRef.scale, 0.75, { x: 1, y: 1.02, repeat: -1, yoyo: true })
  }

  componentWillUnmount(): void {
    App.instance.getStorage().off('change:response', this.onResponseChangeBind)
  }

  onResponseChange(e: any): void {
    const response = e.changed.get('response')

    const state = {
      response: response,
      showDamage: true,
      userHealth: this.state.userHealth,
      userProgress: this.state.userProgress,
      bossHealth: response.enemy.currentHealth,
      bossProgress: response.enemy.currentHealthPercent,
    }

    this.setState(state)

    TweenUtils.photoDamage(this.bossPhotoRef.getPhoto())
    TweenUtils.enemyDamage(this.bossRef)

    if (this.bossRef) {
      setTimeout(async () => {
        this.setState({
          response: this.state.response,
          showDamage: false,
          userHealth: response.user.currentHealth,
          userProgress: response.user.currentHealthPercent,
          bossHealth: this.state.bossHealth,
          bossProgress: this.state.bossProgress,
        })

        TweenUtils.attackToEnemy(this.bossRef)
        await TweenUtils.photoDamage(this.userPhotoRef.getPhoto())
      }, 2 * 1000)
    }
  }

  render() {
    let { x, y, bossId, response } = this.props

    if (this.state.response) {
      response = this.state.response
    }

    const backTexture = ResourceManager.instance.getTexture('back7.jpg')
    const bossTexture = ResourceManager.instance.getTexture('boss_' + bossId + '.png')

    const userPhotoTexture = ResourceManager.instance.getTexture('maneken.png')
    const bossPhotoTexture = ResourceManager.instance.getTexture('boss_photo_' + bossId + '.png')

    const bossName = response.enemy.name2
    const userName = response.user.name

    const fightLog = response.user.fightLog[0]

    const damageRandomMargin = { x: 50, y: 50 }

    damageRandomMargin.x = Utils.randomRange(-damageRandomMargin.x, damageRandomMargin.x)
    damageRandomMargin.y = Utils.randomRange(-damageRandomMargin.y, damageRandomMargin.y)


    const rainConfig = Object.assign(RainEffectConfig, {
      'spawnRect': {
        'x': -backTexture.width / 2,
        'y': -backTexture.height / 2,
        'w': backTexture.width * 1.5,
        'h': backTexture.height * 1.5,
      },
    })

    const rainImages = [ResourceManager.instance.getTexture('rain_1_png')]

    /*
    const snowConfig = Object.assign(SnowEffectConfig, {
      'spawnRect': {
        'x': -backTexture.width / 2,
        'y': -backTexture.height / 2,
        'w': backTexture.width * 1.5,
        'h': backTexture.height * 1.5,
      },
    })

    const snowImages = [ResourceManager.instance.getTexture('snowflake_1_png')]


    const gasConfig = Object.assign(ExplosionSecondEffectConfig, {
      'pos': {
        'x': backTexture.width / 2,
        'y': backTexture.height / 2,
      },
    })

    const gasImages = [ResourceManager.instance.getTexture('star_1_png')]
    */

    const backInitialY = 39

    const backEffectMask = new PIXI.Graphics()

    backEffectMask.beginFill(0xffffff)
    backEffectMask.drawRect(x, y + backInitialY, backTexture.width, backTexture.height)
    backEffectMask.endFill()

    const marginMax = 150
    const margin = { x: Utils.randomRange(-marginMax, marginMax), y: Utils.randomRange(-marginMax, marginMax) }

    let comboType = 'comboType' in response ? response.comboType : null
    let damageSize = 0.4

    if (comboType === BattleSkillComboType.Combo) {
      damageSize = 0.8

    } else if (comboType === BattleSkillComboType.SuperCombo) {
      damageSize = 1
    }


    return <Container x={x} y={y}>
      <Sprite y={backInitialY} anchor={{ x: 0, y: 0 }} texture={backTexture}/>

      <MaskingEffect mask={backEffectMask} images={rainImages} config={rainConfig}/>

      <Sprite ref={div => this.bossRef = div}
              mask={backEffectMask}
              x={backTexture.width / 2}
              y={backTexture.height + backInitialY + 50}
              anchor={{ x: 0.5, y: 1 }}
              texture={bossTexture}/>

      <Rectangle width={backTexture.width} height={39} fill={0x000000} alpha={0.5}/>
      <BattleUserPhoto ref={div => this.bossPhotoRef = div} texture={bossPhotoTexture}/>
      <BattleUserName anchor={{ x: 0, y: 0.5 }} x={50} y={20} color={'#e82d2c'} text={bossName}/>
      <BattleHealth x={backTexture.width - 70} y={24} color={'#6085ad'} text={this.state.bossHealth.toString()}/>
      <BattleHealthbar x={40} y={0} width={419} height={6} progress={this.state.bossProgress}/>

      <Rectangle width={backTexture.width} y={backInitialY + backTexture.height} height={39} fill={0x000000}
                 alpha={0.5}/>
      <BattleUserPhoto ref={div => this.userPhotoRef = div} texture={userPhotoTexture}
                       y={backInitialY + backTexture.height}/>
      <BattleUserName anchor={{ x: 0, y: 0.5 }} x={50} y={backTexture.height + backInitialY + 15} color={'#6085ad'}
                      text={userName}/>
      <BattleHealth x={backTexture.width - 69} y={backTexture.height + backInitialY + 15} color={'#6085ad'}
                    text={this.state.userHealth.toString()}/>
      <BattleHealthbar x={40} y={backTexture.height + backInitialY + 39 - 9} width={419} height={8}
                       progress={this.state.userProgress}/>

      {this.state.showDamage ? <BloodSplashEffect x={backTexture.width / 2 + damageRandomMargin.x}
                                                  y={backTexture.height / 2 + backInitialY + damageRandomMargin.y}
                                                  textureName={'blood_splash_' + Utils.randomRange(1, 3) + '_png'}
                                                  frameWidth={512}
                                                  frameHeight={512}
                                                  framesCount={16}
      /> : null}
      {this.state.showDamage ? <BattleDamage x={backTexture.width / 2 + damageRandomMargin.x}
                                             y={backTexture.height / 2 + backInitialY + damageRandomMargin.y}
                                             damage={fightLog.damage}
                                             size={damageSize}
      /> : null}

    </Container>
  }
}