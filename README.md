# gloria-sandbox

Sandbox for Gloria based on [BlackGlory/worker-sandbox](https://github.com/BlackGlory/worker-sandbox)

## Context

* async fetch(url: string, options: Object, ...args) : Promise<Responsse>
* async importScripts(url: string) : Promise<{ [string]: Object }>
* async commit(data: GloriaNotification) : void
* async $importScriptString(url) : string
* async $prepareFetch(url, options) : Promise<void>
