import * as PIXI from 'pixi.js'

import EventEmitter from 'eventemitter3'

import { ResourceManager, ResourceManagerEvent } from './utils/resources/ResourceManager'
import { ResourcesConfig } from './Resources'
import { RequestManager } from './utils/RequestManager'
import { DataStorage } from './utils/DataStorage'
import { BattleScreen } from './components/screens/BattleScreen'
import { GameEvent } from './data/GameEvent'
import { BattleRewardScreen } from './components/screens/BattleRewardScreen'
import { BattleRewardState } from './data/BattleRewardState'
import { SoundManager } from './utils/resources/SoundManager'
import { MapScreen } from './components/screens/MapScreen'

interface AppInitOptions {
  debugMode?: boolean
}

export const EventBus = new EventEmitter()
export const State = new DataStorage()

export class App {
  public static instance: App

  private canvas: HTMLCanvasElement

  private app: PIXI.Application
  private stage: PIXI.Container
  private ticker: PIXI.Ticker

  private width: number

  private resourceManager: ResourceManager
  private soundManager: SoundManager
  private requestManager: RequestManager

  private screen: any

  constructor() {
    App.instance = this
  }

  private initStorage(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search)
    const bossId = urlParams.has('bossId') ? urlParams.get('bossId') : 12
    const sessionId = urlParams.has('jsessionId') ? urlParams.get('jsessionId') : 'node0y83vqbsk259wy1urugzobjz0323'

    State.set({
      bossId: bossId,
      sessionId: sessionId,
    })

    return Promise.resolve()
  }

  private async loadResources(config: any): Promise<void> {
    return new Promise(resolve => {
      console.log('App::loadResources() -', config)

      this.resourceManager = new ResourceManager()
      this.resourceManager.addFromMap(config)
      this.resourceManager.on(ResourceManagerEvent.Progress, (current, total, percent) => {
        const div = document.getElementById('progress')

        div.setAttribute('value', percent)
        div.setAttribute('data-label', 'Loading: ' + Math.floor(percent) + '%')
      })
      this.resourceManager.once(ResourceManagerEvent.Complete, () => resolve())
      this.resourceManager.load()

      this.soundManager = new SoundManager()
    })
  }

  private async connectToServer(url: string): Promise<void> {
    return new Promise(async resolve => {
      this.requestManager = new RequestManager()
      this.requestManager.once('init', data => {
        State.set(data)
        EventBus.emit(GameEvent.BattleStarting, State)
        resolve()
      })

      await this.requestManager.connect(url)
    })
  }

  public async init(props: AppInitOptions = { debugMode: false }): Promise<void> {
    console.log('App::init() -', props)

    await this.initStorage()
    await this.loadResources(ResourcesConfig)
    await this.connectToServer('wss://ohota.mobi/ws/fightBoss;jsessionid=' + State.get('sessionId') + '?bossId=' + State.get('bossId'))

    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.app = new PIXI.Application({
      backgroundColor: 0x000000,
      view: this.canvas,
      antialias: true,
      resolution: 2,//window.devicePixelRatio,
      resizeTo: window,
    })

    this.ticker = this.app.ticker
    this.stage = this.app.stage

    this.showMap()

    /*
    if (this.checkReward()) {
      this.showReward()

    } else {
      this.showBattle()
    }
     */

    this.ticker.add((dt) => this.onUpdate(dt))

    window.addEventListener('resize', () => this.onResize())
    window.addEventListener('orientationchange', () => this.onResize())

    this.initGameEvents()

    this.onUpdate(1)
    this.onResize()
  }

  private initGameEvents(): void {
    EventBus.on(GameEvent.BattleAttack, async (index: number) => {
      this.requestManager.once('attack', data => {
        State.set(data)
        EventBus.emit(GameEvent.BattlePlayerTurnStarting, State)
      })

      await this.requestManager.request({
        command: 'attack',
        card: index,
      })
    })

    EventBus.on(GameEvent.BattleEnemyTurnEnding, () => {
      if (this.checkReward()) {
        this.showReward()
      }
    })
  }

  private releaseScreen(): void {
    if (this.screen) {
      this.stage.removeChild(this.screen)
    }
  }

  private async showMap(): Promise<void> {
    this.releaseScreen()

    this.screen = new MapScreen()
    this.stage.addChild(this.screen)
  }

  private async showBattle(): Promise<void> {
    this.releaseScreen()

    this.screen = new BattleScreen()
    this.stage.addChild(this.screen)

    const soundFadeTime = 2

    const ambientMusic = this.soundManager.get('battle_music.mp3')

    if (ambientMusic) {
      ambientMusic.fadeTo(1, soundFadeTime).then(() => this.soundManager.stop('ambient_music.mp3'))
    }

    const battleMusic = await this.soundManager.play('battle_music.mp3', { loop: true })

    battleMusic.volume = 0
    battleMusic.fadeTo(1, soundFadeTime)
  }

  private async showReward(): Promise<void> {
    const soundFadeTime = 2

    const battleMusic = this.soundManager.get('battle_music.mp3')

    if (battleMusic) {
      battleMusic.fadeTo(0, soundFadeTime).then(() => this.soundManager.stop('battle_music.mp3'))
    }

    const ambientMusic = await this.soundManager.play('ambient_music.mp3', { loop: true })

    ambientMusic.volume = 0
    ambientMusic.fadeTo(1, soundFadeTime)

    this.releaseScreen()

    this.stage.addChild(this.screen = new BattleRewardScreen(State.get('reward') as BattleRewardState))
    this.onResize()
  }

  private checkReward(): boolean {
    if (State.has('reward')) {
      return true
    }

    return false
  }

  private onUpdate(dt: number): void {
    if (this.screen) {
      this.screen.update(dt)
    }
  }

  private onResize(): void {
    const width = this.app.renderer.width
    const height = this.app.renderer.height
    const resolution = this.app.renderer.resolution

    if (this.screen) {
      this.screen.scale.set(0.5)
      this.screen.resize(width / resolution, height / resolution, resolution)
    }
  }

  public getApp(): PIXI.Application {
    return this.app
  }

  public getRenderer(): PIXI.Renderer {
    return this.app.renderer
  }

  public getStage(): PIXI.Container {
    return this.stage
  }

  getTicker(): PIXI.Ticker {
    return this.ticker
  }
}
