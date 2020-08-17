import * as PIXI from 'pixi.js'

import { TweenMax } from 'gsap'

export class DamageLabelEffect extends PIXI.Container {
  protected label: PIXI.Text

  constructor() {
    super()

    this.label = new PIXI.Text('', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 64,
      fill: 0xff0000,
      align: 'center'
    })
    this.label.alpha = 0
    this.label.anchor.set(0.5)
    this.addChild(this.label)
  }

  public async show(damage: number, size: number): Promise<void> {
    return new Promise(resolve => {
      this.label.text = '-' + damage.toString()
      this.label.alpha = 0
      this.label.scale.set(size)

      TweenMax.to(this.label, 0.5, { alpha: 1, onComplete: () => resolve() })
    })
  }

  public async hide(): Promise<void> {
    return new Promise(resolve => {
      TweenMax.to(this.label, 0.5, { alpha: 0, onComplete: () => resolve() })
    })
  }
}