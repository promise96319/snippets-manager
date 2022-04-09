import { expect, it, describe } from 'vitest'
import {
  getAllGroups,
  updateGroup,
  getGroupPath,
  isGroupName,
  parseGroupName,
  removeAllGroups,
} from '../src/group'
import type { Snippet } from '../src/types'

it('getGroupPath', async() => {
  expect(await getGroupPath('test')).toMatch('ghghgh_test.code-snippets')
})

it('isGroupName', async() => {
  expect(isGroupName('ghghgh_test.code-snippets')).toBe(true)
  expect(isGroupName('ghghgh_test.code-snippet')).toBe(false)
  expect(isGroupName('ghghgg_test.code-snippets')).toBe(false)
})

it('parseGroupName', async() => {
  expect(parseGroupName('ghghgh_test.code-snippets')).toBe('test')
})

describe.skip('group', () => {
  const snippets: Snippet = {
    scope: 'js',
    prefix: 'test',
    body: ['test'],
    description: 'hello world',
  }
  const group = 'test'
  it('removeAllGroups', async() => {
    await removeAllGroups()
    expect(await getAllGroups()).toEqual({})
  })

  it('addGroup', async() => {
    await updateGroup(group, snippets)
    expect(await getAllGroups()).toMatchInlineSnapshot(`
    {
      "test": {
        "test": {
          "body": [
            "test",
          ],
          "description": "hello world",
          "prefix": "test",
          "scope": "js",
        },
      },
    }
  `)
  })

  it('updateGroup', async() => {
    snippets.scope = 'ts'
    await updateGroup(group, snippets)
    expect(await getAllGroups()).toMatchInlineSnapshot(`
    {
      "test": {
        "test": {
          "body": [
            "test",
          ],
          "description": "hello world",
          "prefix": "test",
          "scope": "ts",
        },
      },
    }
  `)
  })
})
