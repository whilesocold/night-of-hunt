import * as PIXI from 'pixi.js'

import { ResourceManager } from '../../utils/resources/ResourceManager'

export class BattleUserPhoto extends PIXI.Container {
  protected back: PIXI.Sprite
  protected front: PIXI.Sprite

  constructor(fileName: string) {
    super()

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('default_avatar.png'))
    this.front = new PIXI.Sprite(ResourceManager.instance.getTexture(fileName))
    this.front.anchor.set(0.5, 0.5)
    this.front.position.set(this.back.width / 2, this.back.height / 2)

    this.addChild(this.back)
    this.addChild(this.front)
  }
}