import React, { Component } from 'react'
import { Container, Sprite } from 'react-pixi-fiber'
import { BattleHeader } from './battle/BattleHeader'
import { ResourceManager } from '../utils/resources/ResourceManager'
import { BattleSkillGroup } from './battle/BattleSkillGroup'
import { BattleJournal } from './battle/BattleJournal'
import { App } from '../App'
import { DataStorage } from '../utils/DataStorage'

export class Root extends Component<any, any> {
  private storage: DataStorage
  private updateResponseBind: () => void

  constructor(props: any) {
    super(props)

    this.state = { width: 0, height: 0 }
    this.storage = App.instance.getStorage()

    this.updateResponseBind = this.updateResponse.bind(this)
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  componentDidMount() {
    this.updateDimensions()

    window.addEventListener('resize', this.updateDimensions)
    this.storage.on('change:response', this.updateResponseBind)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
    this.storage.off('change:response', this.updateResponseBind)
  }

  updateResponse(e: any): void {
    this.setState({ response: this.storage.get('response') })
  }

  render() {
    let { width, bossId, response, onSkillDown } = this.props

    if (this.state.response) {
      response = this.state.response
    }

    const bgTexture = ResourceManager.instance.getTexture('main_back.jpg')

    const userFightDeck = response.user.fightDeck
    const journal = response.user.fightLog
    const reward = response.reward

    const hasJournal = journal.length > 0
    const hasReward = false//typeof reward !== 'undefined'

    const battleContent = hasReward ? null : <Container>
      <BattleHeader x={(this.state.width - width) / 2} y={0} response={response} bossId={bossId}/>
      <BattleSkillGroup x={this.state.width / 2} y={350} fightDeck={userFightDeck} onSkillDown={onSkillDown}/>
      {hasJournal ? <BattleJournal x={this.state.width / 2} y={420} journal={journal}/> : null}
    </Container>

    return <Container>
      <Sprite texture={bgTexture}/>
      {battleContent}
    </Container>
  }
}