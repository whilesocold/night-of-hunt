import * as PIXI from 'pixi.js'

import { ResourceManager } from '../../utils/resources/ResourceManager'
import { SearchOpponentNavMenu } from '../searchOpponent/SearchOpponentNavMenu'
import { BaseScreen } from './BaseScreen'
import { BlueButton } from '../common/BlueButton'
import { UserPhoto } from '../common/UserPhoto'

export class ArenaCompleteScreenItem extends PIXI.Container {
  protected static BACK_WIDTH = 320
  protected static BACK_HEIGHT = 40

  protected back: PIXI.Graphics
  protected placeBack: PIXI.Sprite
  protected placeLabel: PIXI.Text

  protected nameLabel: PIXI.Text
  protected ratingLabel: PIXI.Text
  protected addRatingLabel: PIXI.Text

  protected userPhoto: UserPhoto

  constructor(place: number, name: string, rating: number, addRating: number) {
    super()

    this.back = new PIXI.Graphics()
    this.back.clear()
    this.back.beginFill(0x4b4b4b, 0.33)
    this.back.drawRect(0, 0, ArenaCompleteScreenItem.BACK_WIDTH, ArenaCompleteScreenItem.BACK_HEIGHT)
    this.back.endFill()
    this.addChild(this.back)

    this.userPhoto = new UserPhoto('maneken.png')
    this.addChild(this.userPhoto)

    this.placeBack = new PIXI.Sprite(ResourceManager.instance.getTexture('rating_place_' + place + '.png'))
    this.placeBack.anchor.set(0.5)
    this.placeBack.position.set(this.placeBack.width / 2 + 15, this.userPhoto.height / 2)
    this.addChild(this.placeBack)

    this.placeLabel = new PIXI.Text(place.toString(), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 15,
      fill: 0x818181,
      fontVariant: 'bold',
    })
    this.placeLabel.anchor.set(0.5)
    this.placeLabel.position.set(this.placeBack.x, this.userPhoto.height / 2)
    this.addChild(this.placeLabel)

    this.userPhoto.position.set(this.placeBack.x + this.placeBack.width / 2 + 5, 0)

    this.nameLabel = new PIXI.Text(name, {
      fontFamily: 'Munchkin-fnt',
      fontSize: 16,
      fill: 0x818181,
      fontVariant: 'bold',
    })
    this.nameLabel.anchor.set(0, 0.5)
    this.nameLabel.position.set(this.userPhoto.x + this.userPhoto.width + 10, this.userPhoto.height / 2)
    this.addChild(this.nameLabel)

    this.ratingLabel = new PIXI.Text(' (' + rating.toString() + ') ', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 16,
      fill: 0xffffff,
      fontVariant: 'bold',
    })
    this.ratingLabel.anchor.set(1, 0.5)
    this.ratingLabel.position.set(ArenaCompleteScreenItem.BACK_WIDTH - 15, this.nameLabel.y)
    this.addChild(this.ratingLabel)

    this.addRatingLabel = new PIXI.Text(addRating.toString(), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 16,
      fill: addRating > 0 ? 0xff0000 : 0x00ff00,
      fontVariant: 'bold',
    })
    this.addRatingLabel.anchor.set(1, 0.5)
    this.addRatingLabel.position.set(this.ratingLabel.x - this.ratingLabel.width, this.nameLabel.y)
    this.addChild(this.addRatingLabel)
  }
}

export class ArenaCompleteScreen extends BaseScreen {
  protected static ITEM_MARGIN = 5

  protected container: PIXI.Container

  protected back: PIXI.Sprite

  protected navBack: PIXI.Graphics
  protected navMenu: SearchOpponentNavMenu

  protected completeLabel: PIXI.Text

  protected winnerContainer: PIXI.Container
  protected winnerIcon: PIXI.Sprite
  protected winnerLabel: PIXI.Text
  protected winnerNameLabel: PIXI.Text

  protected restartButton: BlueButton

  protected players: any[]
  protected items: any[]

  protected itemsContainer: PIXI.Container

  public async init(options: any): Promise<void> {
    await super.init(options)

    this.players = options
    this.items = []

    this.itemsContainer = new PIXI.Container()
    this.addChild(this.itemsContainer)

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('pvp_f2.jpg'))
    this.back.anchor.set(0.5, 0)
    this.back.position.set(0, 40)
    this.bottomLayer.addChild(this.back)

    this.navBack = new PIXI.Graphics()
    this.topLayer.addChild(this.navBack)

    this.navMenu = new SearchOpponentNavMenu()
    this.navMenu.scale.set(1.35)
    this.topLayer.addChild(this.navMenu)

    this.completeLabel = new PIXI.Text('Бой завершен', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 32,
      fill: 0xffffff,
      fontVariant: 'bold',
    })
    this.completeLabel.anchor.set(0.5)
    this.midLayer.addChild(this.completeLabel)

    this.winnerContainer = new PIXI.Container()
    this.midLayer.addChild(this.winnerContainer)

    this.winnerLabel = new PIXI.Text('Победитель: ', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 13,
      fill: 0xffffff,
      fontVariant: 'bold',
    })
    this.winnerLabel.anchor.set(0, 0.5)
    this.winnerContainer.addChild(this.winnerLabel)

    this.winnerIcon = new PIXI.Sprite(ResourceManager.instance.getTexture('pvp_winner.png'))
    this.winnerIcon.anchor.set(0, 0.5)
    this.winnerIcon.position.set(this.winnerLabel.x + this.winnerLabel.width, 0)
    this.winnerContainer.addChild(this.winnerIcon)

    this.winnerNameLabel = new PIXI.Text(this.players[0].name, {
      fontFamily: 'Munchkin-fnt',
      fontSize: 13,
      fill: 0x00ff00,
      fontVariant: 'bold',
    })
    this.winnerNameLabel.anchor.set(0, 0.5)
    this.winnerNameLabel.position.set(this.winnerIcon.x + this.winnerIcon.width + 5, 0)
    this.winnerContainer.addChild(this.winnerNameLabel)

    // Buttons
    this.restartButton = new BlueButton('Сразиться еще раз')
    this.midLayer.addChild(this.restartButton)

    // Fill
    this.players.forEach(data => this.addItem(data.name, data.rating, data.addRating))
  }

  protected addItem(name: string, rating: number, addRating: number): void {
    const item = new ArenaCompleteScreenItem(this.items.length + 1, name, rating, addRating)

    item.position.set(0, (item.height + ArenaCompleteScreen.ITEM_MARGIN) * this.items.length)

    this.items.push(item)
    this.itemsContainer.addChild(item)
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

    this.completeLabel.position.set(0, height * 0.1075)
    this.winnerContainer.position.set(-this.winnerContainer.width / 2, this.completeLabel.y + this.completeLabel.height / 2 + this.winnerLabel.height / 2 + 5)
    this.restartButton.position.set(0, height * 0.485)
    this.itemsContainer.position.set((width - this.itemsContainer.width) / 2, height * 0.205)
  }

  public update(dt: number): void {
    super.update(dt)

    if (this.navMenu) {
      this.navMenu.position.set(-this.navMenu.width / 2, this.navBack.y + 50)
    }
  }
}