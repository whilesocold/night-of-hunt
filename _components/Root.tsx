import React, { Component } from 'react'
import { useSelector } from 'react-redux'
import { Container, Sprite } from 'react-pixi-fiber'
import { App } from '../src/app/App'
import { DataStorage } from '../src/app/utils/DataStorage'
import { BattleStartingData } from '../src/app/data/GameEventData'
import { ResourceManager } from '../src/app/utils/resources/ResourceManager'
import { BattleHeader } from './battle/BattleHeader'
import { BattleSkillGroup } from './battle/BattleSkillGroup'
import { BattleJournal } from './battle/BattleJournal'

 class Root extends Component<any, any> {
  private storage: DataStorage
  private app: App

  private onBattleStartingBind: (data: BattleStartingData) => void
  private updateResponseBind: () => void

  constructor(props: any) {
    super(props)

    this.state = {
      width: 0,
      height: 0,
      battleStaringData: null,
    }

    this.app = App.instance
    this.storage = App.instance.getStorage()
  }

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

    const { width, bossId, onSkillDown } = this.props

    console.log('battleState', battleState)

    const bgTexture = ResourceManager.instance.getTexture('main_back.jpg')

    const userFightDeck = battleState.user.fightDeck
    const journal = battleState.user.fightLog
    const reward = battleState.reward

    const hasJournal = journal.length > 0
    const hasReward = false//typeof reward !== 'undefined'

    const battleContent = hasReward ? null : <Container>
      <BattleHeader x={(this.state.width - width) / 2} y={0} bossId={bossId}/>
      <BattleSkillGroup x={this.state.width / 2} y={430} fightDeck={userFightDeck} onSkillDown={onSkillDown}/>
      {hasJournal ? <BattleJournal x={this.state.width / 2} y={500} journal={journal}/> : null}
    </Container>

    return <Container>
      <Sprite texture={bgTexture}/>
      {battleContent}
    </Container>
  }
}

export default () => {
  const battleState = useSelector(state => state.battle)

  return (
    <AllowanceClass classes={classes} />
  )
}