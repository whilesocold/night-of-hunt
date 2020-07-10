import React, { Component } from 'react'
import { Sprite } from 'react-pixi-fiber'
import { ResourceManager } from '../../utils/resources/ResourceManager'

export class FightHeader extends Component<any, any> {
  render() {
    return <Sprite anchor={{ x: 0.5, y: 0 }} texture={ResourceManager.instance.getTexture('back.jpg')}/>
  }
}