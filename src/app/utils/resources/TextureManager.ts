import { EventEmitter } from 'eventemitter3'
import * as PIXI from 'pixi.js'

export enum TextureManagerEvent {
  Error = 'TextureManagerEvent.Error',
  Progress = 'TextureManagerEvent.Progress',
  Complete = 'TextureManagerEvent.Complete',
}

export class TextureManager extends EventEmitter {
  loader: PIXI.Loader = null
  urls: Array<string> = null

  constructor() {
    super()

    this.loader = new PIXI.Loader()
    this.urls = new Array<string>()
  }

  public add(key: string, url: string): Promise<TextureManager> {
    this.loader.add(key, url)
    this.urls[key] = url

    return Promise.resolve(this)
  }

  public addFromMap(map: any): Promise<TextureManager> {
    for (const [key, url] of map) {
      this.loader.add(key, url)
      this.urls[key] = url
    }

    return Promise.resolve(this)
  }

  public load(): Promise<TextureManager> {
    this.loader.removeAllListeners()
    this.loader.on('error', error =>
      this.emit(TextureManagerEvent.Error, error),
    )
    this.loader.on('complete', () => this.emit(TextureManagerEvent.Complete))
    this.loader.on('progress', loader =>
      this.emit(TextureManagerEvent.Progress, Math.round(loader.progress)),
    )

    this.loader.load()

    return Promise.resolve(this)
  }

  public free(): Promise<TextureManager> {
    this.loader.reset()

    return Promise.resolve(this)
  }

  public get(key: string): any {
    if (key in PIXI.utils.TextureCache) {
      return PIXI.utils.TextureCache[key]
    }

    if (key in this.loader.resources) {
      return this.loader.resources[key].texture
    }

    return null
  }

  public length(): number {
    return Object.keys(this.urls).length
  }
}
