import React, { Component } from 'react'
import { Container, Sprite, Text } from 'react-pixi-fiber'
import { ResourceManager } from '../../utils/resources/ResourceManager'

export enum FightHealthType {
  Blue = 'FightHealthType.Blue',
  Red = 'FightHealthType.Red',
}

export class FightHealth extends Component<any, any> {
  render() {
    let { x, y, text, type } = this.props

    x = x || 0
    y = y || 0

    const texture = ResourceManager.instance.getTexture(type === FightHealthType.Blue ? 'heart_blue.png' : 'heart_red.png')

    return <Container>
      <Sprite x={x} y={y + 1} anchor={{ x: 0, y: 0.5 }} texture={texture}/>
      <Text x={x + texture.width} y={y} anchor={{ x: 0, y: 0.5 }} text={text} style={{
        fontFamily: 'Munchkin-fnt',
        fontSize: 16,
        fill: type === FightHealthType.Blue ? '#6085ad' : '#e82d2c',
      }}/>
    </Container>
  }
}