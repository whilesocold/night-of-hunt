import React, { Component } from 'react'
import { Sprite } from 'react-pixi-fiber'
import { ResourceManager } from '../../utils/resources/ResourceManager'

export class BattleUserPhoto extends Component<any, any> {
  render() {
    let { texture, anchor, x, y } = this.props

    texture = texture || ResourceManager.instance.getTexture('default_avatar.jpg')
    anchor = anchor || { x: 0, y: 0 }
    x = x || 0
    y = y || 0

    return <Sprite x={x} y={y} anchor={anchor} texture={texture}/>
  }
}