import * as PIXI from 'pixi.js'

import EventEmitter from 'eventemitter3'

import { ResourceManager, ResourceManagerEvent } from './utils/resources/ResourceManager'
import { ResourcesConfig } from './Resources'
import { RequestManager } from './utils/RequestManager'
import { DataStorage } from './utils/DataStorage'
import { BattleScreen } from './components/battle/BattleScreen'
import { GameEvent } from './data/GameEvent'

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
  private requestManager: RequestManager

  private screen: BattleScreen

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
      this.resourceManager.once(ResourceManagerEvent.Complete, () => resolve())
      this.resourceManager.load()
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

    this.screen = new BattleScreen()
    this.stage.addChild(this.screen)

    this.ticker.add((dt) => this.onUpdate(dt))

    window.addEventListener('resize', () => this.onResize())

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

    /*
    EventBus.on(GameEvent.BattleEnemyTurnEnding, () => {
      if (State.has('reward')) {
        this.stage.removeChild(this.screen)
      }
    })
     */
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

  public getStage(): PIXI.Container {
    return this.stage
  }

  getTicker(): PIXI.Ticker {
    return this.ticker
  }
}
