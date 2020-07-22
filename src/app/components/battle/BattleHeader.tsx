import React, { Component } from 'react'
import { Container, Sprite } from 'react-pixi-fiber'

import { App } from '../../App'
import { Rectangle } from '../Rectangle'

import { ResourceManager } from '../../utils/resources/ResourceManager'
import { BattleUserPhoto } from './BattleUserPhoto'
import { BattleUserName } from './BattleUserName'
import { BattleHealth } from './BattleHealth'
import { BattleHealthbar } from './BattleHealthbar'
import { TweenUtils } from '../../utils/TweenUtils'
import { BattleDamage } from './BattleDamage'

export class BattleHeader extends Component<any, any> {
  private onResponseChangeBind: (changed: any) => void
  private bossRef: any

  constructor(props: any) {
    super(props)

    this.state = {
      response: null,
      showDamage: false,
    }

    this.onResponseChangeBind = this.onResponseChange.bind(this)
  }

  componentDidMount(): void {
    App.instance.getStorage().on('change:response', this.onResponseChangeBind)
  }

  componentWillUnmount(): void {
    App.instance.getStorage().off('change:response', this.onResponseChangeBind)
  }

  onResponseChange(e: any): void {
    const state = {
      response: e.changed.get('response'),
      showDamage: false,
    }

    if (this.bossRef) {
      state.showDamage = true

      TweenUtils.bossAttack(this.bossRef)

      setTimeout(() => {
        this.setState({
          response: e.changed.get('response'),
          showDamage: false,
        })
      }, 2 * 1000)
    }

    this.setState(state)
  }

  render() {
    let { x, y, bossTexture, response } = this.props

    if (this.state.response) {
      response = this.state.response
    }

    const backTexture = ResourceManager.instance.getTexture('back3.jpg')

    const bossName = response.enemy.name2
    const bossHealth = response.enemy.currentHealth
    const bossHealthProgress = response.enemy.currentHealthPercent

    const userName = response.user.name
    const userHealth = response.user.currentHealth
    const userHealthProgress = response.user.currentHealthPercent

    const fightLog = response.user.fightLog[0]

    return <Container x={x} y={y}>
      <Sprite anchor={{ x: 0, y: 0 }} texture={backTexture}/>
      <Sprite ref={div => this.bossRef = div}
              x={backTexture.width / 2}
              y={backTexture.height - bossTexture.height / 2 + 20}
              anchor={{ x: 0.5, y: 0.5 }} texture={bossTexture}/>

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

      {this.state.showDamage ? <BattleDamage x={backTexture.width / 2}
                                             y={backTexture.height / 2}
                                             damage={fightLog.damage}
      /> : null}

    </Container>
  }
}