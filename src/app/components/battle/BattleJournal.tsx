import React, { Component } from 'react'
import { Container, Sprite, Text } from 'react-pixi-fiber'
import { ResourceManager } from '../../utils/resources/ResourceManager'
import { App } from '../../App'
import { TweenMax } from 'gsap'

export class BattleJournalItem extends Component<any, any> {
  private ref: any

  componentDidMount(): void {
    this.ref.alpha = 0

    TweenMax.to(this.ref, 0.35, { alpha: 1 })
  }

  render() {
    const { x, y, userSchool, userDamage, enemySchool, enemyDamage } = this.props

    const userSchoolTexture = ResourceManager.instance.getTexture('fight_my_log_school_' + userSchool + '.png')
    const schoolTexture = ResourceManager.instance.getTexture('fight_log_school_' + enemySchool + '.png')

    if (!userSchoolTexture) {
      console.error('BattleJournalItem::render() wrong userSchoolTexture with id ' + userSchool)
    }

    if (!schoolTexture) {
      console.error('BattleJournalItem::render() wrong schoolTexture with id ' + enemySchool)
    }

    const logTexture = ResourceManager.instance.getTexture(userDamage > enemyDamage ? 'log2.png' : 'log3.png')

    return <Container x={x} y={y} ref={div => this.ref = div}>
      <Sprite x={-100} anchor={{ x: 1, y: 0.5 }} texture={userSchoolTexture}/>
      <Text anchor={{ x: 0, y: 0.5 }} x={-90} text={userDamage.toString()}
            style={{
              fontFamily: 'Munchkin-fnt',
              fontSize: 14,
              fill: 0x3ead02,
            }}
      />

      <Sprite x={0} anchor={{ x: 0.5, y: 0.5 }} texture={logTexture}/>

      <Sprite x={100} anchor={{ x: 0, y: 0.5 }} texture={schoolTexture}/>
      <Text anchor={{ x: 1, y: 0.5 }} x={90} text={enemyDamage.toString()}
            style={{
              fontFamily: 'Munchkin-fnt',
              fontSize: 14,
              fill: 0xa12625,
            }}
      />
    </Container>
  }
}

export class BattleJournal extends Component<any, any> {
  private onResponseChangeBind: (changed: any) => void

  constructor(props: any) {
    super(props)

    this.state = {
      response: null,
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
    this.setState({ response: e.changed.get('response') })
  }

  render() {
    let { x, y, journal } = this.props

    if (this.state.response) {
      journal = this.state.response.user.fightLog
    }

    const journalItems = []
    const journalItemStartY = 35
    const journalItemMargin = 35

    const journalLength = 3

    journal = journal.slice(0, journalLength)

    for (let i = 0; i < journal.length; i++) {
      const journalData = journal[i]

      journalItems.push(<BattleJournalItem key={i}
                                           x={0}
                                           y={journalItemStartY + journalItemMargin * i}
                                           userSchool={journalData.schools[0]}
                                           userDamage={journalData.damage}
                                           enemySchool={journalData.enemySchools[0]}
                                           enemyDamage={journalData.enemyDamage}
      />)
    }

    return <Container x={x} y={y}>
      <Text anchor={{ x: 0.5, y: 0 }} text={'Журнал боя'}
            style={{
              fontFamily: 'Munchkin-fnt',
              fontSize: 14,
              fill: 0x303c4e,
            }}/>
      {journalItems}
    </Container>
  }
}