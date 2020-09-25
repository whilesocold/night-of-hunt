import * as PIXI from 'pixi.js'

import { ResourceManager } from '../../utils/resources/ResourceManager'
import { SearchOpponentNavMenu } from '../searchOpponent/SearchOpponentNavMenu'
import { BaseScreen } from './BaseScreen'
import { BlueButton } from '../common/BlueButton'
import { UserPhoto } from '../common/UserPhoto'

export class ArenaSearchScreenItem extends PIXI.Container {
  protected nameLabel: PIXI.Text
  protected ratingLabel: PIXI.Text

  protected userPhoto: UserPhoto

  constructor(name: string, rating: number, isPlayer: boolean = false) {
    super()

    this.userPhoto = new UserPhoto('maneken.png')
    this.addChild(this.userPhoto)

    this.nameLabel = new PIXI.Text(name, {
      fontFamily: 'Munchkin-fnt',
      fontSize: 14,
      fill: isPlayer ? 0xff0000 : 0x00ff00,
      fontVariant: 'bold',
    })
    this.nameLabel.anchor.set(0.5)
    this.nameLabel.position.set(this.userPhoto.width / 2, this.userPhoto.height + this.nameLabel.height / 2)
    this.addChild(this.nameLabel)

    this.ratingLabel = new PIXI.Text(rating.toString(), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 14,
      fill: 0xffffff,
      fontVariant: 'bold',
    })
    this.ratingLabel.anchor.set(0.5)
    this.ratingLabel.position.set(this.nameLabel.x, this.nameLabel.y + this.nameLabel.height / 2 + this.ratingLabel.height / 2)
    this.addChild(this.ratingLabel)
  }
}

export class ArenaSearchScreen extends BaseScreen {
  protected static ITEM_POSITIONS = [
    { x: 190, y: 148 },
    { x: 303, y: 225 },
    { x: 270, y: 360 },
    { x: 109, y: 360 },
    { x: 76, y: 225 },
  ]

  protected container: PIXI.Container

  protected back: PIXI.Sprite

  protected navBack: PIXI.Graphics
  protected navMenu: SearchOpponentNavMenu

  protected searchLabel: PIXI.Text
  protected findLabel: PIXI.Text
  protected rulesLabel: PIXI.Text

  protected cancelButton: BlueButton
  protected updateButton: BlueButton

  protected items: any[]
  protected itemsMax: number

  public async init(options: any): Promise<void> {
    await super.init(options)

    this.items = []
    this.itemsMax = 5

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('pvp_f3.jpg'))
    this.back.anchor.set(0.5, 0)
    this.back.position.set(0, 40)
    this.bottomLayer.addChild(this.back)

    this.navBack = new PIXI.Graphics()
    this.topLayer.addChild(this.navBack)

    this.navMenu = new SearchOpponentNavMenu()
    this.navMenu.scale.set(1.35)
    this.topLayer.addChild(this.navMenu)

    this.searchLabel = new PIXI.Text('Поиск противников...', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 18,
      fill: 0xffffff,
      fontVariant: 'bold',
    })
    this.searchLabel.anchor.set(0.5)
    this.midLayer.addChild(this.searchLabel)

    this.findLabel = new PIXI.Text('', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 18,
      fill: 0xffffff,
      fontVariant: 'bold',
    })
    this.findLabel.anchor.set(0.5)
    this.midLayer.addChild(this.findLabel)

    this.rulesLabel = new PIXI.Text('На арене нет правил, кроме одного - остаться\nв живых!', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 14,
      lineHeight: 20,
      fill: 0x8f9b9d,
      fontVariant: 'bold',
      align: 'center',
    })
    this.rulesLabel.anchor.set(0.5)
    this.midLayer.addChild(this.rulesLabel)

    // Buttons
    this.cancelButton = new BlueButton('Отменить')
    this.midLayer.addChild(this.cancelButton)

    this.updateButton = new BlueButton('Обновить')
    this.midLayer.addChild(this.updateButton)

    this.updateLabels()

    // Fill
    this.addItem('Вы', 1400, true)
    this.addItem('Batman', 1400)
    this.addItem('Robin', 1400)
    this.addItem('Joker', 1400)
    this.addItem('Superman', 1400)
  }

  protected updateLabels(): void {
    this.findLabel.text = 'Найдено ' + this.items.length + ' из ' + this.itemsMax.toString()
  }

  protected addItem(name: string, rating: number, isPlayer: boolean = false): void {
    const item = new ArenaSearchScreenItem(name, rating, isPlayer)
    const position = ArenaSearchScreen.ITEM_POSITIONS[this.items.length]

    item.position.set(position.x, position.y)

    this.items.push(item)
    this.addChild(item)

    this.updateLabels()
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

    this.searchLabel.position.set(0, height * 0.085)
    this.findLabel.position.set(0, this.searchLabel.y + this.searchLabel.height / 2 + this.findLabel.height / 2)
    this.rulesLabel.position.set(0, height * 0.6)

    this.cancelButton.position.set(-70, height * 0.525)
    this.updateButton.position.set(70, height * 0.525)
  }

  public update(dt: number): void {
    super.update(dt)

    this.navMenu.position.set(-this.navMenu.width / 2, this.navBack.y + 50)
  }
}