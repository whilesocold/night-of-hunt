import { Container, ParticleContainer } from 'react-pixi-fiber'
import React from 'react'
import * as PIXIParticles from 'pixi-particles'

export class MaskingEffect extends React.Component<any, any> {
  protected containerRef: any
  protected emitter: PIXIParticles.Emitter

  componentDidMount(): void {
    const { images, config } = this.props

    this.emitter = new PIXIParticles.Emitter(this.containerRef, images, config)
  }

  componentWillUnmount(): void {
    if (this.emitter) {
      this.emitter.destroy()
      this.emitter = null
    }
  }

  render(): React.ReactNode {
    const { mask } = this.props

    return <Container mask={mask}>
      <ParticleContainer ref={ref => this.containerRef = ref}>

      </ParticleContainer>
    </Container>
  }
}