import * as PIXI from 'pixi.js'
import { TweenMax } from 'gsap'

import { BattleLogItem } from './BattleLogItem'
import { EventBus, State } from '../../App'
import { GameEvent } from '../../data/GameEvent'

export class BattleLog extends PIXI.Container {
  protected headerLabel: PIXI.Text
  protected container: PIXI.Container

  protected items: BattleLogItem[]

  protected onBattlePlayerTurnStartingBind: (state) => void

  constructor() {
    super()

    this.items = []

    this.headerLabel = new PIXI.Text('Журнал боя', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 14,
      fill: 0x303c4e,
    })
    this.headerLabel.visible = false
    this.headerLabel.anchor.set(0.5, 0)
    this.addChild(this.headerLabel)

    this.container = new PIXI.Container()
    this.container.position.set(0, this.headerLabel.height + 35)
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
      if (this.items.length > 0) {
        const previousItem = this.items[0]

        TweenMax.to(previousItem.scale, 0.25, { x: 1, y: 1 })
      }

      const newLog = fightLog[0]
      const item = new BattleLogItem(
        newLog.schools[0],
        newLog.damage,
        newLog.enemySchools[0],
        newLog.enemyDamage)

      TweenMax.to(item.scale, 0.25, { x: 1.25, y: 1.25 })

      this.addItem(item, true)
    }

    if (this.items.length > 0) {
      this.headerLabel.visible = true
    }
  }

  initFromState(): void {
    const userState = State.get('user')
    const fightLog = userState.fightLog

    for (let i = 0; i < fightLog.length; i++) {
      const newLog = fightLog[i]
      const item = new BattleLogItem(
        newLog.schools[0],
        newLog.damage,
        newLog.enemySchools[0],
        newLog.enemyDamage)

      if (i === 0) {
        item.scale.set(1.25)
      }

      this.addItem(item)
    }

    if (fightLog.length > 0) {
      this.headerLabel.visible = true
    }
  }

  addItem(item: BattleLogItem, toStart: boolean = false): void {
    const offset = 15

    if (toStart) {
      this.items.unshift(item)

    } else {
      this.items.push(item)
    }

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].y = (this.items[i].height + offset) * i
    }

    this.container.addChild(item)
  }
}