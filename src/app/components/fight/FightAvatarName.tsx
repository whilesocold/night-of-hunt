import React, { Component } from 'react'
import { Text } from 'react-pixi-fiber'

export class FightAvatarName extends Component<any, any> {
  render() {
    let { anchor, x, y, text, color } = this.props

    anchor = anchor || { x: 0, y: 0 }
    x = x || 0
    y = y || 0

    return <Text x={x} y={y} anchor={anchor} text={text} style={{
      fontFamily: 'Munchkin-fnt',
      fontSize: 16,
      fill: color,
    }}/>
  }
}