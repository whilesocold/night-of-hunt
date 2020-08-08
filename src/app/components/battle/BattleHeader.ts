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

export class BattleHeader extends PIXI.Container {
  protected userState: BattleUserState
  protected enemyState: BattleUserState

  protected container: PIXI.Container

  protected back: PIXI.Sprite
  protected boss: PIXI.Sprite

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

  protected onBattleStartingBind: (state: BattleState) => void
  protected onBattlePlayerTurnStartingBind: (state: BattleState) => void

  constructor() {
    super()

    const bossId = State.get('bossId')

    this.userState = State.get('user')
    this.enemyState = State.get('enemy')

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('back7.jpg'))

    this.container = new PIXI.Container()
    this.container.position.set(0, 39)

    this.boss = new PIXI.Sprite(ResourceManager.instance.getTexture('boss_' + bossId + '.png'))
    this.boss.anchor.set(0.5, 1)
    this.boss.position.set(this.back.width / 2, this.back.height + this.container.y + 50)

    this.enemyBack = new PIXI.Graphics()
    this.enemyBack.beginFill(0x000000, 0.5)
    this.enemyBack.drawRect(0, 0, this.back.width, 39)
    this.enemyBack.endFill()

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
    this.container.addChild(this.boss)

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

    EventBus.once(GameEvent.BattleStarting, this.onBattleStartingBind)
    EventBus.once(GameEvent.BattlePlayerTurnStarting, this.onBattlePlayerTurnStartingBind)
  }

  protected onBattleStarting(state: BattleState): void {
    console.log('onBattleStarting', state)
  }

  protected onBattlePlayerTurnStarting(state: BattleState): void {
    console.log('onBattlePlayerTurnStarting', state)
  }
}