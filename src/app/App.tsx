import EventEmitter from 'eventemitter3'
import * as PIXI from 'pixi.js'
import React from 'react'

import { render } from 'react-pixi-fiber'
import { Root } from './components/Root'
import { ResourceManager, ResourceManagerEvent } from './utils/resources/ResourceManager'
import { ResourcesConfig } from './Resources'
import { RequestManager } from './utils/RequestManager'
import { DataStorage } from './utils/DataStorage'

interface AppInitOptions {
  debugMode?: boolean
}

export class App extends EventEmitter {
  public static instance: App

  private canvas: HTMLCanvasElement
  private app: PIXI.Application

  private width: number

  private resourceManager: ResourceManager
  private requestManager: RequestManager

  private storage: DataStorage

  constructor() {
    super()

    App.instance = this
  }

  private initStorage(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search)
    const bossId = urlParams.has('bossId') ? urlParams.get('bossId') : 12
    const sessionId = urlParams.has('sessionId') ? urlParams.get('sessionId') : 'node0y83vqbsk259wy1urugzobjz0323.node0'

    this.storage = new DataStorage()
    this.storage.set({
      bossId: bossId,
      sessionId: sessionId,
      response: {},
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
      this.requestManager.once('init', response => {
        this.storage.set('response', response)

        resolve()
      })

      await this.requestManager.connect(url)
    })
  }

  private async onSkillDown(card: number): Promise<void> {
    console.log(card)

    this.requestManager.once('attack', (data) => {
      console.log(data)
      const response = this.storage.get('response')

      response.user = data.user
      response.enemy = data.enemy
      response.reward = data.reward

      this.storage.set({
        response: response
      })
    })

    await this.requestManager.request({
      command: 'attack',
      card: card,
    })
  }

  public async init(props: AppInitOptions = { debugMode: false }): Promise<void> {
    console.log('App::init() -', props)

    await this.initStorage()
    await this.loadResources(ResourcesConfig)
    await this.connectToServer('wss://ohota.mobi/ws/fightBoss?bossId=' + this.storage.get('bossId') + '&jsessionid=' + this.storage.get('sessionId'))

    this.width = 460

    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.app = new PIXI.Application({
      backgroundColor: 0x000000,
      view: this.canvas,
      width: this.width,
      height: 800,
      antialias: true,
      resolution: window.devicePixelRatio,
      resizeTo: window,
    })

    render(<Root width={this.width}
                 bossId={this.storage.get('bossId')}
                 response={this.storage.get('response')}
                 app={this.app}
                 onSkillDown={id => this.onSkillDown(id)}
    />, this.app.stage)
  }

  public getStorage(): DataStorage {
    return this.storage
  }
}
