import React, { Component } from 'react'
import { Container, Sprite } from 'react-pixi-fiber'
import { ResourceManager } from '../../utils/resources/ResourceManager'
import { BattleUserPhoto } from './BattleUserPhoto'
import { BattleUserName } from './BattleUserName'
import { Rectangle } from '../Rectangle'
import { BattleHealth } from './BattleHealth'
import { BattleHealthbar } from './BattleHealthbar'

export class BattleHeader extends Component<any, any> {
  render() {
    const { bossTexture, response } = this.props

    const backTexture = ResourceManager.instance.getTexture('back.jpg')

    const bossName = response.enemy.name2
    const bossHealth = response.enemy.currentHealth
    const bossHealthProgress = response.enemy.currentHealthPercent

    const userName = response.user.name
    const userHealth = response.user.currentHealth
    const userHealthProgress = response.user.currentHealthPercent

    return <Container>
      <Sprite anchor={{ x: 0, y: 0 }} texture={backTexture}/>
      <Sprite x={backTexture.width / 2}
              y={backTexture.height}
              anchor={{ x: 0.5, y: 1 }} texture={bossTexture}/>

      <Rectangle width={backTexture.width} height={39} fill={'#000000'} alpha={0.5}/>
      <BattleUserPhoto texture={null}/>
      <BattleUserName anchor={{ x: 0, y: 0.5 }} x={50} y={18} color={'#e82d2c'} text={bossName}/>
      <BattleHealth x={backTexture.width - 70} y={18} color={'#6085ad'} text={bossHealth.toString()}/>
      <BattleHealthbar x={39} y={30} width={420} progress={bossHealthProgress}/>

      <Rectangle width={backTexture.width} y={backTexture.height - 39} height={39} fill={'#000000'} alpha={0.5}/>
      <BattleUserPhoto anchor={{ x: 0, y: 1 }} texture={null} y={backTexture.height}/>
      <BattleUserName anchor={{ x: 0, y: 0.5 }} x={50} y={backTexture.height - 22} color={'#6085ad'} text={userName}/>
      <BattleHealth x={backTexture.width - 70} y={backTexture.height - 22} color={'#6085ad'}
                    text={userHealth.toString()}/>
      <BattleHealthbar x={39} y={backTexture.height - 9} width={420} progress={userHealthProgress}/>

    </Container>
  }
}