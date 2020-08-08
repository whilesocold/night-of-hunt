import { Container } from 'react-pixi-fiber'
import React from 'react'

import * as PIXI from 'pixi.js'

import { AnimatedSprite } from '../common/AnimatedSprite'
import { ResourceManager } from '../../src/app/utils/resources/ResourceManager'

export class BloodSplashEffect extends React.Component<any, any> {
  protected containerRef: any
  protected animatedSpriteRef: any

  componentWillUnmount(): void {
    if (this.animatedSpriteRef) {
      this.animatedSpriteRef.stop()
    }
  }

  render(): React.ReactNode {
    const { x, y, textureName, frameWidth, frameHeight, framesCount } = this.props
    
    const baseTexture = ResourceManager.instance.getTexture(textureName)

    let frameColumn = 0
    let frameColumns = 4

    let frameX = 0
    let frameY = 0

    const frames = []

    for (let i = 1; i <= framesCount; i++) {
      frames.push(new PIXI.Texture(baseTexture, new PIXI.Rectangle(frameX, frameY, frameWidth, frameHeight)))

      if (frameColumn < frameColumns - 1) {
        frameX += frameWidth
        frameColumn++

      } else {
        frameX = 0
        frameY += frameHeight
        frameColumn = 0
      }
    }

    return <Container x={x} y={y} ref={ref => this.containerRef = ref}>
      <AnimatedSprite ref={ref => this.animatedSpriteRef = ref}
                      anchor={{ x: 0.5, y: 0.5 }}
                      frames={frames}
                      animationSpeed={0.5}
                      loop={false}/>
    </Container>
  }
}