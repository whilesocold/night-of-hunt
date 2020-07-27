import React, { Component } from 'react'
import { Container, Sprite } from 'react-pixi-fiber'
import { ResourceManager } from '../../utils/resources/ResourceManager'

export class BattleUserPhoto extends Component<any, any> {
  private protoRef: any

  render() {
    let { texture, anchor, x, y } = this.props

    texture = texture || null
    anchor = anchor || { x: 0, y: 0 }
    x = x || 0
    y = y || 0

    const backTexture = ResourceManager.instance.getTexture('default_avatar.png')

    return <Container x={x} y={y}>
      <Sprite anchor={anchor} texture={backTexture}/>
      <Sprite ref={div => this.protoRef = div}
              x={backTexture.width / 2}
              y={backTexture.height / 2}
              anchor={{ x: 0.5, y: 0.5 }}
              texture={texture}/>
    </Container>
  }

  public getPhoto(): Sprite {
    return this.protoRef
  }
}