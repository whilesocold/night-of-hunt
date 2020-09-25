import * as PIXI from 'pixi.js'

import { BattleHeader } from '../battle/BattleHeader'
import { BattleSkills } from '../battle/BattleSkills'
import { BattleLog } from '../battle/BattleLog'
import { BaseScreen } from './BaseScreen'

export class BattleScreen extends BaseScreen {
  protected container: PIXI.Container

  protected backSolid: PIXI.Graphics

  protected header: BattleHeader
  protected skills: BattleSkills
  protected log: BattleLog

  public async init(options: any): Promise<void> {
    await super.init(options)

    this.container = new PIXI.Container()

    this.backSolid = new PIXI.Graphics()

    this.header = new BattleHeader()
    this.skills = new BattleSkills()
    this.skills.scale.set(0.9)
    this.log = new BattleLog()

    this.midLayer.addChild(this.backSolid)

    this.container.addChild(this.skills)
    this.container.addChild(this.log)
    this.container.addChild(this.header)

    this.topLayer.addChild(this.container)
  }

  resize(width: number, height: number, resolution: number): void {
    super.resize(width, height, resolution)

    this.backSolid.clear()
    this.backSolid.beginFill(0x000000, 0.35)
    this.backSolid.drawRect(-460 / 2, 0, 460, height)
    this.backSolid.endFill()

    this.header.resize(width, height, resolution)
    this.skills.y = this.header.y + this.header.height + 56

    this.log.y = this.skills.y + 55
    this.log.resize(width, height, resolution)
  }

  update(dt: number): void {
    super.update(dt)
  }
}