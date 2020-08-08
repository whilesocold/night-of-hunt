import EventEmitter from 'eventemitter3'

export interface RequestOptions {
  command: string
  user: any
  enemy: any
}

export interface RequestAttackOptions extends RequestOptions {
  card: number
  reward: any
}

export class RequestManager extends EventEmitter {
  protected socket: WebSocket

  public async connect(url: string): Promise<void> {
    return new Promise(resolve => {
      this.socket = new WebSocket(url)

      console.log(url)

      this.socket.onopen = (e: any) => {
        console.log('[open] Connection established')
        console.log('Sending to server', e)

        resolve()
      }

      this.socket.onmessage = (e: any) => {
        console.log(e)
        const data = e.data
        const json = JSON.parse(data)

        if ('command' in json) {
          this.emit(json.command, json)
        }

        console.log('([message] Data received from server:', json)
      }

      this.socket.onclose = (e: any) => {
        if (e.wasClean) {
          console.log(`[close] Connection closed cleanly, code=${e.code} reason=${e.reason}`)

        } else {
          console.log('[close] Connection died')
        }
      }

      this.socket.onerror = (e: any) => {
        console.log(`[error] ${e.message}`)
      }
    })
  }

  public async request(options: any): Promise<void> {
    this.socket.send(JSON.stringify(options))

    return Promise.resolve()
  }
}