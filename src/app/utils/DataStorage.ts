import { EventEmitter } from 'eventemitter3'

export class DataStorage extends EventEmitter {
  public attributes: Map<string, any> = new Map<string, any>()

  constructor(attributes: object = {}) {
    super()

    this.set(attributes)
  }

  set(keyOrAttributes: any, value?: any): void {
    const silent = value && value.silent
    const changed = new Map()

    if (typeof keyOrAttributes === 'string') {
      this.attributes.set(keyOrAttributes, value)

      changed.set(keyOrAttributes, value)

      this.emit('change:' + keyOrAttributes, { changed })
    } else {
      Object.keys(keyOrAttributes).forEach(key => {
        this.attributes.set(key, keyOrAttributes[key])
        changed.set(key, keyOrAttributes[key])
      })

      Object.keys(keyOrAttributes).forEach(key => {
        this.emit('change:' + key, { changed })
      })
    }

    if (!silent) {
      this.emit('change', {
        changed,
      })
    }
  }

  get(key: string): any {
    if (this.attributes.has(key)) {
      return this.attributes.get(key)
    }

    return null
  }
}
