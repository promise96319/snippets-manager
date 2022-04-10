import { expect, it, describe } from 'vitest'
import { transformSnippetToText, transformTextToSnippet } from '../src/utils/text'

describe('transform text', async() => {
  const snippet = {
    scope: 'js',
    prefix: 'test',
    body: ['', 'test', '', 'asd', ''],
    description: 'hello world',
  }
  const text = await transformSnippetToText('test', snippet)
  it('transformSnippetToText', async() => {
    expect(text).toMatchInlineSnapshot(`
      "/* eslint-disable */
      // @group test
      // @scope js
      // @prefix test
      // @description hello world
      
      test
      
      asd
      "
    `)
  })

  it('transformTextToSnippet', async() => {
    expect(await transformTextToSnippet(text)).toMatchInlineSnapshot(`
      {
        "body": [
          "test",
          "",
          "asd",
        ],
        "description": "hello world",
        "group": "test",
        "prefix": "test",
        "scope": "js",
      }
    `)
  })
})
