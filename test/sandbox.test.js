'use strict'

import { expect } from 'chai'
import createGloriaSandbox from '../src/sandbox'

describe('GloriaSandbox', function() {
  it('commit', () => new Promise(async (resolve, reject) => {
    const sandbox = await createGloriaSandbox()
    sandbox.addEventListener('error', ({ detail }) => reject(detail))
    sandbox.addEventListener('commit', ({ detail }) => {
      expect(detail).to.deep.equal({
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
    `, 1000 * 60)
  }))

  it('importScripts', () => new Promise(async (resolve, reject) => {
    const sandbox = await createGloriaSandbox()
    sandbox.addEventListener('error', ({ detail }) => reject(detail))
    sandbox.addEventListener('commit', ({ detail }) => {
      expect(detail).to.deep.equal([
        'cheerio'
      , 'lodash'
      , 'moment'
      , 'validator'
      , 'xml2js'
      , 'qs'
      , 'ramda'
      , 'rx'
      , 'cookie'
      , 'sanitizeHtml'
      , 'underscoreString'
      , 'XRegExp'
      , 'is'
      , 'co'
      , 'immutable'
      ])
      resolve()
    })
    await sandbox.execute(`
      (async function() {
        const utils = await importScripts('gloria-utils')
        commit(Object.keys(utils))
      })()
    `, 1000 * 60)
  }))
})
