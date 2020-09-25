import * as PIXI from 'pixi.js'

import { TweenMax } from 'gsap'
import { BaseScreen } from '../components/screens/BaseScreen'

export class ScreenManager extends PIXI.Container {
  public static instance: ScreenManager

  protected screens: Array<BaseScreen>
  protected screen: BaseScreen

  protected container: PIXI.Container

  constructor() {
    super()

    this.screens = new Array<BaseScreen>()
    this.screen = null

    this.container = new PIXI.Container()
    this.addChild(this.container)

    if (!ScreenManager.instance) {
      ScreenManager.instance = this
    }
  }

  public async release(): Promise<void> {
    await this.hideAllScreens()
  }

  public update(dt: number): void {
    this.screens.forEach(screen => {
      if (screen.inited) {
        screen.update(dt)
      }
    })
  }

  public resize(width: number, height: number, resolution: number): void {
    this.screens.forEach(screen => {
      if (this.screen.inited) {
        screen.resize(width, height, resolution)
      }
    })
  }

  public async hideAllScreens(): Promise<void> {
    for (let i = 0; i < this.screens.length; i++) {
      await this.hideScreen(this.screens[i])
    }
  }

  public async showScreen(type: any, options: any = {}): Promise<BaseScreen> {
    return new Promise(async resolve => {
      if (this.screen) {
        await this.hideScreen()
      }

      this.screen = new type(this)
      this.screen.alpha = 0

      this.container.addChild(this.screen)
      this.screens.push(this.screen)

      await this.screen.init(options)

      this.screen.inited = true

      this.emit('resize')

      TweenMax.to(this.screen, 0.25, {
        alpha: 1, onComplete: async () => {
          if ('handleOnShow' in options && options.handleOnShow) {
            options.handleOnShow()
            options.handleOnShow = null
          }

          this.emit('show')

          resolve(this.screen)
        },
      })
    })
  }

  public async hideScreen(screen: BaseScreen = null): Promise<void> {
    return new Promise(async resolve => {
      if (!screen && this.screen) {
        screen = this.screen
      }

      const options = screen.getOptions()

      TweenMax.to(screen, 0.25, {
        alpha: 0, onComplete: async () => {
          screen.alpha = 1

          await screen.release()

          this.screen.inited = false

          this.container.removeChild(screen)
          this.screens.splice(this.screens.indexOf(screen), 1)

          if ('handleOnHide' in options && options.handleOnHide) {
            options.handleOnHide()
            options.handleOnHide = null
          }

          this.emit('hide')

          resolve()
        },
      })
    })
  }
}