import * as PIXI from 'pixi.js'

import { ResourceManager } from '../../utils/resources/ResourceManager'
import { TweenMax } from 'gsap'

export class BlueButton extends PIXI.Container {
  protected label: PIXI.Text

  protected left: PIXI.Sprite
  protected mid: PIXI.Sprite
  protected right: PIXI.Sprite
  protected glow: PIXI.Sprite

  constructor(title: string = 'CLICK') {
    super()

    this.label = new PIXI.Text(title, {
      fontFamily: 'Munchkin-fnt',
      fontSize: 16,
      fill: 0x68fffe,
      fontVariant: 'bold',
    })
    this.label.anchor.set(0.5)

    this.mid = new PIXI.Sprite(ResourceManager.instance.getTexture('blue_button_mid.png'))
    this.mid.width = Math.floor(this.label.width) + 20
    this.mid.anchor.set(0.5)

    this.left = new PIXI.Sprite(ResourceManager.instance.getTexture('blue_button_left.png'))
    this.left.anchor.set(1, 0.5)
    this.left.x = -this.mid.width / 2

    this.right = new PIXI.Sprite(ResourceManager.instance.getTexture('blue_button_right.png'))
    this.right.anchor.set(0, 0.5)
    this.right.x = this.mid.width / 2

    this.glow = new PIXI.Sprite(ResourceManager.instance.getTexture('school_glow_3.png'))
    this.glow.width = this.mid.width + this.left.width + this.right.width + 100
    this.glow.height = this.mid.height + 40
    this.glow.anchor.set(0.5)
    this.glow.position.set(0, -2)
    this.glow.alpha = 0

    this.addChild(this.glow)
    this.addChild(this.left)
    this.addChild(this.mid)
    this.addChild(this.right)
    this.addChild(this.label)
  }

  public playAnimation(): void {
    TweenMax.to(this.glow, 0.5, { yoyo: true, repeat: -1, alpha: 1 })
  }

  public stopAnimation(): void {
    TweenMax.to(this.glow, 0.5, { yoyo: true, repeat: -1, alpha: 1 })
  }
}