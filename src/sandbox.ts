import { Sandbox } from 'worker-sandbox'
import SandboxWorker from 'worker-loader?inline&name=worker.js!./worker'

type Constructor<T> = new(...args: any[]) => T

function mixinEvent<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    private handlers: { [index: string]: Array<((event: any) => void)> } = Object.create({})

    on(type: string, handler: (evt: any) => void) {
      if (!this.handlers[type]) {
        this.handlers[type] = []
      }
      this.handlers[type].push(handler)
    }

    off(type: string, handler: (evt: any) => void) {
      if (this.handlers[type]) {
        const index = this.handlers[type].indexOf(handler)
        if (index >= 0) {
          this.handlers[type].splice(index, 1)
        }
      }
    }

    once(type: string, handler: (evt: any) => void) {
      const onceHandler = (evt: any) => {
        handler(evt)
        this.off(type, onceHandler)
      }
      this.on(type, onceHandler)
    }

    emit(type: string, evt: any) {
      if (this.handlers[type]) {
        this.handlers[type].forEach(handler => handler(evt))
      }
    }
  }
}

export class GloriaSandbox extends mixinEvent(Sandbox) {
  private committed = false
  then?: any

  constructor() {
    super(new SandboxWorker())

    const asyncConstructor = async () => {
      await Promise.all(Object.entries({
        commit: (data: any) => {
          if (!this.committed) {
            this.committed = true
            this.emit('commit', data)
          }
        }
      }).map(([name, fn]) => this.registerCall(name, fn)))
    }

    const init = (async () => {
      await asyncConstructor()
      delete this.then
      return this
    })()
    this.then = init.then.bind(init)
  }
}

export default GloriaSandbox
