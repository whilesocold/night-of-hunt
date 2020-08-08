import * as PIXI from 'pixi.js'

import { BattleHeader } from './BattleHeader'
import { ResourceManager } from '../../utils/resources/ResourceManager'
import { BattleSkills } from './BattleSkills'
import { BattleLog } from './BattleLog'

export class BattleScreen extends PIXI.Container {
  protected back: PIXI.Sprite
  protected header: BattleHeader
  protected skills: BattleSkills
  protected log: BattleLog

  constructor() {
    super()

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('main_back.jpg'))

    this.header = new BattleHeader()
    this.skills = new BattleSkills()
    this.log = new BattleLog()

    this.addChild(this.back)
    this.addChild(this.header)
    this.addChild(this.skills)
    this.addChild(this.log)
  }

  resize(width: number, height: number): void {
    this.header.x = (width - this.header.width) / 2
    this.skills.x = width / 2
    this.skills.y = this.header.y + this.header.height + this.skills.height / 2 + 30
    this.log.x = width / 2
    this.log.y = this.skills.y + this.skills.height / 2 + 20
  }

  update(dt: number): void {
  }
}