import * as PIXI from 'pixi.js'
import * as PIXIParticles from 'pixi-particles'

export class MaskingEffect extends PIXI.Container {
  protected container: PIXI.ParticleContainer
  protected emitter: PIXIParticles.Emitter

  constructor(images, config) {
    super()

    this.container = new PIXI.ParticleContainer()
    this.addChild(this.container)

    this.emitter = new PIXIParticles.Emitter(this.container, images, config)
  }

  release(): void {
    if (this.emitter) {
      this.emitter.destroy()
      this.emitter = null
    }
  }
}