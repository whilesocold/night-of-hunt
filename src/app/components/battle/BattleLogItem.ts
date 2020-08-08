import * as PIXI from 'pixi.js'

import { ResourceManager } from '../../utils/resources/ResourceManager'

export class BattleLogItem extends PIXI.Container {
  constructor(userSchool: number, userDamage: number, enemySchool: number, enemyDamage: number) {
    super()

    const userSchoolTexture = ResourceManager.instance.getTexture('fight_my_log_school_' + userSchool + '.png')
    const schoolTexture = ResourceManager.instance.getTexture('fight_log_school_' + enemySchool + '.png')

    if (!userSchoolTexture) {
      console.error('BattleJournalItem::render() wrong userSchoolTexture with id ' + userSchool)
    }

    if (!schoolTexture) {
      console.error('BattleJournalItem::render() wrong schoolTexture with id ' + enemySchool)
    }

    const logTexture = ResourceManager.instance.getTexture(userDamage < enemyDamage ? 'log2.png' : 'log3.png')

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

    const enemyDamageText = new PIXI.Text(enemyDamage > 0 ? enemyDamage.toString(): '', {
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