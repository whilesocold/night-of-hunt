import React, { Component } from 'react'
import { Container, Sprite } from 'react-pixi-fiber'
import { BattleHeader } from './battle/BattleHeader'
import { ResourceManager } from '../utils/resources/ResourceManager'
import { BattleSkillGroup } from './battle/BattleSkillGroup'

export class Root extends Component<any, any> {
  state = { width: 0, height: 0 }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  componentDidMount() {
    this.updateDimensions()

    window.addEventListener('resize', this.updateDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  render() {
    const { width, bossId, response } = this.props

    const bgTexture = ResourceManager.instance.getTexture('main_back.jpg')
    const bossTexture = ResourceManager.instance.getTexture('boss_' + bossId + '.png')

    const userFightDeck = response.user.fightDeck

    return <Container>
      <Sprite texture={bgTexture}/>
      <BattleHeader x={(this.state.width - width) / 2} y={0} response={response} bossTexture={bossTexture}/>
      <BattleSkillGroup x={this.state.width / 2} y={350} fightDeck={userFightDeck}/>
    </Container>
  }
}