import { TweenMax } from 'gsap'

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
      tint: 0xff0000, onComplete: () => {
        TweenMax.to(obj, 0.25, { tint: 0xffffff })
      },
    })
  }
}