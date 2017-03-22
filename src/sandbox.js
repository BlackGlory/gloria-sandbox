import GloriaUtils from 'raw-loader!gloria-utils'
import Sandbox from 'worker-sandbox'

function getCookiesByUrl(url) {
  return new Promise((resolve, reject) => {
    chrome.cookies.getAll({ url }, resolve)
  })
}

export async function createGloriaSandbox() {
  let sandbox = new Sandbox()

  await sandbox.assign({
    fetch(url, options = {}, ...args) {
      options = Object.assign({
        headers: {}
      }, options)

      return getCookies(url)
      .then(cookies => {
        data = { cookie: cookies }
        if (options.headers['Cookie']) {
          data.cookie = options.headers['Cookie']
        }
        if (options.headers['Origin']) {
          data.origin = options.headers['Origin']
        }
        if (options.headers['Referer']) {
          data.referer = options.headers['Referer']
        }
        return data
      })
      .then(data => setSessionStorage(url, data))
      .then(() => {
        options.headers['send-by'] = 'Gloria'
        return self.fetch(url, options, ...args)
      })
    }
  , importScripts(url) {
      return importScript(url)
      .then(script => {
        let window = self
        return eval.call(window, script)
      })
    }
  })

  await sandbox.registerCall('getCookies', async url => {
    let cookies = await getCookiesByUrl(url) || []
    return cookies.map(x => `${ x.name }=${ x.value }`).join('; ')
  })

  await sandbox.registerCall('setSessionStorage', async (url, data) => {
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

  await sandbox.registerCall('importScript', async url => {
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

  await sandbox.registerCall('commit', data => {
    setTimeout(() => {
      sandbox.dispatchEvent(new CustomEvent('commit', {
        detail: data
      }))
    }, 0)
  })

  return sandbox
}

export default createGloriaSandbox
