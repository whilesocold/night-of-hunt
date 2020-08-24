import * as PIXI from 'pixi.js'
import { Bounce, Linear, TweenMax } from 'gsap'

import { ResourceManager } from '../../utils/resources/ResourceManager'
import { BattleRewardState } from '../../data/BattleRewardState'
import { BattleRewardUserCardState } from '../../data/BattleRewardUserCardState'
import { BattleSkillColor } from './BattleSkill'

import { App } from '../../App'

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
  protected label: PIXI.Text

  constructor(data: BattleRewardUserCardState) {
    super()

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('card_' + data.image))
    this.back.anchor.set(0.5)

    this.label = new PIXI.Text(data.damage.toString(), {
      fontFamily: 'Munchkin-fnt',
      fontSize: 14,
      fill: BattleSkillColor[data.info.school - 1],
      fontVariant: 'bold',
    })
    this.label.anchor.set(0, 0.5)
    this.label.position.set(-10, -36)

    this.addChild(this.back)
    this.addChild(this.label)
  }
}

class BattleRewardButton extends PIXI.Container {
  protected label: PIXI.Text

  protected left: PIXI.Sprite
  protected mid: PIXI.Sprite
  protected right: PIXI.Sprite
  protected glow: PIXI.Sprite

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

    this.glow = new PIXI.Sprite(ResourceManager.instance.getTexture('school_glow_3.png'))
    this.glow.width = this.mid.width + this.left.width + this.right.width + 100
    this.glow.height = this.mid.height + 40
    this.glow.anchor.set(0.5)
    this.glow.alpha = 0

    this.addChild(this.glow)
    this.addChild(this.left)
    this.addChild(this.mid)
    this.addChild(this.right)
    this.addChild(this.label)
  }

  public startAnimation(): void {
    TweenMax.to(this.glow, 0.5, { yoyo: true, repeat: -1, alpha: 1 })
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
    const energyValue = reward.energy
    const snowFlakesValue = reward.snowflakes
    const toyValue = reward.toys
    const valorValue = reward.valor

    if (goldValue > 0) this.addItem('item_gold.png', goldValue, 0xeedd68)
    if (silverValue > 0) this.addItem('item_silver.png', silverValue, 0x8b8b8b)
    if (expValue > 0) this.addItem('item_exp.png', expValue, 0xeedd68)
    if (energyValue > 0) this.addItem('item_energy.png', energyValue, 0x337ab7)
    if (snowFlakesValue > 0) this.addItem('item_snowflake.png', snowFlakesValue, 0xffffff)
    if (toyValue > 0) this.addItem('item_toy.png', toyValue, 0xffffff)
    if (valorValue > 0) this.addItem('item_valor.png', valorValue, 0xffffff)

    reward.userCards.forEach(data => this.addCard(data))

    this.resize(App.instance.getRenderer().width, App.instance.getRenderer().height, App.instance.getRenderer().resolution)

    // animate
    this.winHead.y = -200

    this.itemContainer.alpha = 0
    this.itemContainer.scale.set(0)

    this.cardContainer.alpha = 0
    this.cardContainer.scale.set(0)

    this.claimButton.alpha = 0
    this.claimButton.scale.set(0)

    setTimeout(() => {
      TweenMax.to(this.winHead, 1, { y: 50, ease: Bounce.easeOut })
      TweenMax.to(this.itemContainer, 0.5, { delay: 0.75, alpha: 1, ease: Linear.easeOut })
      TweenMax.to(this.itemContainer.scale, 0.5, { delay: 0.75, x: 1, y: 1, ease: Linear.easeOut })

      if (this.cardContainer.children.length > 0) {
        TweenMax.to(this.cardContainer, 0.5, { delay: 0.75 * 2, alpha: 1, ease: Linear.easeOut })
        TweenMax.to(this.cardContainer.scale, 0.5, { delay: 0.75 * 2, x: 1, y: 1, ease: Linear.easeOut })

        TweenMax.to(this.claimButton, 0.5, { delay: 0.75 * 3, alpha: 1, ease: Linear.easeOut })
        TweenMax.to(this.claimButton.scale, 0.5, {
          delay: 0.75 * 3, x: 1, y: 1, ease: Linear.easeOut, onComplete: () => {
            this.claimButton.startAnimation()

            TweenMax.to(this.claimButton.scale, 0.5, { x: 1.1, y: 1.1, repeat: -1, yoyo: true })
          },
        })

      } else {
        TweenMax.to(this.claimButton, 0.5, { delay: 0.75 * 2, alpha: 1, ease: Linear.easeOut })
        TweenMax.to(this.claimButton.scale, 0.5, {
          delay: 0.75 * 2, x: 1, y: 1, ease: Linear.easeOut, onComplete: () => {
            this.claimButton.startAnimation()

            TweenMax.to(this.claimButton.scale, 0.5, { x: 1.1, y: 1.1, repeat: -1, yoyo: true })
          },
        })
      }
    }, 2000)
  }

  resize(width: number, height: number, resolution: number): void {
    this.backSolid.clear()
    this.backSolid.beginFill(0x000000)
    this.backSolid.drawRect((width - 460) / 2, 0, 460, height)
    this.backSolid.endFill()
  }

  update(dt: number): void {
    const resolution = App.instance.getRenderer().resolution
    const width = App.instance.getRenderer().width / resolution
    const height = App.instance.getRenderer().height / resolution

    this.back.x = width / 2

    this.winHead.x = width / 2
    this.winBack.x = width / 2

    this.itemContainer.x = (width - this.itemContainer.width) / 2
    this.cardContainer.x = (width - this.cardContainer.width) / 2
    this.claimButton.x = width / 2
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