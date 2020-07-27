import React, { Component } from 'react'
import { Container, Sprite } from 'react-pixi-fiber'

import { TweenMax } from 'gsap'

import { App } from '../../App'
import { Rectangle } from '../Rectangle'

import { ResourceManager } from '../../utils/resources/ResourceManager'
import { BattleUserPhoto } from './BattleUserPhoto'
import { BattleUserName } from './BattleUserName'
import { BattleHealth } from './BattleHealth'
import { BattleHealthbar } from './BattleHealthbar'
import { TweenUtils } from '../../utils/TweenUtils'
import { BattleDamage } from './BattleDamage'
import { Utils } from '../../utils/Utils'

export class BattleHeader extends Component<any, any> {
  private onResponseChangeBind: (changed: any) => void

  private bossRef: any
  private userPhotoRef: any
  private bossPhotoRef: any

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

    TweenMax.to(this.bossRef.scale, 0.75, { x: 1, y: 1.02, repeat: -1, yoyo: true })
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

      TweenUtils.photoDamage(this.userPhotoRef.getPhoto())
      TweenUtils.photoDamage(this.bossPhotoRef.getPhoto())

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
    let { x, y, bossId, response } = this.props

    if (this.state.response) {
      response = this.state.response
    }

    const backTexture = ResourceManager.instance.getTexture('back5.jpg')
    const bossTexture = ResourceManager.instance.getTexture('boss_' + bossId + '.png')

    const userPhotoTexture = ResourceManager.instance.getTexture('maneken.png')
    const bossPhotoTexture = ResourceManager.instance.getTexture('boss_photo_' + bossId + '.png')

    const bossName = response.enemy.name2
    const bossHealth = response.enemy.currentHealth
    const bossHealthProgress = response.enemy.currentHealthPercent

    const userName = response.user.name
    const userHealth = response.user.currentHealth
    const userHealthProgress = response.user.currentHealthPercent

    const fightLog = response.user.fightLog[0]

    const damageRandomMargin = { x: 50, y: 50 }

    damageRandomMargin.x = Utils.randomRange(0, damageRandomMargin.x)
    damageRandomMargin.y = Utils.randomRange(0, damageRandomMargin.y)

    return <Container x={x} y={y}>
      <Sprite anchor={{ x: 0, y: 0 }} texture={backTexture}/>
      <Sprite ref={div => this.bossRef = div}
              x={backTexture.width / 2}
              y={backTexture.height + 20}
              anchor={{ x: 0.5, y: 1 }} texture={bossTexture}/>

      <Rectangle width={backTexture.width} height={39} fill={'#000000'} alpha={0.5}/>
      <BattleUserPhoto ref={div => this.bossPhotoRef = div} texture={bossPhotoTexture}/>
      <BattleUserName anchor={{ x: 0, y: 0.5 }} x={50} y={24} color={'#e82d2c'} text={bossName}/>
      <BattleHealth x={backTexture.width - 70} y={24} color={'#6085ad'} text={bossHealth.toString()}/>
      <BattleHealthbar x={39} y={0} width={420} progress={bossHealthProgress}/>

      <Rectangle width={backTexture.width} y={backTexture.height - 39} height={39} fill={'#000000'} alpha={0.5}/>
      <BattleUserPhoto ref={div => this.userPhotoRef = div} texture={userPhotoTexture}
                       y={backTexture.height - userPhotoTexture.height}/>
      <BattleUserName anchor={{ x: 0, y: 0.5 }} x={50} y={backTexture.height - 24} color={'#6085ad'} text={userName}/>
      <BattleHealth x={backTexture.width - 70} y={backTexture.height - 24} color={'#6085ad'}
                    text={userHealth.toString()}/>
      <BattleHealthbar x={39} y={backTexture.height - 9} width={420} progress={userHealthProgress}/>

      {this.state.showDamage ? <BattleDamage x={backTexture.width / 2 + damageRandomMargin.x}
                                             y={backTexture.height / 2 + damageRandomMargin.y}
                                             damage={fightLog.damage}
      /> : null}

    </Container>
  }
}