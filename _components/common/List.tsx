import { CustomPIXIComponent } from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'

import { gsap, TweenMax } from 'gsap'

const TYPE = 'List'
export const behavior = {
  customDisplayObject: props => new PIXI.Container(),
  customApplyProps: function(instance, oldProps, newProps) {
    let { x, y, margin, items } = newProps

    instance.x = x
    instance.y = y

    while (instance.children.length > 0) {
      instance.removeChildAt(0)
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      item.x = 0

      gsap.killTweensOf(item)
      gsap.killTweensOf(item.scale)

      TweenMax.to(item, 0.5, { y: item.height + margin.y * i })

      if (i === 0) {
        TweenMax.to(item.scale, 0.5, { x: 1.15, y: 1.15 })

      } else {
        TweenMax.to(item.scale, 0.5, { x: 1, y: 1 })
      }

      instance.addChild(item)
    }
  },
}

const list = CustomPIXIComponent(behavior, TYPE)

export { list as List }