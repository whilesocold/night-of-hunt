import * as PIXI from 'pixi.js'

import { BattleHeader } from './BattleHeader'
import { ResourceManager } from '../../utils/resources/ResourceManager'
import { BattleSkills } from './BattleSkills'
import { EventBus } from '../../App'
import { GameEvent } from '../../data/GameEvent'

export class BattleScreen extends PIXI.Container {
  protected back: PIXI.Sprite
  protected header: BattleHeader
  protected skills: BattleSkills

  constructor() {
    super()

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('main_back.jpg'))

    this.header = new BattleHeader()
    this.skills = new BattleSkills()

    this.addChild(this.back)
    this.addChild(this.header)
    this.addChild(this.skills)
  }

  resize(width: number, height: number): void {
    this.header.x = (width - this.header.width) / 2
    this.skills.x = (width - this.skills.width) / 2
    this.skills.y = this.header.y + this.header.height + this.skills.height / 2 + 30
  }

  update(dt: number): void {
  }
}