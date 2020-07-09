import { EventEmitter } from 'eventemitter3'

interface AppInitOptions {
  debugMode?: boolean
}

export class App extends EventEmitter {
  constructor() {
    super()
  }

  public async init(props: AppInitOptions = { debugMode: false }): Promise<void> {
    console.log('App::init() -', props)
  }
}