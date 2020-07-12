import React, { Component } from 'react'
import { Container, Sprite } from 'react-pixi-fiber'
import { ResourceManager } from '../../utils/resources/ResourceManager'
import { FightAvatar } from './FightAvatar'
import { FightAvatarName } from './FightAvatarName'
import { Rectangle } from '../Rectangle'
import { FightHealth } from './FightHealth'
import { FightHealthbar } from './FightHealthbar'

export class FightHeader extends Component<any, any> {
  render() {
    const { bossTexture } = this.props

    const backTexture = ResourceManager.instance.getTexture('back.jpg')

    const bossHealth = 100
    const userHealth = 100

    return <Container>
      <Sprite anchor={{ x: 0, y: 0 }} texture={backTexture}/>
      <Sprite x={backTexture.width / 2}
              y={backTexture.height}
              anchor={{ x: 0.5, y: 1 }} texture={bossTexture}/>

      <Rectangle width={backTexture.width} height={39} fill={'#000000'} alpha={0.5}/>
      <FightAvatar texture={null}/>
      <FightAvatarName anchor={{ x: 0, y: 0.5 }} x={50} y={18} color={'#e82d2c'} text={'Оборотень Сержант Генрих'}/>
      <FightHealth x={backTexture.width - 70} y={18} color={'#6085ad'} text={bossHealth.toString()}/>
      <FightHealthbar x={39} y={30} width={420} progress={userHealth}/>

      <Rectangle width={backTexture.width} y={backTexture.height - 39} height={39} fill={'#000000'} alpha={0.5}/>
      <FightAvatar anchor={{ x: 0, y: 1 }} texture={null} y={backTexture.height}/>
      <FightAvatarName anchor={{ x: 0, y: 0.5 }} x={50} y={backTexture.height - 22} color={'#6085ad'} text={'Вы'}/>
      <FightHealth x={backTexture.width - 70} y={backTexture.height - 22} color={'#6085ad'}
                   text={userHealth.toString()}/>
      <FightHealthbar x={39} y={backTexture.height - 9} width={420} progress={userHealth}/>

    </Container>
  }
}