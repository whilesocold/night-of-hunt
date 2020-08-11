import * as PIXI from 'pixi.js'

import { BattleHeader } from './BattleHeader'
import { ResourceManager } from '../../utils/resources/ResourceManager'
import { BattleSkills } from './BattleSkills'
import { BattleLog } from './BattleLog'

export class BattleScreen extends PIXI.Container {
  protected container: PIXI.Container

  protected back: PIXI.Sprite

  protected header: BattleHeader
  protected skills: BattleSkills
  protected log: BattleLog

  constructor() {
    super()

    this.container = new PIXI.Container()

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('main_back.jpg'))

    this.header = new BattleHeader()
    this.skills = new BattleSkills()
    this.log = new BattleLog()

    this.addChild(this.back)
    this.container.addChild(this.header)
    this.container.addChild(this.log)
    this.container.addChild(this.skills)

    this.addChild(this.container)
  }

  resize(width: number, height: number, ratio: number): void {
    this.header.y = 0
    this.skills.x = this.header.width / 2
    this.skills.y = this.header.y + this.header.height + 80
    this.log.x = this.header.width / 2
    this.log.y = this.skills.y + 80

    console.log(ratio)

    this.container.scale.set(Math.min(width / 460, height / 750) / ratio)

    const local = this.toLocal(new PIXI.Point(
      width / 2 / ratio,
      0), this.parent)

    this.container.position.set(
      local.x - this.container.width / 2 ,
      local.y )
  }

  update(dt: number): void {
  }
}