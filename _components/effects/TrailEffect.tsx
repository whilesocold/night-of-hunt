import { Container, ParticleContainer } from 'react-pixi-fiber'
import React from 'react'

import * as PIXIParticles from 'pixi-particles'
import * as PIXI from 'pixi.js'

import { TweenMax } from 'gsap'
import { Utils } from '../../src/app/utils/Utils'
import { ResourceManager } from '../../src/app/utils/resources/ResourceManager'

export class TrailEffect extends React.Component<any, any> {
  protected containerRef: any
  protected emitter: PIXIParticles.Emitter

  createTexture(r1: number, r2: number, resolution: number): PIXI.Texture {
    const c = (r2 + 1) * resolution
    r1 *= resolution
    r2 *= resolution

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = canvas.height = c * 2

    const gradient = context.createRadialGradient(c, c, r1, c, c, r2)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, canvas.height)

    return PIXI.Texture.from(canvas)
  }

  componentDidMount(): void {
    const { x, y, margin, time } = this.props

    const texture = this.createTexture(0, 8, window.devicePixelRatio)

    this.emitter = new PIXIParticles.Emitter(this.containerRef, [texture], {
      autoUpdate: true,
      alpha: {
        start: 0.5,
        end: 0,
      },
      scale: {
        start: 1,
        end: 0,
        minimumScaleMultiplier: 1,
      },
      color: {
        start: '#e3f9ff',
        end: '#2196F3',
      },
      speed: {
        start: 0,
        end: 0,
        minimumSpeedMultiplier: 1,
      },
      acceleration: {
        x: 0,
        y: 0,
      },
      maxSpeed: 0,
      startRotation: {
        min: 0,
        max: 0,
      },
      noRotation: true,
      rotationSpeed: {
        min: 0,
        max: 0,
      },
      lifetime: {
        min: 0.4,
        max: 0.4,
      },
      blendMode: 'normal',
      frequency: 0.0008,
      emitterLifetime: 0.2,
      maxParticles: 5000,
      pos: {
        x: 0,
        y: 0,
      },
      addAtBack: false,
      spawnType: 'point',
    })
    this.emitter.updateOwnerPos(x, y)

    const tweenObj = {}
    const target = {
      x: x + margin.x,
      y: y + margin.y,
    }

    const tween = TweenMax.to(tweenObj, time, {
      x: target.x,
      y: target.y,
      onUpdate: () => {
        this.emitter.updateOwnerPos(
          Utils.remap(tween.progress(), 0, 1, x, target.x),
          Utils.remap(tween.progress(), 0, 1, y, target.y))
      },
    })
  }

  componentWillUnmount(): void {
    if (this.emitter) {
      this.emitter.destroy()
      this.emitter = null
    }
  }

  render(): React.ReactNode {
    return <Container>
      <ParticleContainer ref={ref => this.containerRef = ref}/>
    </Container>
  }
}