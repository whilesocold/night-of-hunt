import React, { Component } from 'react'
import { Rectangle } from '../Rectangle'
import { Container } from 'react-pixi-fiber'
import { Utils } from '../../utils/Utils'

export class FightHealthbar extends Component<any, any> {
  render() {
    let { x, y, width, progress } = this.props

    x = x || 0
    y = y || 0

    return <Container x={x} y={y}>
      <Rectangle x={1} y={0} width={width} height={8} fill={0x000000} strokeThickness={1} strokeFill={0x423b32}/>
      <Rectangle x={1} y={1} width={Utils.remap(progress, 0, 100, 0, width - 1)} height={6} fill={0xff0000}/>
    </Container>
  }
}