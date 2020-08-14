import * as PIXI from 'pixi.js'
import { TweenMax } from 'gsap'

import { BattleLogItem } from './BattleLogItem'
import { EventBus, State } from '../../App'
import { GameEvent } from '../../data/GameEvent'

export class BattleLog extends PIXI.Container {
  protected headerLabel: PIXI.Text
  protected container: PIXI.Container

  protected items: BattleLogItem[]
  protected itemsMax: number

  protected onBattlePlayerTurnStartingBind: (state) => void

  constructor() {
    super()

    this.items = []
    this.itemsMax = 3

    this.headerLabel = new PIXI.Text('Журнал боя', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 14,
      fill: 0x303c4e,
    })
    this.headerLabel.visible = false
    this.headerLabel.anchor.set(0.5, 0)
    this.addChild(this.headerLabel)

    this.container = new PIXI.Container()
    this.container.position.set(0, this.headerLabel.height + 18)
    this.addChild(this.container)

    this.initFromState()

    this.onBattlePlayerTurnStartingBind = this.onBattlePlayerTurnStarting.bind(this)

    EventBus.on(GameEvent.BattlePlayerTurnStarting, this.onBattlePlayerTurnStartingBind)
  }

  onBattlePlayerTurnStarting(state): void {
    const userState = State.get('user')
    const fightLog = userState.fightLog

    console.log('-------- fightLog', fightLog)

    if (fightLog.length > this.items.length) {
      for (let i = 0; i < this.items.length; i++) {
        TweenMax.to(this.items[i].scale, 0.25, { x: 0.9, y: 0.9 })
      }

      const newLog = fightLog[0]
      const item = new BattleLogItem(
        newLog.schools[0],
        newLog.damage,
        newLog.dead,
        newLog.enemySchools[0],
        newLog.enemyDamage,
        newLog.enemyDead)

      TweenMax.to(item.scale, 0.25, { x: 1.05, y: 1.05 })

      this.addItem(item, true)
    }

    if (this.items.length > 0) {
      this.headerLabel.visible = true
    }
  }

  initFromState(): void {
    const userState = State.get('user')
    const fightLog = userState.fightLog.slice(0, this.itemsMax)

    for (let i = 0; i < fightLog.length; i++) {
      const newLog = fightLog[i]
      const item = new BattleLogItem(
        newLog.schools[0],
        newLog.damage,
        newLog.dead,
        newLog.enemySchools[0],
        newLog.enemyDamage,
        newLog.enemyDead)

      if (i === 0) {
        item.scale.set(1.05)

      } else {
        item.scale.set(0.9)
      }

      this.addItem(item)
    }

    if (fightLog.length > 0) {
      this.headerLabel.visible = true
    }
  }

  addItem(item: BattleLogItem, toStart: boolean = false): void {
    const offset = 8

    if (toStart) {
      if (this.items.length === this.itemsMax) {
        this.container.removeChild(this.items.pop())
      }

      this.items.unshift(item)

    } else {
      if (this.items.length === this.itemsMax) {
        this.container.removeChild(this.items.shift())
      }

      this.items.push(item)
    }

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].y = (this.items[i].height + offset) * i
    }

    this.container.addChild(item)
  }
}