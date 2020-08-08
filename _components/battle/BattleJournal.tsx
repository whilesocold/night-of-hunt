import React, { Component } from 'react'

import * as PIXI from 'pixi.js'

import { Container, Text } from 'react-pixi-fiber'
import { ResourceManager } from '../../src/app/utils/resources/ResourceManager'
import { App } from '../../src/app/App'
import { List } from '../common/List'

export class BattleJournalItem extends PIXI.Container {
  constructor(props) {
    super()

    const { userSchool, userDamage, enemySchool, enemyDamage } = props

    const userSchoolTexture = ResourceManager.instance.getTexture('fight_my_log_school_' + userSchool + '.png')
    const schoolTexture = ResourceManager.instance.getTexture('fight_log_school_' + enemySchool + '.png')

    if (!userSchoolTexture) {
      console.error('BattleJournalItem::render() wrong userSchoolTexture with id ' + userSchool)
    }

    if (!schoolTexture) {
      console.error('BattleJournalItem::render() wrong schoolTexture with id ' + enemySchool)
    }

    const logTexture = ResourceManager.instance.getTexture(userDamage > enemyDamage ? 'log2.png' : 'log3.png')

    const schoolSprite = new PIXI.Sprite(userSchoolTexture)
    schoolSprite.x = -100
    schoolSprite.anchor.set(1, 0.5)

    const userDamageText = new PIXI.Text(userDamage.toString(), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 14,
      fill: 0x3ead02,
    })
    userDamageText.x = -90
    userDamageText.anchor.set(0, 0.5)

    const logSprite = new PIXI.Sprite(logTexture)
    logSprite.anchor.set(0.5, 0.5)

    const enemyDamageText = new PIXI.Text(userDamage.toString(), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 14,
      fill: 0xa12625,
    })
    enemyDamageText.x = 90
    enemyDamageText.anchor.set(1, 0.5)

    this.addChild(
      schoolSprite,
      userDamageText,
      logSprite,
      enemyDamageText,
    )
  }
}

export class BattleJournal extends Component<any, any> {
  private onResponseChangeBind: (changed: any) => void
  private items: any[]
  private itemIndex: number

  constructor(props: any) {
    super(props)

    this.items = []
    this.itemIndex = 0

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

    this.items = []

    const journalItemStartY = 35
    const journalItemMargin = 35

    const journalLength = 3

    journal = journal.slice(0, journalLength)

    for (let i = 0; i < journal.length; i++) {
      const journalData = journal[i]

      this.items.push(new BattleJournalItem({
        index: i,
        userSchool: journalData.schools[0],
        userDamage: journalData.damage,
        enemySchool: journalData.enemySchools[0],
        enemyDamage: journalData.enemyDamage,
      }))
    }

    return <Container x={x} y={y}>
      <Text anchor={{ x: 0.5, y: 0 }} text={'Журнал боя'}
            style={{
              fontFamily: 'Munchkin-fnt',
              fontSize: 14,
              fill: 0x303c4e,
            }}/>
      <List x={0} y={journalItemStartY} margin={{ y: journalItemMargin }} items={this.items}/>
    </Container>
  }
}