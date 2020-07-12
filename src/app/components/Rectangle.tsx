import { CustomPIXIComponent } from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'

const TYPE = 'Rectangle'
export const behavior = {
  customDisplayObject: props => new PIXI.Graphics(),
  customApplyProps: function(instance, oldProps, newProps) {
    let { fill, alpha, x, y, width, height, strokeFill, strokeAlpha, strokeThickness } = newProps

    if (typeof alpha === 'undefined') {
      alpha = 1
    }

    if (typeof strokeThickness === 'undefined') {
      strokeThickness = 0
    }

    instance.clear()
    instance.lineStyle(strokeThickness, strokeFill, strokeAlpha)
    instance.beginFill(fill, alpha)
    instance.drawRect(x, y, width, height)
    instance.endFill()
  },
}

const rectangle = CustomPIXIComponent(behavior, TYPE)

export { rectangle as Rectangle }