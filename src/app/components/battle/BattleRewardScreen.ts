import * as PIXI from 'pixi.js'
import { ResourceManager } from '../../utils/resources/ResourceManager'
import { BattleRewardState } from '../../data/BattleRewardState'
import { BattleRewardUserCardState } from '../../data/BattleRewardUserCardState'
import { BattleSkillColor } from './BattleSkill'

class BattleRewardItem extends PIXI.Container {
  protected back: PIXI.Sprite
  protected front: PIXI.Sprite
  protected label: PIXI.Text

  constructor(image: string, value: number, valueColor: number) {
    super()

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('item_back.png'))
    this.back.anchor.set(0.5)

    this.front = new PIXI.Sprite(ResourceManager.instance.getTexture(image))
    this.front.anchor.set(0.5)

    this.label = new PIXI.Text(value.toString(), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 18,
      fill: valueColor,
      fontVariant: 'bold',
    })
    this.label.anchor.set(0.5, 0)
    this.label.position.set(0, this.front.height / 2 + 5)

    this.addChild(this.back)
    this.addChild(this.front)
    this.addChild(this.label)
  }
}

class BattleRewardCard extends PIXI.Container {
  protected back: PIXI.Sprite
  protected school: PIXI.Sprite
  protected label: PIXI.Text

  constructor(data: BattleRewardUserCardState) {
    super()

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('card_' + data.image))
    this.back.anchor.set(0.5)

    this.school = new PIXI.Sprite(ResourceManager.instance.getTexture('school_' + data.school + '.png'))
    this.school.anchor.set(0.5)

    this.label = new PIXI.Text(data.damage.toString(), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 14,
      fill: BattleSkillColor[data.info.school - 1],
      fontVariant: 'bold',
    })
    this.label.anchor.set(0, 0.5)
    this.label.position.set(-10, -36)

    this.addChild(this.back)
    this.addChild(this.school)
    this.addChild(this.label)
  }
}

class BattleRewardButton extends PIXI.Container {
  protected label: PIXI.Text

  protected left: PIXI.Sprite
  protected mid: PIXI.Sprite
  protected right: PIXI.Sprite

  constructor() {
    super()

    this.label = new PIXI.Text('Забрать награду', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 16,
      fill: 0x68fffe,
      fontVariant: 'bold',
    })
    this.label.anchor.set(0.5)

    this.mid = new PIXI.Sprite(ResourceManager.instance.getTexture('winning_button_mid.png'))
    this.mid.width = this.label.width + 20
    this.mid.anchor.set(0.5)

    this.left = new PIXI.Sprite(ResourceManager.instance.getTexture('winning_button_left.png'))
    this.left.anchor.set(1, 0.5)
    this.left.x = -this.mid.width / 2

    this.right = new PIXI.Sprite(ResourceManager.instance.getTexture('winning_button_right.png'))
    this.right.anchor.set(0, 0.5)
    this.right.x = this.mid.width / 2

    this.addChild(this.left)
    this.addChild(this.mid)
    this.addChild(this.right)
    this.addChild(this.label)
  }
}

export class BattleRewardScreen extends PIXI.Container {
  protected container: PIXI.Container

  protected back: PIXI.Sprite
  protected backSolid: PIXI.Graphics
  protected winBack: PIXI.Sprite
  protected winHead: PIXI.Sprite
  protected winHeadLabel: PIXI.Text

  protected itemContainer: PIXI.Container
  protected cardContainer: PIXI.Container

  protected claimButton: BattleRewardButton

  constructor(reward: BattleRewardState) {
    super()

    this.container = new PIXI.Container()

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('main_back.jpg'))
    this.back.anchor.set(0.5, 0)

    this.backSolid = new PIXI.Graphics()

    this.winHead = new PIXI.Sprite(ResourceManager.instance.getTexture('winning_head_1.png'))
    this.winHead.anchor.set(0.5, 0)
    this.winHead.position.set(0, 50)

    this.winHeadLabel = new PIXI.Text('Победа', {
      fontFamily: 'Munchkin-fnt',
      fontSize: 20,
      fill: '0xffffff',
      fontVariant: 'bold',
    })
    this.winHeadLabel.anchor.set(0.5)
    this.winHeadLabel.position.set(0, 105)

    this.winBack = new PIXI.Sprite(ResourceManager.instance.getTexture('winning_back.png'))
    this.winBack.anchor.set(0.5, 0)
    this.winBack.position.set(0, this.winHead.y + this.winHead.height / 2)

    this.itemContainer = new PIXI.Container()
    this.itemContainer.position.set(this.winBack.x, this.winBack.y + 120)

    this.cardContainer = new PIXI.Container()
    this.cardContainer.position.set(this.itemContainer.x, this.itemContainer.y + 120)

    this.claimButton = new BattleRewardButton()
    this.claimButton.position.set(this.cardContainer.x, this.cardContainer.y + 120)

    this.claimButton.interactive = true
    this.claimButton.buttonMode = true
    this.claimButton.once('pointerdown', () => {
      window.location.href = window.location.href
    })

    this.addChild(this.back)
    this.addChild(this.backSolid)
    this.addChild(this.winBack)
    this.addChild(this.itemContainer)
    this.addChild(this.cardContainer)
    this.addChild(this.winHead)
    this.addChild(this.claimButton)

    this.winHead.addChild(this.winHeadLabel)


    const goldValue = reward.gold
    const silverValue = reward.silver
    const expValue = reward.exp

    if (goldValue > 0) {
      this.addItem('item_gold.png', goldValue, 0xeedd68)
    }

    if (silverValue > 0) {
      this.addItem('item_silver.png', silverValue, 0x8b8b8b)
    }
    if (expValue > 0) {
      this.addItem('item_exp.png', expValue, 0xeedd68)
    }

    reward.userCards.forEach(data => this.addCard(data))
  }

  resize(width: number, height: number, resolution: number): void {
    this.back.x = width / 2
    this.winHead.x = width / 2
    this.winBack.x = width / 2

    this.itemContainer.x = (width - this.itemContainer.width) / 2
    this.cardContainer.x = (width - this.cardContainer.width) / 2
    this.claimButton.x = width / 2

    this.backSolid.clear()
    this.backSolid.beginFill(0x000000)
    this.backSolid.drawRect((width - 460) / 2, 0, 460, height)
    this.backSolid.endFill()
  }

  update(dt: number): void {
  }

  async addItem(image: string, value: number, valueColor: number): Promise<BattleRewardItem> {
    const item = new BattleRewardItem(image, value, valueColor)

    item.x = item.width * this.itemContainer.children.length + item.width / 2

    this.itemContainer.addChild(item)

    return item
  }

  async addCard(data: BattleRewardUserCardState): Promise<BattleRewardCard> {
    const card = new BattleRewardCard(data)

    card.x = card.width * this.cardContainer.children.length + card.width / 2

    this.cardContainer.addChild(card)

    return card
  }
}