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
        console.log('change:' + key, { changed })
        this.emit('change:' + key, { changed })
      })
    }

    if (!silent) {
      this.emit('change', {
        changed,
      })
    }
  }

  has(key: string): any {
    return this.attributes.has(key)
  }

  get(key: string): any {
    if (this.has(key)) {
      return this.attributes.get(key)
    }

    return null
  }
}
