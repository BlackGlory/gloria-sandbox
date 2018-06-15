import { MessageSystem, PERMISSION } from 'message-system'
import { WorkerMessenger } from 'message-system-worker-messenger'
import * as GloriaUtils from 'gloria-utils'

(self as any)['window'] = self

new MessageSystem(new WorkerMessenger(), [
  PERMISSION.RECEIVE.EVAL
, PERMISSION.RECEIVE.CALL
, PERMISSION.RECEIVE.ASSIGN
, PERMISSION.RECEIVE.ACCESS
, PERMISSION.RECEIVE.REMOVE
, PERMISSION.RECEIVE.REGISTER
, PERMISSION.SEND.CALL
], {
  importScripts(...urls: string[]) {
    if (urls.length === 1 && urls[0].startsWith('gloria-utils')) {
      const [, moduleName] = urls[0].split('/')
      if (moduleName) {
        if (moduleName in GloriaUtils) {
          return (GloriaUtils as any)[moduleName]
        }
      } else {
        return GloriaUtils
      }
    } else {
      return self.importScripts(...urls)
    }
  }
})
