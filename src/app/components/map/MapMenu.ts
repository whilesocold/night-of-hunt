import * as PIXI from 'pixi.js'

import { isMobile } from 'mobile-device-detect'
import { gsap, TweenMax } from 'gsap'

import { ResourceManager } from '../../utils/resources/ResourceManager'

export class MapMenuItem extends PIXI.Container {
  protected sprite: PIXI.Sprite
  protected label: PIXI.Text

  constructor(texture: string, title: string) {
    super()

    this.sprite = new PIXI.Sprite(ResourceManager.instance.getTexture(texture))
    this.sprite.anchor.set(0.5)

    this.label = new PIXI.Text(title, {
      fontFamily: 'Munchkin-fnt',
      fontSize: 12,
      fill: 0xffffff,
      fontVariant: 'bold',
    })
    this.label.position.set(0, this.sprite.height / 2)
    this.label.anchor.set(0.5, 0)

    this.addChild(this.sprite)
    this.addChild(this.label)
  }

  getRealSize(): PIXI.ISize {
    return {
      width: this.sprite.texture.baseTexture.width,
      height: this.sprite.texture.baseTexture.height,
    }
  }
}

export class MapMenu extends PIXI.Container {
  protected items: MapMenuItem[]
  protected item: MapMenuItem

  protected itemMargin: number
  protected itemScale: number

  protected container: PIXI.Container

  constructor() {
    super()

    this.items = []
    this.item = null

    this.itemMargin = 4
    this.itemScale = 1.3

    this.container = new PIXI.Container()
    this.addChild(this.container)

    this.addItem('map_b_2.png', 'Главная')
    this.addItem('map_b_3.png', 'Профиль')
    this.addItem('map_b_4.png', 'Клан')
    this.addItem('map_b_5.png', 'Задания')
    this.addItem('map_b_6.png', 'Магазин')
  }

  protected addItem(texture: string, title: string): MapMenuItem {
    const previousItem = this.items.length > 0 ? this.items[this.items.length - 1] : null

    const item = new MapMenuItem(texture, title)

    item.interactive = true
    item.buttonMode = true
    item.x = previousItem ? previousItem.x + previousItem.width / 2 + item.width / 2 + this.itemMargin : item.width / 2

    this.items.push(item)
    this.container.addChild(item)

    const handleAnimationOn = () => {
      gsap.killTweensOf(item.scale)
      TweenMax.to(item.scale, 0.25, { x: this.itemScale, y: this.itemScale })

      this.item = item
      this.reposition()
    }

    const handleAnimationOff = () => {
      gsap.killTweensOf(item.scale)
      TweenMax.to(item.scale, 0.25, { x: 1, y: 1 })

      this.item = null
      this.reposition()
    }

    if (isMobile) {
      item.on('pointerdown', () => {
        if (this.item !== item) {
          if (this.item) {
            gsap.killTweensOf(this.item.scale)
            TweenMax.to(this.item.scale, 0.25, { x: 1, y: 1 })
          }

          this.item = item

          gsap.killTweensOf(item.scale)
          TweenMax.to(item.scale, 0.25, { x: this.itemScale, y: this.itemScale })

          this.reposition()
        }
      })

    } else {
      item.on('pointerover', () => handleAnimationOn())
      item.on('pointerout', () => handleAnimationOff())
    }


    this.reposition(true)

    return item
  }

  protected reposition(now: boolean = false): void {
    const positions = []

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      const scale = item === this.item ? this.itemScale : 1

      const previousItem = i > 0 ? this.items[i - 1] : null
      const previousPosition = i > 0 ? positions[i - 1] : null
      const previousScale = previousItem === this.item ? this.itemScale : 1

      const x = previousItem ? previousPosition.x + (previousItem.getRealSize().width / 2 * previousScale) + (item.getRealSize().width / 2 * scale) + this.itemMargin : (item.getRealSize().width / 2 * scale)

      positions[i] = new PIXI.Point(x, 0)

      if (now) {
        gsap.killTweensOf(item)
        item.x = x

      } else {
        gsap.killTweensOf(item)
        TweenMax.to(item, 0.25, { x: x })
      }
    }
  }
}