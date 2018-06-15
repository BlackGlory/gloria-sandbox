declare module 'worker-loader?name=worker.js!./worker' {
  class WebpackWorker extends Worker {
    constructor()
  }

  export default WebpackWorker
}

declare module 'worker-loader?inline&name=worker.js!./worker' {
  class WebpackWorker extends Worker {
    constructor()
  }

  export default WebpackWorker
}

declare module 'raw-loader!gloria-utils' {
  const raw: string
  export = raw
}

declare module 'gloria-utils' {
  const utils: any
  export default utils
}