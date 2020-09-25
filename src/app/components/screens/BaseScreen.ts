import * as PIXI from 'pixi.js'

import { ResourceManager } from '../../utils/resources/ResourceManager'
import { ScreenManager } from '../../utils/ScreenManager'

export class BaseScreen extends PIXI.Container {
  public inited: boolean
  public options: any

  protected bottomLayer: PIXI.Container
  protected midLayer: PIXI.Container
  protected topLayer: PIXI.Container

  protected mainBack: PIXI.Sprite

  constructor() {
    super()

    this.bottomLayer = new PIXI.Container()
    this.midLayer = new PIXI.Container()
    this.topLayer = new PIXI.Container()

    this.addChild(this.bottomLayer)
    this.addChild(this.midLayer)
    this.addChild(this.topLayer)

    this.mainBack = new PIXI.Sprite(ResourceManager.instance.getTexture('main_back.jpg'))
    this.mainBack.anchor.set(0.5, 0)

    this.bottomLayer.addChild(this.mainBack)
  }

  public async init(options: any = {}): Promise<void> {
    this.options = options
  }

  public async release(): Promise<void> {
    this.removeAllListeners()

    while (this.children.length > 0) {
      this.removeChildAt(0)
    }
  }

  public resize(width: number, height: number, resolution: number): void {
    this.bottomLayer.x = width / 2
    this.midLayer.x = width / 2
    this.topLayer.x = width / 2
  }

  public update(dt: number): void {
  }

  public async close(): Promise<void> {
    this.interactive = false
    this.buttonMode = false

    await ScreenManager.instance.hideScreen(this)

    this.emit('close')
  }

  public waitTapToClose(): void {
    this.interactive = true
    this.buttonMode = true

    this.once('pointerdown', async () => await this.close())
  }

  public getOptions(): any {
    return this.options
  }
}