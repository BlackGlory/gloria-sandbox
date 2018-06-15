import * as expect from 'expect'
import { GloriaSandbox } from '../src/sandbox'

describe('GloriaSandbox', () => {
  it('commit', () => new Promise(async (resolve, reject) => {
    const sandbox = await new GloriaSandbox()
  
    sandbox.once('commit', data => {
      expect(data).toEqual({
        title: 'title'
      , message: 'message'
      })
      resolve()
    })

    await sandbox.execute(`
      commit({
        title: 'title'
      , message: 'message'
      })
    `)
  }))

  it('importScripts', async () => {
    const sandbox = await new GloriaSandbox()

    const result = await sandbox.eval(`
      (async () => {
        const cheerio = await importScripts('gloria-utils/cheerio')
        const $ = cheerio.load('<main>Hello World</main>')
        return $('main').text()
      })()
    `)

    expect(result).toEqual('Hello World')
  })
})
