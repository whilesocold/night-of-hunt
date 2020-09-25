import * as PIXI from 'pixi.js'

import { ResourceManager } from '../../utils/resources/ResourceManager'
import { SearchOpponentNavMenu } from '../searchOpponent/SearchOpponentNavMenu'
import { BaseScreen } from './BaseScreen'
import { BlueButton } from '../common/BlueButton'

export class ArenaScreen extends BaseScreen {
  protected static RATING_BACK_WIDTH = 249
  protected static RATING_BACK_HEIGHT = 21

  protected container: PIXI.Container

  protected back: PIXI.Sprite

  protected navBack: PIXI.Graphics
  protected navMenu: SearchOpponentNavMenu

  protected leagueLabel: PIXI.Text
  protected leagueSprite : PIXI.Sprite
  protected leagueValueLabel: PIXI.Text

  protected ratingBack: PIXI.Graphics
  protected ratingLabelContainer: PIXI.Container
  protected ratingLabel: PIXI.Text
  protected ratingValueLabel: PIXI.Text

  protected timeBack: PIXI.Graphics
  protected timeLabelContainer: PIXI.Container
  protected timeLabel: PIXI.Text
  protected timeValueLabel: PIXI.Text

  protected startButton: BlueButton

  constructor({
                league = 1,
                rating = 1400,
                time = 1000,
              }) {
    super()

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('pvp_f1.jpg'))
    this.back.anchor.set(0.5, 0)
    this.back.position.set(0, 40)

    this.bottomLayer.addChild(this.back)

    this.navBack = new PIXI.Graphics()
    this.topLayer.addChild(this.navBack)

    this.navMenu = new SearchOpponentNavMenu()
    this.navMenu.scale.set(1.35)
    this.topLayer.addChild(this.navMenu)

    this.leagueLabel = new PIXI.Text('Лига новичков ' + league.toString(), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 18,
      fill: 0xffffff,
      fontVariant: 'bold',
    })
    this.leagueLabel.anchor.set(0.5)
    this.midLayer.addChild(this.leagueLabel)

    this.leagueSprite=  new PIXI.Sprite(ResourceManager.instance.getTexture('pvp_league_' + league + '.png'))
    this.leagueSprite.anchor.set(0.5)
    this.midLayer.addChild(this.leagueSprite)

    this.leagueValueLabel = new PIXI.Text( league.toString(), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 40,
      fill: 0xffffff,
      fontVariant: 'bold',
    })
    this.leagueValueLabel.anchor.set(0.5)
    this.midLayer.addChild(this.leagueValueLabel)

    // Rating
    this.ratingBack = new PIXI.Graphics()
    this.midLayer.addChild(this.ratingBack)

    this.ratingLabelContainer = new PIXI.Container()
    this.midLayer.addChild(this.ratingLabelContainer)

    this.ratingLabel = new PIXI.Text('Ваш рейтинг Арены:', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 18,
      fill: 0x8f9b9d,
      fontVariant: 'bold',
    })
    this.ratingLabel.anchor.set(0, 0.5)
    this.ratingLabelContainer.addChild(this.ratingLabel)

    this.ratingValueLabel = new PIXI.Text(rating.toString(), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 18,
      fill: 0xffffff,
      fontVariant: 'bold',
    })
    this.ratingValueLabel.anchor.set(0, 0.5)
    this.ratingValueLabel.position.set(this.ratingLabel.width - 10, 0)
    this.ratingLabelContainer.addChild(this.ratingValueLabel)

    // Time
    this.timeBack = new PIXI.Graphics()
    this.midLayer.addChild(this.timeBack)

    this.timeLabelContainer = new PIXI.Container()
    this.midLayer.addChild(this.timeLabelContainer)

    this.timeLabel = new PIXI.Text('До конца сезона:', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 14,
      fill: 0x8f9b9d,
      fontVariant: 'bold',
    })
    this.timeLabel.anchor.set(0, 0.5)
    this.timeLabelContainer.addChild(this.timeLabel)

    this.timeValueLabel = new PIXI.Text('4д 10ч', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 14,
      fill: 0xffffff,
      fontVariant: 'bold',
    })
    this.timeValueLabel.anchor.set(0, 0.5)
    this.timeValueLabel.position.set(this.timeLabel.width + 5, 0)
    this.timeLabelContainer.addChild(this.timeValueLabel)

    // Start
    this.startButton = new BlueButton('СРАЖАТЬСЯ')
    this.startButton.playAnimation()
    this.midLayer.addChild(this.startButton)
  }

  public resize(width: number, height: number, resolution: number): void {
    super.resize(width, height, resolution)

    width = Math.min(this.back.width, width)
    height = this.mainBack.height

    this.navBack.position.set(-width / 2, this.back.y + this.back.height)
    this.navBack.clear()
    this.navBack.beginFill(0x000000)
    this.navBack.drawRect(0, 0, width, height - (this.back.y + this.back.height))
    this.navBack.endFill()

    this.leagueLabel.position.set(0, height * 0.235)
    this.leagueSprite.position.set(0, height * 0.335)
    this.leagueValueLabel.position.set(this.leagueSprite.x, this.leagueSprite.y - 12)

    this.ratingBack.position.set(-ArenaScreen.RATING_BACK_WIDTH / 2, height * 0.42)
    this.ratingBack.clear()
    this.ratingBack.beginFill(0x000000, 0.33)
    this.ratingBack.drawRect(0, 0, ArenaScreen.RATING_BACK_WIDTH, ArenaScreen.RATING_BACK_HEIGHT)
    this.ratingBack.endFill()

    this.ratingLabelContainer.position.set(-this.ratingLabelContainer.width / 2, this.ratingBack.y + this.ratingBack.height / 2)

    this.timeBack.position.set(-ArenaScreen.RATING_BACK_WIDTH / 2, height * 0.55)
    this.timeBack.clear()
    this.timeBack.beginFill(0x000000, 0.33)
    this.timeBack.drawRect(0, 0, ArenaScreen.RATING_BACK_WIDTH, ArenaScreen.RATING_BACK_HEIGHT)
    this.timeBack.endFill()

    this.timeLabelContainer.position.set(-this.timeLabelContainer.width / 2, this.timeBack.y + this.timeBack.height / 2)

    this.startButton.position.set(0, height * 0.525)
  }

  public update(dt: number): void {
    super.update(dt)

    this.navMenu.position.set(-this.navMenu.width / 2, this.navBack.y + 50)
  }
}