import * as PIXI from 'pixi.js'

import { gsap, TweenMax } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'

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

  static async bossDamage(obj: any): Promise<void> {
    return new Promise(resolve => {
      TweenMax.to(obj.scale, 0.2, {
        x: 1.25, y: 1.25, onComplete: () => {
          TweenMax.to(obj.scale, 0.25, { x: 1, y: 1, onComplete: () => resolve() })
        },
      })

      TweenUtils.photoDamage(obj)
    })
  }

  static async bossAttack(obj: any): Promise<void> {
    return new Promise(resolve => {
      TweenMax.to(obj.scale, 0.2, {
        x: 1.25, y: 1.25, onComplete: () => {
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