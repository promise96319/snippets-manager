import type { Snippet } from '../types'

export const COMMENT_PREFIX = '// @'
export const ESLINT_DISABLE = '/* eslint-disable */'

export const transformTextToLines = (text: string): string[] => {
  return text.split(/\r\n|\r|\n/)
}

export const transformSnippetToText = (group: string, snippet: Snippet): string => {
  const texts = [ESLINT_DISABLE]
  Object.entries(Object.assign({ group }, snippet)).forEach(([key, value]: [string, string]) => {
    if (key !== 'body')
      texts.push(`${COMMENT_PREFIX}${key} ${value}`)
  })
  texts.push(...snippet.body)
  return texts.join('\n')
}

export const transformTextToSnippet = (text: string) => {
  const lines = transformTextToLines(text)
  const body: string[] = []
  const snippet: Partial<Snippet> & Record<string, string> = {}

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line === ESLINT_DISABLE)
      continue

    if (line.startsWith(COMMENT_PREFIX)) {
      // parse comment line, get key and value
      const reg = new RegExp(`${COMMENT_PREFIX}(\\w+)\\s*(.*)?`)
      const matched = line.match(reg)
      if (!matched) {
        body.push(line)
        continue
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, key, value] = matched
      if (key)
        snippet[key] = value && value.trim()

      continue
    }

    body.push(line)
  }

  const isEmptyLine = (line: string) =>
    !line
    || line.trim() === ''
    || line.trim() === '/n'
    || line.trim() === '/r'
    || line.trim() === '/r/n'

  const trimBody = [...body]
  for (let i = 0; i < body.length; i++) {
    if (!isEmptyLine(body[i]))
      break
    trimBody.shift()
  }
  for (let j = body.length - 1; j >= 0; j--) {
    if (!isEmptyLine(body[j]))
      break
    trimBody.pop()
  }

  snippet.body = trimBody
  return snippet
}
