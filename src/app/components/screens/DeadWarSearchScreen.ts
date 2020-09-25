import * as PIXI from 'pixi.js'

import { ResourceManager } from '../../utils/resources/ResourceManager'
import { SearchOpponentNavMenu } from '../searchOpponent/SearchOpponentNavMenu'
import { BaseScreen } from './BaseScreen'
import { BlueButton } from '../common/BlueButton'

export enum DeadWarArmyType {
  A,
  B
}

export class DeadWarSearchScreen extends BaseScreen {
  protected container: PIXI.Container

  protected back: PIXI.Sprite

  protected navBack: PIXI.Graphics
  protected navMenu: SearchOpponentNavMenu

  protected titleLabel: PIXI.Text
  protected rulesLabel: PIXI.Text

  protected armyCenterLabel: PIXI.Text
  protected armyLeftLabel: PIXI.Text
  protected armyRightLabel: PIXI.Text

  protected armyTitleLabel: PIXI.Text
  protected armyTypeLabel: PIXI.Text

  protected updateButton: BlueButton

  protected time: number
  protected isReady: boolean
  protected armyType: DeadWarArmyType
  protected armyScoreA: number
  protected armyScoreB: number

  public async init(options: any): Promise<void> {
    await super.init(options)

    this.time = 2
    this.isReady = false

    this.armyType = DeadWarArmyType.A
    this.armyScoreA = 12
    this.armyScoreB = 23

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('dw_search_back_1.jpg'))
    this.back.anchor.set(0.5, 0)
    this.back.position.set(0, 40)
    this.bottomLayer.addChild(this.back)

    this.navBack = new PIXI.Graphics()
    this.topLayer.addChild(this.navBack)

    this.navMenu = new SearchOpponentNavMenu()
    this.navMenu.scale.set(1.35)
    this.topLayer.addChild(this.navMenu)

    this.titleLabel = new PIXI.Text('', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 18,
      lineHeight: 24,
      fill: 0xffffff,
      fontVariant: 'bold',
      align: 'center',
    })
    this.titleLabel.anchor.set(0.5)
    this.midLayer.addChild(this.titleLabel)

    this.armyCenterLabel = new PIXI.Text('Армия\nмертвых', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 20,
      fill: 0xffffff,
      fontVariant: 'bold',
      align: 'center',
    })
    this.armyCenterLabel.anchor.set(0.5)
    this.midLayer.addChild(this.armyCenterLabel)

    this.armyLeftLabel = new PIXI.Text(this.getArmyLabel(DeadWarArmyType.A).replace(' ', '\n'), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 18,
      fill: this.getArmyLabelColor(DeadWarArmyType.A),
      fontVariant: 'bold',
      align: 'center',
    })
    this.armyLeftLabel.anchor.set(0.5, 0)
    this.midLayer.addChild(this.armyLeftLabel)

    this.armyRightLabel = new PIXI.Text(this.getArmyLabel(DeadWarArmyType.B).replace(' ', '\n'), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 18,
      fill: this.getArmyLabelColor(DeadWarArmyType.B),
      fontVariant: 'bold',
      align: 'center',
    })
    this.armyRightLabel.anchor.set(0.5, 0)
    this.midLayer.addChild(this.armyRightLabel)

    this.rulesLabel = new PIXI.Text('Начните охоту на мертвых и одержите победу\nнад Владыкой!', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 14,
      lineHeight: 20,
      fill: 0x8f9b9d,
      fontVariant: 'bold',
      align: 'center',
    })
    this.rulesLabel.anchor.set(0.5)
    this.midLayer.addChild(this.rulesLabel)

    this.armyTitleLabel = new PIXI.Text('Вы учавствуете на стороне:', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 18,
      fill: 0xffffff,
      fontVariant: 'bold',
      align: 'center',
    })
    this.armyTitleLabel.anchor.set(0.5)
    this.midLayer.addChild(this.armyTitleLabel)

    this.armyTypeLabel = new PIXI.Text('', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 18,
      fill: 0x8f9b9d,
      fontVariant: 'bold',
      align: 'center',
    })
    this.armyTypeLabel.anchor.set(0.5)
    this.midLayer.addChild(this.armyTypeLabel)

    // Buttons
    this.updateButton = new BlueButton('Обновить')
    this.midLayer.addChild(this.updateButton)

    this.updateLabels()

    // FIXME: for tests
    this.ready(DeadWarArmyType.A)
  }

  protected updateLabels(): void {
    // FIXME: time formatting
    if (this.isReady) {
      this.titleLabel.text = 'До начала битвы:.\n' + this.time.toString() + 'М'
      this.rulesLabel.visible = false
      this.armyTitleLabel.visible = true
      this.armyTypeLabel.visible = true

    } else {
      this.titleLabel.text = 'До начала\nОпределение сторон...\n' + this.time.toString() + 'М'
      this.rulesLabel.visible = true
      this.armyTitleLabel.visible = false
      this.armyTypeLabel.visible = false
    }
  }

  protected getArmyLabel(type: DeadWarArmyType) {
    if (type === DeadWarArmyType.A) {
      return 'Армия Винрама'
    }
    return 'Армия Скверны'
  }

  protected getArmyLabelColor(type: DeadWarArmyType) {
    if (type === DeadWarArmyType.A) {
      return 0xEACE45
    }
    return 0xE0151F
  }

  public ready(armyType: DeadWarArmyType) {
    this.isReady = true
    this.armyType = armyType

    this.armyTypeLabel.text = this.getArmyLabel(armyType)
    this.armyTypeLabel.style.fill = this.getArmyLabelColor(armyType)

    this.armyLeftLabel.text = this.getArmyLabel(DeadWarArmyType.A).replace(' ', '\n') + '\n' + '-' + this.armyScoreA + '-'
    this.armyRightLabel.text = this.getArmyLabel(DeadWarArmyType.B).replace(' ', '\n') + '\n' + '-' + this.armyScoreB + '-'

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

    this.titleLabel.position.set(0, height * 0.11)
    this.rulesLabel.position.set(0, height * 0.6)

    this.armyCenterLabel.position.set(0, height * 0.255)
    this.armyLeftLabel.position.set(-105, height * 0.39)
    this.armyRightLabel.position.set(105, height * 0.39)

    this.armyTitleLabel.position.set(0, height * 0.5075)
    this.armyTypeLabel.position.set(0, height * 0.5325)

    this.updateButton.position.set(0, height * (this.isReady ? 0.6 : 0.525))
  }

  public update(dt: number): void {
    super.update(dt)

    this.navMenu.position.set(-this.navMenu.width / 2, this.navBack.y + 50)
  }
}