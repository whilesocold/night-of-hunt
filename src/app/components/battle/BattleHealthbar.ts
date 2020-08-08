import * as PIXI from 'pixi.js'
import { Utils } from '../../utils/Utils'
import { TweenMax } from 'gsap'

export class BattleHealthbar extends PIXI.Container {
  protected back: PIXI.Graphics
  protected front: PIXI.Graphics
  protected frame: PIXI.Graphics

  protected tweenObject: any

  protected size: { width: number, height: number }

  constructor(value: number, width: number, height: number) {
    super()

    this.size = { width: width, height: height }
    this.tweenObject = { width: 0 }


    this.back = new PIXI.Graphics()
    this.front = new PIXI.Graphics()

    this.frame = new PIXI.Graphics()
    this.frame.lineStyle(1, 0x423b32)
    this.frame.drawRect(0, 0, width, height)
    this.frame.endFill()

    this.addChild(this.back)
    this.addChild(this.front)
    this.addChild(this.frame)

    this.setValue(value, true)
  }

  public setValue(value: number, now: boolean = false): void {
    const currentWidth = Utils.remap(value, 0, 100, 0, this.size.width - 2)

    this.front.clear()
    this.front.beginFill(0xff0000)
    this.front.drawRect(1, 1, currentWidth, this.size.height - 2)
    this.front.endFill()

    if (now) {
      this.tweenObject.width = currentWidth

      this.back.clear()
      this.back.beginFill(0x00ff00)
      this.back.drawRect(1, 1, currentWidth, this.size.height - 2)
      this.back.endFill()

    } else {
      TweenMax.to(this.tweenObject, 1, {
        width: currentWidth, onUpdate: (e) => {
          this.back.clear()
          this.back.beginFill(0x00ff00)
          this.back.drawRect(1, 1, this.tweenObject.width, this.size.height - 2)
          this.back.endFill()
        },
      })
    }
  }
}