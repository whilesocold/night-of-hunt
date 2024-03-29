import { EventEmitter } from 'eventemitter3'

import { TextureManager, TextureManagerEvent } from './TextureManager'
import { FontManager, FontManagerEvent } from './FontManager'
import { SoundManager, SoundManagerEvent } from './SoundManager'
import { Utils } from '../Utils'

export enum ResourceManagerEvent {
  Error = 'AssetManagerEventError',
  Progress = 'AssetManagerEventProgress',
  Complete = 'AssetManagerEventComplete',
}

export class ResourceManager extends EventEmitter {
  public static instance: ResourceManager

  private textureManager: TextureManager = null
  private fontManager: FontManager = null
  private soundManager: SoundManager = null

  constructor() {
    super()

    ResourceManager.instance = this

    this.textureManager = new TextureManager()
    this.fontManager = new FontManager()
    this.soundManager = new SoundManager()
  }

  private addSomething(key: string, url: string): void {
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.json')) {
      this.textureManager.add(key, url)

    } else if (url.includes('.ttf')) {
      this.fontManager.add(key)

    } else if (url.includes('.mp3') || url.includes('.wav') || url.includes('.ogg')) {
      this.soundManager.add(key, url)
    }
  }

  public add(key: string, url: string): ResourceManager {
    this.addSomething(key, url)

    return this
  }

  public addFromMap(map: any): ResourceManager {
    for (const key of Object.keys(map)) {
      this.addSomething(key, map[key])
    }

    return this
  }

  public load(): Promise<ResourceManager> {
    const totalCount = this.textureManager.length() + this.fontManager.length()
    let currentCount = 0

    const iteration = () => {
      this.emit(ResourceManagerEvent.Progress, ++currentCount, totalCount, Utils.remap(currentCount, 0, totalCount, 0, 100))
    }
    this.textureManager.on(TextureManagerEvent.Progress, () => iteration())
    this.textureManager.once(TextureManagerEvent.Complete, () => {
      this.fontManager.on(FontManagerEvent.Progress, () => iteration())
      this.fontManager.once(FontManagerEvent.Complete, () => {
        this.soundManager.on(SoundManagerEvent.Progress, () => iteration())
        this.soundManager.once(SoundManagerEvent.Complete, () => {
          this.textureManager.removeAllListeners()
          this.fontManager.removeAllListeners()
          this.soundManager.removeAllListeners()

          this.emit(ResourceManagerEvent.Complete)
        })

        this.soundManager.load()
      })
      this.fontManager.load()
    })

    this.textureManager.load()

    return Promise.resolve(this)
  }

  public free(): ResourceManager {
    this.textureManager.free()
    this.fontManager.free()
    this.soundManager.free()

    return this
  }

  public getTexture(key: string): any {
    return this.textureManager.get(key)
  }

  public getTextureManager(): TextureManager {
    return this.textureManager
  }

  public getFontManager(): FontManager {
    return this.fontManager
  }

  public getSoundManager(): SoundManager {
    return this.soundManager
  }
}
