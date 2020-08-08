import * as PIXI from 'pixi.js'

import { ResourceManager } from '../../utils/resources/ResourceManager'

export class AnimatedAtlasEffect extends PIXI.Container {
  protected animatedSprite: PIXI.AnimatedSprite

  public setFrames(textureName: string, frameWidth: number, frameHeight: number, framesCount: number): void {
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

    if (this.animatedSprite) {
      this.removeChild(this.animatedSprite)
    }

    this.animatedSprite = new PIXI.AnimatedSprite(frames)
    this.animatedSprite.anchor.set(0.5)
    this.animatedSprite.animationSpeed = 0.5
    this.animatedSprite.loop = false
    this.animatedSprite.stop()
    this.addChild(this.animatedSprite)
  }

  public play(): void {
    this.animatedSprite.gotoAndPlay(0)
  }

  public stop(): void {
    this.animatedSprite.stop()
  }
}
