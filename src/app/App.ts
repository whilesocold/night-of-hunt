import * as PIXI from 'pixi.js'

import EventEmitter from 'eventemitter3'

import { ResourcesConfig } from './Resources'

import { ResourceManager, ResourceManagerEvent } from './utils/resources/ResourceManager'
import { RequestManager } from './utils/RequestManager'
import { DataStorage } from './utils/DataStorage'
import { GameEvent } from './data/GameEvent'
import { SoundManager } from './utils/resources/SoundManager'
import { ScreenManager } from './utils/ScreenManager'
import { MapScreen } from './components/screens/MapScreen'
import { ArenaBattleScreen } from './components/screens/ArenaBattleScreen'
import { DeadWarSearchScreen } from './components/screens/DeadWarSearchScreen'

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

  private resourceManager: ResourceManager
  private soundManager: SoundManager
  private requestManager: RequestManager
  private screenManager: ScreenManager

  constructor() {
    App.instance = this
  }

  private initStorage(): void {
    const urlParams = new URLSearchParams(window.location.search)
    const bossId = urlParams.has('bossId') ? urlParams.get('bossId') : 12
    const sessionId = urlParams.has('jsessionId') ? urlParams.get('jsessionId') : 'node0y83vqbsk259wy1urugzobjz0323'

    State.set({
      bossId: bossId,
      sessionId: sessionId,
    })
  }

  private initPIXI(): void {
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
  }

  private initScreenManager(): void {
    this.screenManager = new ScreenManager()
    this.screenManager.on('resize', () => this.onResize())

    this.stage.addChild(this.screenManager)
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

    this.initStorage()

    await this.loadResources(ResourcesConfig)
    //await this.connectToServer('wss://ohota.mobi/ws/fightBoss;jsessionid=' + State.get('sessionId') + '?bossId=' + State.get('bossId'))

    this.initPIXI()
    this.initScreenManager()

    /*
    State.set('reward', {
      'cards': [{ 'id': 0, 'level': 1, 'exp': 2 }],
      'items': [{ 'itemId': 0, 'quality': 1, 'level': 2 }],
      'ingredients': [],
      'exp': 92,
      'silver': 131,
      'gold': 0,
      'pvpRating': 0,
      'userCards': [{
        'id': 1577251,
        'cardId': 7,
        'userId': 388548,
        'name': 'Зов смерти',
        'image': '7.png',
        'school': 3,
        'exp': 74,
        'addExp': 2,
        'level': 1,
        'changed': true,
        'newCard': false,
        'damage': 142,
        'quality': 1,
        'info': { 'id': 7, 'damage': 10, 'school': 3, 'image': '7.png', 'chapter': 0 },
        'maxLevel': 66,
        'percentLevel': 100,
        'nextLevelExp': 5,
        'priceNextLevel': { 'id': 2, 'exp': 5, 'silver': 600, 'gold': 0, 'dropExp': 4, 'damage': 10 },
        'damageOri': 10,
        'schoolName': 'Школа Мага',
      }],
      'newCards': [],
      'userItems': [],
      'userIngredients': [],
      'bonusExp': 0,
      'bonusDays': 0,
      'joins': [{
        'rune': 0,
        'sharpening': 0,
        'id': 51068199,
        'userId': 388548,
        'name': 'Ржавый кинжал дозорного',
        'itemId': 5,
        'typeId': 1,
        'slotTypeId': 3,
        'level': 5,
        'levelMax': 5,
        'exp': 5,
        'createdAt': 1598261866000,
        'updateAt': 1598261866000,
        'join': null,
        'school': 1,
        'equipped': true,
        'quality': 1,
        'health': 28,
        'set': 2,
        'changed': true,
        'lock': { 'holdCount': 0, 'heldByCurrentThread': false, 'locked': false, 'fair': false, 'queueLength': 0 },
        'nextLevel': { 'id': 6, 'exp': 316, 'dropExp': 100 },
        'percentLevel': 1,
        'itemLevel': { 'id': 5, 'exp': 165, 'dropExp': 80 },
        'runeInfo': null,
        'runeDamageNew': 3,
        'sharpeningDamageNew': 2,
        'sharpeningInfo': null,
        'nextSharpeningInfo': { 'level': 1, 'silver': 300, 'gold': 0 },
      }],
      'countJoins': 1,
      'energy': 0,
      'goldLimit': 0,
      'snowflakes': 0,
      'toys': 0,
      'lose': false,
      'valor': 0,
      'blood': 0,
      'expCards': 2,
    })
     */
    //this.showSearchOpponent()

    /*
    if (this.checkReward()) {
      this.showReward()

    } else {
      this.showBattle()
    }
     */

    this.start()
  }

  private start(): void {
    this.ticker.add((dt) => this.onUpdate(dt))

    window.addEventListener('resize', () => this.onResize())
    window.addEventListener('orientationchange', () => this.onResize())

    this.initGameEvents()

    this.screenManager.showScreen(DeadWarSearchScreen, [
      { name: 'Вы', rating: 1400, addRating: 39 },
      { name: 'Batman', rating: 1400, addRating: 43 },
      { name: 'Robin', rating: 1400, addRating: -3 },
      { name: 'Joker', rating: 1400, addRating: -5 },
      { name: 'Superman', rating: 1400, addRating: -8 },
    ])

    this.onUpdate(1)
    this.onResize()
  }

  private initGameEvents(): void {
    EventBus.on(GameEvent.BattleAttack, async (index: number) => {
      this.requestManager.once('attack', data => {
        console.log('attack', data)

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
        //this.showReward()
      }
    })
  }

  /*
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

  private async showSearchOpponent(): Promise<void> {
    this.releaseScreen()

    this.screen = new ArenaScreen()
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

    console.log(JSON.stringify(State.get('reward')))

    this.stage.addChild(this.screen = new BattleRewardScreen(State.get('reward') as BattleRewardState))
    this.onResize()
  }
   */

  private checkReward(): boolean {
    if (State.has('reward')) {
      return true
    }

    return false
  }

  private onUpdate(dt: number): void {
    if (this.screenManager) {
      this.screenManager.update(dt)
    }
  }

  private onResize(): void {
    const width = this.app.renderer.width
    const height = this.app.renderer.height
    const resolution = this.app.renderer.resolution

    if (this.screenManager) {
      this.screenManager.scale.set(0.5)
      this.screenManager.resize(width / resolution, height / resolution, resolution)
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

  public getTicker(): PIXI.Ticker {
    return this.ticker
  }

  public getWidth(): number {
    return this.app.renderer.width / this.app.renderer.resolution
  }

  public getHeight(): number {
    return this.app.renderer.height / this.app.renderer.resolution
  }
}
