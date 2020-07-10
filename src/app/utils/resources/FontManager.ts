import WebFont from 'webfontloader'

import { EventEmitter } from 'eventemitter3'

export enum FontManagerEvent {
  Error = 'FontManagerEvent.Error',
  Progress = 'FontManagerEvent.Progress',
  Complete = 'FontManagerEvent.Complete',
}

export class FontManager extends EventEmitter {
  families: any

  constructor() {
    super()

    this.families = []
  }

  public add(key: string): FontManager {
    this.families.push(key)

    return this
  }

  public addFromArray(keys: any): FontManager {
    this.families = this.families.concat(keys)

    return this
  }

  // TODO: Progress and Error events
  public load(): Promise<FontManager> {
    if (this.families.length === 0) {
      this.emit(FontManagerEvent.Complete)
      return Promise.resolve(this)
    }

    return new Promise(resolve => {
      WebFont.load({
        custom: {
          families: this.families,
        },
        inactive: () => {
          this.emit(FontManagerEvent.Error)
        },
        active: () => {
          resolve(this)

          this.emit(FontManagerEvent.Complete)
        },
      })
    })
  }

  public free(): FontManager {
    this.families = []

    return this
  }

  public length(): number {
    return this.families.length
  }
}
