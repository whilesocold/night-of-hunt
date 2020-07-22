import React, { Component } from 'react'
import { Container, Text } from 'react-pixi-fiber'

import { TweenMax } from 'gsap'

export class BattleDamage extends Component<any, any> {
  private ref: any

  componentDidMount(): void {
    TweenMax.to(this.ref, 0.35, { alpha: 1 })
  }

  render() {
    let { anchor, x, y, damage } = this.props

    anchor = anchor || { x: 0.5, y: 0.5 }
    x = x || 0
    y = y || 0

    return <Container x={x} y={y} ref={ref => this.ref = ref} alpha={0}>
      <Text anchor={anchor} text={'-' + damage.toString()} style={{
        fontFamily: 'Munchkin-fnt',
        fontSize: 64,
        fill: 0xff0000,
      }}/>
    </Container>
  }
}