import * as PIXI from 'pixi.js'
import { ResourceManager } from '../../utils/resources/ResourceManager'
import { MapMenu } from '../map/MapMenu'
import { Button } from '../common/Button'

export enum MapScreenItemState {
  Opened = 0,
  Locked = 1
}

export class MapScreenItem extends PIXI.Container {
  protected backSprite: PIXI.Sprite
  protected activeSprite: PIXI.Sprite
  protected label: PIXI.Text

  constructor(title: string, state: MapScreenItemState = MapScreenItemState.Locked) {
    super()

    this.backSprite = new PIXI.Sprite(ResourceManager.instance.getTexture('map_map_cont.png'))
    this.backSprite.anchor.set(0.5)

    this.activeSprite = new PIXI.Sprite(ResourceManager.instance.getTexture(
      state === MapScreenItemState.Opened ?
        'map_plus.png' : null))
    this.activeSprite.anchor.set(0.5)
    this.activeSprite.position.set(-this.backSprite.width / 2 + 18.5, 0)

    this.label = new PIXI.Text(title, {
      fontFamily: 'Munchkin-fnt',
      fontSize: 12,
      fill: 0xffffff,
      fontVariant: 'bold',
    })
    this.label.position.set(-this.backSprite.width / 2 + 40, 0)
    this.label.anchor.set(0, 0.5)

    this.addChild(this.backSprite)
    this.addChild(this.activeSprite)
    this.addChild(this.label)
  }
}

export class MapScreen extends PIXI.Container {
  protected container: PIXI.Container

  protected content: PIXI.Container
  protected contentMask: PIXI.Graphics

  protected back: PIXI.Sprite
  protected footerBack: PIXI.Graphics

  protected photoBack: PIXI.Sprite

  protected bankButton: Button
  protected vipButton: Button
  protected mailButton: Button
  protected taskButton: Button
  protected scoreButton: Button
  protected rewardButton: Button

  protected chatBack: PIXI.Graphics
  protected chatIcon: PIXI.Sprite
  protected chatSendButton: Button

  protected mapMenu: MapMenu

  private dragging: boolean
  private draggingGlobal: PIXI.Point

  private maxSpeed: number
  private target: PIXI.Point

  private contentSize: any

  constructor() {
    super()

    this.dragging = false
    this.draggingGlobal = new PIXI.Point(0, 0)

    this.maxSpeed = 4
    this.target = new PIXI.Point(0, 0)
    this.contentSize = { width: 0, height: 0 }

    this.container = new PIXI.Container()

    this.content = new PIXI.Container()
    this.content.interactive = true
    this.contentMask = new PIXI.Graphics()

    this.content.mask = this.contentMask

    this.back = new PIXI.Sprite(ResourceManager.instance.getTexture('map_back.jpg'))
    this.back.anchor.set(0.5, 0)
    this.back.position.set(0, 50)

    this.footerBack = new PIXI.Graphics()

    this.photoBack = new PIXI.Sprite(ResourceManager.instance.getTexture('map_corner.png'))
    this.photoBack.anchor.set(0, 0)

    this.bankButton = new Button('map_b_1.png')

    /*
    this.goldIcon = new PIXI.Sprite(ResourceManager.instance.getTexture('map_b_1.png'))
    this.goldIcon.anchor.set(0.5)
    this.goldIcon.position.set(190, 25)
    */

    this.vipButton = new Button('map_vip.png')
    this.mailButton = new Button('map_a_1.png')
    this.taskButton = new Button('map_a_2.png')
    this.scoreButton = new Button('map_a_3.png')
    this.rewardButton = new Button('map_a_4.png')

    this.chatBack = new PIXI.Graphics()

    this.chatIcon = new PIXI.Sprite(ResourceManager.instance.getTexture('map_chat.png'))
    this.chatIcon.anchor.set(0.5)

    this.chatSendButton = new Button('map_chat_b.png')

    this.mapMenu = new MapMenu()

    this.addChild(this.content)
    this.addChild(this.contentMask)

    this.addChild(this.container)

    this.content.addChild(this.back)

    this.container.addChild(this.bankButton)
    this.container.addChild(this.photoBack)
    this.container.addChild(this.vipButton)
    this.container.addChild(this.mailButton)
    this.container.addChild(this.taskButton)
    this.container.addChild(this.scoreButton)
    this.container.addChild(this.rewardButton)
    this.container.addChild(this.footerBack)
    this.container.addChild(this.chatBack)
    this.container.addChild(this.chatIcon)
    this.container.addChild(this.chatSendButton)

    this.container.addChild(this.mapMenu)

    this.initItems()


    const onWheel = (e) => {
      e = e || window.event

      const delta = e.deltaY || e.detail || e.wheelDelta

      const direction = new PIXI.Point(delta, delta)
      const axis = 'y'
      const offset = -direction['y']
      const pos = this.target[axis] + offset

      const min = 0
      const max = pos + this.content.height

      if (this.content.height > this.contentSize.height) {
        if (offset > 0) {
          if (pos < 0) {
            this.target[axis] = pos

          } else {
            this.target[axis] = min
          }

        } else if (offset < 0) {
          if (max > this.contentSize.height) {
            this.target[axis] = pos

          } else {
            this.target[axis] = -(this.content.height - this.contentSize.height)
          }
        }
      }
    }

    if (window.addEventListener) {
      if ('onwheel' in document) {
        // IE9+, FF17+, Ch31+
        window.addEventListener('wheel', onWheel)
      } else if ('onmousewheel' in document) {
        // устаревший вариант события
        window.addEventListener('mousewheel', onWheel)
      } else {
        // Firefox < 17
        window.addEventListener('MozMousePixelScroll', onWheel)
      }
    }

    this.content.on('pointerdown', (e) => {
      this.draggingGlobal = new PIXI.Point(e.data.global.x, e.data.global.y)
      this.dragging = true
    })

    this.content.on('pointermove', (e) => {
      if (this.dragging) {
        const direction = new PIXI.Point(e.data.global.x - this.draggingGlobal.x, e.data.global.y - this.draggingGlobal.y)
        const axis = 'y'
        const offset = direction[axis]
        const pos = this.target[axis] + offset

        const min = 0
        const max = pos + this.content.height

        if (this.content.height > this.contentSize.height) {
          if (offset > 0) {
            if (pos < 0) {
              this.target[axis] = pos

            } else {
              this.target[axis] = min
            }

          } else if (offset < 0) {
            if (max > this.contentSize.height) {
              this.target[axis] = pos

            } else {
              this.target[axis] = -(this.content.height - this.contentSize.height)
            }
          }
        }
      }

      this.draggingGlobal = new PIXI.Point(e.data.global.x, e.data.global.y)
    })

    this.content.on('pointerup', () => {
      this.draggingGlobal = null
      this.dragging = false
    })

    this.content.on('pointerupoutside', () => {
      this.draggingGlobal = null
      this.dragging = false
    })
  }

  protected initItems(): void {
    const itemDataList = [
      { title: 'Кампания', x: 130, y: 210, opened: true },
      { title: 'Особняк', x: -25, y: 240 },
      { title: 'Закоулки', x: 130, y: 330 },
      { title: 'Арена', x: -100, y: 425 },
      { title: 'Битва кланов', x: 90, y: 490 },
      { title: 'Ивент', x: 20, y: 560 },
      { title: 'Охота', x: -110, y: 645 },
      { title: 'Башня', x: 115, y: 690 },
    ]

    for (let i = 0; i < itemDataList.length; i++) {
      const itemData = itemDataList[i]
      const item = new MapScreenItem(itemData.title, itemData.opened ? MapScreenItemState.Opened : MapScreenItemState.Locked)

      item.x = itemData.x
      item.y = itemData.y

      this.back.addChild(item)
    }
  }

  resize(width: number, height: number, resolution: number): void {
    this.back.x = width / 2
    this.container.x = width / 2

    const chatOffset = 200

    this.bankButton.position.set(Math.min(this.back.width / 2, width / 2) - this.bankButton.width / 2 - 5, 28)
    this.photoBack.position.set(-Math.min(this.back.width / 2, width / 2), 0)
    this.vipButton.position.set(-Math.min(this.back.width / 2, width / 2) + 76, 30)
    this.mailButton.position.set(-Math.min(this.back.width / 2, width / 2) + this.mailButton.width / 2, 110)
    this.taskButton.position.set(-Math.min(this.back.width / 2, width / 2) + this.taskButton.width / 2, 180)
    this.scoreButton.position.set(-Math.min(this.back.width / 2, width / 2) + this.scoreButton.width / 2, 250)
    this.rewardButton.position.set(Math.min(this.back.width / 2, width / 2) - this.rewardButton.width / 2 - 10, 90)
    this.chatIcon.position.set(-Math.min(this.back.width / 2, width / 2) + this.chatIcon.width / 2, this.back.y + height - chatOffset + this.chatIcon.height / 2)
    this.chatSendButton.position.set(Math.min(this.back.width / 2, width / 2) - this.chatSendButton.width / 2, this.back.y + height - chatOffset + this.chatSendButton.height / 2)

    this.chatBack.clear()
    this.chatBack.lineStyle(1, 0x3d3d3d)
    this.chatBack.beginFill(0x000000)
    this.chatBack.drawRect(
      this.chatIcon.x + this.chatIcon.width / 2,
      this.back.y + height - chatOffset,
      Math.min(this.back.width, width) - this.chatIcon.width - this.chatSendButton.width,
      this.chatSendButton.height)
    this.chatBack.endFill()

    this.footerBack.clear()
    this.footerBack.beginFill(0x000000)
    this.footerBack.drawRect(
      -Math.min(this.back.width, width) / 2,
      height + this.back.y - chatOffset,
      Math.min(this.back.width, width),
      chatOffset)
    this.footerBack.endFill()

    this.contentMask.clear()
    this.contentMask.beginFill(0x000000)
    this.contentMask.drawRect(
      this.back.x - this.back.width / 2,
      this.back.y,
      this.back.width,
      height - chatOffset)
    this.contentMask.endFill()

    this.contentSize = { width: Math.min(this.back.width, width), height: height - chatOffset }
  }

  update(dt: number): void {
    this.mapMenu.position.set(-this.mapMenu.width / 2, this.chatSendButton.y + 65)

    if (this.content) {
      this.content.y += (this.target.y - this.content.y) / this.maxSpeed
    }
  }
}