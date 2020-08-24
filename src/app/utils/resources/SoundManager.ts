import * as PIXI from 'pixi.js'

import PIXISound from 'pixi-sound'

import {TweenMax} from 'gsap'

import { EventEmitter } from 'eventemitter3'

export class SoundPlayOptions {
  speed?: number
  volume?: number
  loop?: boolean
}

export class Sound extends EventEmitter {
  public key: string

  private sound: PIXISound.Sound = null
  private playProps: SoundPlayOptions

  constructor(key, props) {
    super()

    this.playProps = props
    this.sound = PIXISound.find(key)
  }

  public play(): Promise<Sound> {
    if (this.sound) {
      this.sound.play(this.playProps as any)
    }

    return Promise.resolve(this)
  }

  public stop(): Promise<Sound> {
    if (this.sound) {
      this.sound.stop()
    }

    return Promise.resolve(this)
  }

  public pause(): Promise<Sound> {
    if (this.sound) {
      this.sound.pause()
    }

    return Promise.resolve(this)
  }

  public resume(): Promise<Sound> {
    if (this.sound) {
      this.sound.resume()
    }

    return Promise.resolve(this)
  }

  public duration(): number {
    return this.sound ? this.sound.duration : 0
  }

  public isPlaying(): boolean {
    return this.sound ? this.sound.isPlaying : false
  }

  public isPaused(): boolean {
    return this.sound ? this.sound.paused : false
  }

  public isLoop(): boolean {
    return this.sound ? this.sound.loop : false
  }

  public fadeTo(volume: number, time: number): Promise<void> {
    return new Promise(resolve => {
      TweenMax.to(this, time, { volume: volume, onComplete: () => resolve() })
    })
  }

  public set volume(value: number) {
    this.sound.volume = value
  }

  public get volume(): number {
    return this.sound.volume
  }
}

export enum SoundManagerEvent {
  Error = 'SoundManagerEvent.Error',
  Progress = 'SoundManagerEvent.Progress',
  Complete = 'SoundManagerEvent.Complete',
}

export class SoundManager extends EventEmitter {
  loader: PIXI.Loader = null
  urls: Array<string> = null
  instances: Array<Sound> = null

  constructor() {
    super()

    this.loader = new PIXI.Loader()
    this.urls = new Array<string>()
    this.instances = new Array<Sound>()
  }

  public add(key: string, url: string): SoundManager {
    this.loader.add(key, url)
    this.urls[key] = url

    return this
  }

  public addFromMap(map: any): SoundManager {
    for (const [key, url] of map) {
      this.loader.add(key, url)
      this.urls[key] = url
    }

    return this
  }

  public load(): Promise<SoundManager> {
    this.loader.removeAllListeners()
    this.loader.on('error', error => this.emit(SoundManagerEvent.Error, error))
    this.loader.on('complete', () => this.emit(SoundManagerEvent.Complete))
    this.loader.on('progress', loader =>
      this.emit(SoundManagerEvent.Progress, Math.round(loader.progress)),
    )

    this.loader.load()

    return Promise.resolve(this)
  }

  public free(): SoundManager {
    this.loader.reset()

    return this
  }

  public play(
    key: string,
    props: SoundPlayOptions = {
      speed: 1,
      volume: 1,
      loop: false,
    },
  ): Promise<Sound> {
    const sound = new Sound(key, props)

    if (('loop' in props && props.loop === false) || !('loop' in props)) {
      sound.on('complete', () => this.stop(key))
    }

    sound.key = key

    if (!sound) {
      console.warn('Sound not found ' + key)
    }

    this.instances.push(sound)

    return sound.play()
  }

  public stop(key: string): void {
    const sound = this.get(key)

    if (sound) {
      sound.stop()
      this.instances.splice(this.instances.indexOf(sound), 1)
    }
  }

  public get(key: string): Sound {
    return this.instances.find(sound => sound.key === key)
  }

  public length(): number {
    return Object.keys(this.urls).length
  }

  public mute(): void {
    PIXISound.muteAll()
  }

  public unmute(): void {
    PIXISound.unmuteAll()
  }
}
