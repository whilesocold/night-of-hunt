import { CustomPIXIComponent } from 'react-pixi-fiber'
import * as PIXI from 'pixi.js'

const TYPE = 'AnimatedSprite'
export const behavior = {
  customDisplayObject: props => {
    const sprite = new PIXI.AnimatedSprite(props.frames)

    sprite.animationSpeed = props.animationSpeed
    sprite.loop = props.loop
    sprite.anchor.copyFrom(props.anchor)

    sprite.play()

    return sprite
  },
  customApplyProps: function(instance, oldProps, newProps) {
    let { animationSpeed, loop, anchor, frames } = newProps

    if (typeof animationSpeed === 'undefined') {
      animationSpeed = instance.animationSpeed
    }

    if (typeof loop === 'undefined') {
      loop = instance.loop
    }

    if (typeof anchor === 'undefined') {
      anchor = instance.anchor.clone()
    }

    if (typeof frames === 'undefined') {
      frames = instance.textures
    }

    instance.animationSpeed = animationSpeed
    instance.loop = loop
    instance.frames = frames
    instance.anchor.copyFrom(anchor)
  },
}

const animatedSprite = CustomPIXIComponent(behavior, TYPE)

export { animatedSprite as AnimatedSprite }