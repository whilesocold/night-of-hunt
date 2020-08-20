import * as PIXI from 'pixi.js'

import { BattleHeader } from './BattleHeader'
import { ResourceManager } from '../../utils/resources/ResourceManager'
import { BattleSkills } from './BattleSkills'
import { BattleLog } from './BattleLog'

export class BattleScreen extends PIXI.Container {
  protected container: PIXI.Container

  protected back: PIXI.Sprite
  protected backSolid: PIXI.Graphics

  protected header: BattleHeader
  protected skills: BattleSkills
  protected log: BattleLog

  constructor() {
    super()

    this.container = new PIXI.Container()

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('main_back.jpg'))
    this.back.anchor.set(0.5, 0)

    this.backSolid = new PIXI.Graphics()

    this.header = new BattleHeader()
    this.skills = new BattleSkills()
    this.skills.scale.set(0.9)
    this.log = new BattleLog()

    this.addChild(this.back)
    this.addChild(this.backSolid)

    this.container.addChild(this.skills)
    this.container.addChild(this.log)
    this.container.addChild(this.header)

    this.addChild(this.container)
  }

  resize(width: number, height: number, resolution: number): void {
    this.backSolid.clear()
    this.backSolid.beginFill(0x000000, 0.35)
    this.backSolid.drawRect(Math.max(0, (width - this.header.width) / 2), 0, 460, height)
    this.backSolid.endFill()

    this.back.x = width / 2

    this.header.x = Math.max(0, (width - this.header.width) / 2)
    this.header.resize(width, height, resolution)

    this.skills.x = width / 2
    this.skills.y = this.header.y + this.header.height + 56

    this.log.x = width / 2
    this.log.y = this.skills.y + 55
    this.log.resize(width, height, resolution)
  }

  update(dt: number): void {
  }
}