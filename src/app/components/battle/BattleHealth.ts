import * as PIXI from 'pixi.js'

import { ResourceManager } from '../../utils/resources/ResourceManager'

export enum BattleHealthType {
  Blue = 'BattleHealthType.Blue',
  Red = 'BattleHealthType.Red',
}

export class BattleHealth extends PIXI.Container {
  protected sprite: PIXI.Sprite
  protected label: PIXI.Text

  constructor(type: string, value: number) {
    super()

    const margin = 3

    this.sprite = new PIXI.Sprite(ResourceManager.instance.getTexture(type === BattleHealthType.Blue ? 'heart_blue.png' : 'heart_red.png'))
    this.sprite.anchor.set(0, 0.5)

    this.label = new PIXI.Text(value.toString(), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 16,
      fill: type === BattleHealthType.Blue ? '#6085ad' : '#e82d2c',
    })
    this.label.anchor.set(0, 0.5)
    this.label.position.set(this.sprite.width + margin, 0)

    this.addChild(this.sprite)
    this.addChild(this.label)
  }
}