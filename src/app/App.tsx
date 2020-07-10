import EventEmitter from 'eventemitter3'
import * as PIXI from 'pixi.js'
import React from 'react'

import { render } from 'react-pixi-fiber'
import { Root } from './components/Root'
import { ResourceManager, ResourceManagerEvent } from './utils/resources/ResourceManager'
import { ResourcesConfig } from './Resources'

interface AppInitOptions {
  debugMode?: boolean
}

export class App extends EventEmitter {
  public static instance: App

  private canvas: HTMLCanvasElement
  private app: PIXI.Application

  private resourceManager: ResourceManager

  constructor() {
    super()

    App.instance = this
  }

  public async loadResources(config: any): Promise<void> {
    return new Promise(resolve => {
      console.log('App::loadResources() -', config)

      this.resourceManager = new ResourceManager()
      this.resourceManager.addFromMap(config)
      this.resourceManager.once(ResourceManagerEvent.Complete, () => resolve())
      this.resourceManager.load()
    })
  }

  public async init(props: AppInitOptions = { debugMode: false }): Promise<void> {
    console.log('App::init() -', props)

    await this.loadResources(ResourcesConfig)

    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.app = new PIXI.Application({
      backgroundColor: 0x000000,
      view: this.canvas,
      width: 460,
      height: 800,
      resizeTo: window,
    })

    render(<Root/>, this.app.stage)
  }
}
