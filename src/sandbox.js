import GloriaUtils from 'raw-loader!gloria-utils'
import Sandbox from 'worker-sandbox'

export class GloriaSandbox extends Sandbox {
  constructor() {
    super()

    return new Promise(async (resolve, reject) => {
      try {
        await this.assign({
          async fetch(url, options = {}, ...args) {
            options = Object.assign({
              headers: {}
            }, options)

            let cookies = await getCookies(url)
              , data = { cookie: cookies }

            if (options.headers['Cookie']) {
              data.cookie = options.headers['Cookie']
            }
            if (options.headers['Origin']) {
              data.origin = options.headers['Origin']
            }
            if (options.headers['Referer']) {
              data.referer = options.headers['Referer']
            }

            await setSessionStorage(url, data)
            options.headers['send-by'] = 'Gloria'
            return self.fetch(url, options, ...args)
          }
        , async importScripts(...args) {
            return await Promise.all([args.map(url => importScript(url))])
          }
        })

        await this.define('getCookies', async url => {
          let cookies = await chrome.cookies.getAll({ url }) || []
          return cookies.map(x => `${ x.name }=${ x.value }`).join('; ')
        })

        await this.define('setSessionStorage', async (url, data) => {
          let name = `request.inflate.${ url }`
          try {
            window.sessionStorage[name] = JSON.stringify(data)
          } catch(e) {
            if (e.name === 'QuotaExceededError') {
              window.sessionStorage.clear()
              window.sessionStorage[name] = JSON.stringify(data)
            } else {
              console.error(e)
            }
          }
          return window.sessionStorage[name]
        })

        await this.define('importScript', async url => {
          if (url === 'gloria-utils') {
            return GloriaUtils
          } else {
            let name = `import-scripts.cache.${ url }`
              , cache = window.sessionStorage[name]

            if (cache) {
              return cache
            } else {
              return fetch(url)
              .then(res => {
                if (res.status >= 200 && res.status < 300) {
                  return res.text()
                } else {
                  throw new Error(res.statusText)
                }
              })
              .then(content => {
                try {
                  window.sessionStorage[name] = content
                } catch(e) {
                  if (e.name === 'QuotaExceededError') {
                    window.sessionStorage.clear()
                    window.sessionStorage[name] = content
                  } else {
                    console.error(e)
                  }
                }
                return content
              })
            }
          }
        })

        await this.define('commit', data => {
          this.destory()
          this.dispatchEvent(new CustomEvent('commit', {
            detail: data
          }))
        })

        resolve(this)
      } catch(e) {
        reject(e)
      }
    })
  }
}

export default GloriaSandbox
