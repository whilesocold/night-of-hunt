import * as PIXI from 'pixi.js'

import { ResourceManager } from '../../utils/resources/ResourceManager'
import { BattleUserPhoto } from './BattleUserPhoto'
import { BattleUserName } from './BattleUserName'
import { BattleHealth, BattleHealthType } from './BattleHealth'
import { BattleHealthbar } from './BattleHealthbar'
import { EventBus, State } from '../../App'
import { GameEvent } from '../../data/GameEvent'
import { BattleState } from '../../data/BattleState'
import { BattleUserState } from '../../data/BattleUserState'
import { MaskingEffect } from '../effects/MaskingEffect'
import { AnimatedAtlasEffect } from '../effects/AnimatedAtlasEffect'
import { Utils } from '../../utils/Utils'
import { TweenUtils } from '../../utils/TweenUtils'
import { DamageLabelEffect } from '../effects/DamageLabelEffect'

import RainEffectConfig from '../../configs/effects/RainEffectConfig'

export class BattleHeader extends PIXI.Container {
  protected turnTime: number = 0.25

  protected userState: BattleUserState
  protected enemyState: BattleUserState

  protected container: PIXI.Container

  protected back: PIXI.Sprite
  protected enemy: PIXI.Sprite
  protected weatherEffect: MaskingEffect

  protected containerMask: PIXI.Graphics

  protected userBack: PIXI.Graphics
  protected enemyBack: PIXI.Graphics

  protected userPhoto: BattleUserPhoto
  protected enemyPhoto: BattleUserPhoto

  protected userName: BattleUserName
  protected enemyName: BattleUserName

  protected userHealth: BattleHealth
  protected enemyHealth: BattleHealth

  protected userHealthbar: BattleHealthbar
  protected enemyHealthbar: BattleHealthbar

  protected enemyDamageEffect: AnimatedAtlasEffect
  protected enemyDamageLabelEffect: DamageLabelEffect

  protected onBattleStartingBind: (state: BattleState) => void

  protected onBattlePlayerTurnStartingBind: (state) => void
  protected onBattlePlayerTurnEndingBind: (state) => void

  protected onBattleEnemyTurnStartingBind: (state) => void
  protected onBattleEnemyTurnEndingBind: (state) => void

  constructor() {
    super()

    const bossId = State.get('bossId')

    this.userState = State.get('user')
    this.enemyState = State.get('enemy')

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('back7.jpg'))

    this.container = new PIXI.Container()
    this.container.position.set(0, 39)

    this.enemy = new PIXI.Sprite(ResourceManager.instance.getTexture('boss_' + bossId + '.png'))
    this.enemy.anchor.set(0.5, 1)
    this.enemy.position.set(this.back.width / 2, this.back.height + this.container.y + 50)

    TweenUtils.enemyStand(this.enemy)

    this.weatherEffect = new MaskingEffect(
      [ResourceManager.instance.getTexture('rain_1_png')],
      Object.assign(RainEffectConfig, {
        'spawnRect': {
          'x': -this.back.width / 2,
          'y': -this.back.height / 2,
          'w': this.back.width * 1.5,
          'h': this.back.height * 1.5,
        },
      }))

    this.enemyBack = new PIXI.Graphics()
    this.enemyBack.beginFill(0x000000, 0.5)
    this.enemyBack.drawRect(0, 0, this.back.width, 39)
    this.enemyBack.endFill()

    this.enemyDamageEffect = new AnimatedAtlasEffect()
    this.enemyDamageLabelEffect = new DamageLabelEffect()

    this.userBack = new PIXI.Graphics()
    this.userBack.beginFill(0x000000, 0.5)
    this.userBack.drawRect(0, 0, this.back.width, 39)
    this.userBack.endFill()
    this.userBack.position.set(0, this.container.y + this.back.height)

    this.enemyPhoto = new BattleUserPhoto('boss_photo_' + bossId + '.png')

    this.userPhoto = new BattleUserPhoto('maneken.png')
    this.userPhoto.position.set(0, this.userBack.y)

    this.enemyName = new BattleUserName(this.enemyState.name || 'Enemy', 0xe82d2c)
    this.enemyName.position.set(50, 22)

    this.userName = new BattleUserName(this.userState.name || 'User', 0x6085ad)
    this.userName.position.set(50, this.userBack.y + 15)

    this.enemyHealth = new BattleHealth(BattleHealthType.Red, this.enemyState.currentHealth || 100)
    this.enemyHealth.position.set(this.back.width - 69, 22)

    this.userHealth = new BattleHealth(BattleHealthType.Blue, this.userState.currentHealth || 100)
    this.userHealth.position.set(this.back.width - 69, this.userBack.y + 15)

    this.enemyHealthbar = new BattleHealthbar(this.enemyState.currentHealthPercent || 100, 419, 6)
    this.enemyHealthbar.position.set(this.enemyPhoto.x + this.enemyPhoto.width, 0)

    this.userHealthbar = new BattleHealthbar(this.userState.currentHealthPercent || 50, 419, 8)
    this.userHealthbar.position.set(this.userPhoto.x + this.userPhoto.width, this.userBack.y + this.userBack.height - 8)

    this.container.addChild(this.back)
    this.container.addChild(this.weatherEffect)
    this.container.addChild(this.enemy)
    this.container.addChild(this.enemyDamageEffect)
    this.container.addChild(this.enemyDamageLabelEffect)

    this.containerMask = new PIXI.Graphics()
    this.containerMask.beginFill(0xffffff, 0.5)
    this.containerMask.drawRect(0, 0, this.back.width, this.back.height)
    this.containerMask.endFill()

    this.containerMask.position.set(0, this.container.y)
    this.container.mask = this.containerMask

    this.addChild(this.container)
    this.addChild(this.containerMask)

    this.addChild(this.enemyBack)
    this.addChild(this.userBack)

    this.addChild(this.userPhoto)
    this.addChild(this.enemyPhoto)

    this.addChild(this.enemyName)
    this.addChild(this.userName)

    this.addChild(this.enemyHealth)
    this.addChild(this.userHealth)

    this.addChild(this.enemyHealthbar)
    this.addChild(this.userHealthbar)

    this.initEvents()
  }

  protected initEvents(): void {
    this.onBattleStartingBind = this.onBattleStarting.bind(this)
    this.onBattlePlayerTurnStartingBind = this.onBattlePlayerTurnStarting.bind(this)
    this.onBattlePlayerTurnEndingBind = this.onBattlePlayerTurnEnding.bind(this)
    this.onBattleEnemyTurnStartingBind = this.onBattleEnemyTurnStarting.bind(this)
    this.onBattleEnemyTurnEndingBind = this.onBattleEnemyTurnEnding.bind(this)

    EventBus.on(GameEvent.BattleStarting, this.onBattleStartingBind)

    EventBus.on(GameEvent.BattlePlayerTurnStarting, this.onBattlePlayerTurnStartingBind)
    EventBus.on(GameEvent.BattlePlayerTurnEnding, this.onBattlePlayerTurnEndingBind)
    EventBus.on(GameEvent.BattleEnemyTurnStarting, this.onBattleEnemyTurnStartingBind)
    EventBus.on(GameEvent.BattleEnemyTurnEnding, this.onBattleEnemyTurnEndingBind)
  }

  protected onBattleStarting(state): void {
    console.log('onBattleStarting', state)
  }

  protected onBattlePlayerTurnStarting(state): void {
    console.log('onBattlePlayerTurnStarting', state)

    const userState = State.get('user')
    const enemyState = State.get('enemy')

    const fightLog = userState.fightLog

    TweenUtils.enemyDamage(this.enemy)
    TweenUtils.photoDamage(this.enemyPhoto.getPhoto())

    this.enemyHealth.setValue(enemyState.currentHealth)
    this.enemyHealthbar.setValue(enemyState.currentHealthPercent)

    const damageEffectMargin = 50
    const damageEffectOffset = new PIXI.Point(
      Utils.randomRange(-damageEffectMargin, damageEffectMargin),
      Utils.randomRange(-damageEffectMargin, damageEffectMargin))

    const damageLabelEffectSize = 0.35 * fightLog[0].schools.length

    this.enemyDamageEffect.setFrames('blood_splash_' + Utils.randomRange(2, 2) + '_png',
      512,
      512,
      15)
    this.enemyDamageEffect.position.set(
      this.back.width / 2 + damageEffectOffset.x,
      this.back.height / 2 + damageEffectOffset.y)
    this.enemyDamageEffect.play()

    if (fightLog.length > 0) {
      this.enemyDamageLabelEffect.position.set(
        this.back.width / 2 + damageEffectOffset.x,
        this.back.height / 2 + damageEffectOffset.y)
      this.enemyDamageLabelEffect.show(fightLog[0].damage, damageLabelEffectSize)
    }

    setTimeout(() => {
      EventBus.emit(GameEvent.BattlePlayerTurnEnding, state)
    }, this.turnTime * 1000)
  }

  protected onBattlePlayerTurnEnding(state): void {
    console.log('onBattlePlayerTurnEnding', state)

    this.enemyDamageLabelEffect.hide()

    setTimeout(() => {
      EventBus.emit(GameEvent.BattleEnemyTurnStarting, state)
    }, this.turnTime * 1000)
  }

  protected onBattleEnemyTurnStarting(state): void {
    console.log('onBattleEnemyTurnStarting', state)

    const userState = state.get('user')

    TweenUtils.attackToEnemy(this.enemy)
    TweenUtils.photoDamage(this.userPhoto.getPhoto())

    this.userHealth.setValue(userState.currentHealth)
    this.userHealthbar.setValue(userState.currentHealthPercent)

    setTimeout(() => {
      EventBus.emit(GameEvent.BattleEnemyTurnEnding, state)
    }, this.turnTime * 1000)
  }

  protected onBattleEnemyTurnEnding(state): void {
    console.log('onBattleEnemyTurnEnding', state)

    if (State.has('reward')) {
      EventBus.emit(GameEvent.BattleWinning, state)

    } else {
      EventBus.emit(GameEvent.BattleTurnWaiting, state)
    }
  }
}