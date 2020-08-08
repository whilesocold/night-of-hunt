import * as PIXI from 'pixi.js'

import { Elastic, gsap, TweenMax } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
import { Utils } from './Utils'

gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI(PIXI)

export class TweenUtils {
  static async buttonClick(obj: any): Promise<void> {
    return new Promise(resolve => {
      TweenMax.to(obj.scale, 0.25, {
        x: 1.25, y: 1.25, onComplete: () => {
          TweenMax.to(obj.scale, 0.25, { x: 1, y: 1, onComplete: () => resolve() })
        },
      })
    })
  }

  static enemyStand(obj: any): void {
    TweenMax.to(obj.scale, 0.75, { x: 1, y: 1.02, repeat: -1, yoyo: true })
  }

  static async enemyDamage(obj: any): Promise<void> {
    return new Promise(resolve => {
      let x = obj.x
      let margin = 15

      margin = Utils.randomRange(-margin, margin)

      TweenMax.to(obj, 0.5, {
        x: x + margin, ease: Elastic.easeIn, onComplete: () => {
          TweenMax.to(obj, 0.5, { x: x, ease: Elastic.easeOut, onComplete: () => resolve() })
        },
      })

      TweenUtils.photoDamage(obj)
    })
  }

  static async attackToEnemy(obj: any): Promise<void> {
    return new Promise(resolve => {
      TweenMax.to(obj.scale, 0.2, {
        x: 1.15, y: 1.15, onComplete: () => {
          TweenMax.to(obj.scale, 0.25, { x: 1, y: 1, onComplete: () => resolve() })
        },
      })
    })
  }

  static async photoDamage(obj: any): Promise<void> {
    TweenMax.to(obj, 0.5, {
      pixi: { tint: 0xff0000 }, onComplete: () => {
        TweenMax.to(obj, 0.25, { pixi: { tint: 0xffffff } })
      },
    })
  }
}