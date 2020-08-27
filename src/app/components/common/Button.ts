import * as PIXI from 'pixi.js'
import { gsap, TweenMax } from 'gsap'
import { ResourceManager } from '../../utils/resources/ResourceManager'

export class Button extends PIXI.Container {
  protected sprite: PIXI.Sprite

  constructor(texture: string) {
    super()

    this.interactive = true
    this.buttonMode = true

    this.sprite = new PIXI.Sprite(ResourceManager.instance.getTexture(texture))
    this.sprite.anchor.set(0.5)

    this.on('pointerdown', () => {
      gsap.killTweensOf(this)
      TweenMax.to(this.scale, 0.2, {
        x: 1.1, y: 1.1, onComplete: () => {
          TweenMax.to(this.scale, 0.2, { x: 1, y: 1 })
        },
      })
    })

    this.addChild(this.sprite)
  }
}