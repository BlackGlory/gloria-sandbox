# gloria-sandbox [![npm](https://img.shields.io/npm/v/gloria-sandbox.svg?maxAge=2592000)](https://www.npmjs.com/package/gloria-sandbox) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/BlackGlory/gloria-sandbox/master/LICENSE)

Sandbox for Gloria based on [BlackGlory/worker-sandbox](https://github.com/BlackGlory/worker-sandbox)

## Context

* async fetch(url: string, options: Object, ...args) : Responsse
* async importScripts(url: string) : { [string]: Object }
* async commit(data: GloriaNotification) : void
* async $importScriptString(url) : string
* async $prepareFetch(url, options) : void

## Related projects

* [Gloria: A programmable website notifications aggregator in Chrome.](https://github.com/BlackGlory/Gloria)
* [gloria-utils: Chrome extension Gloria task utils](https://github.com/BlackGlory/gloria-utils)