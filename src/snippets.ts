import * as os from 'os'
import * as path from 'path'
import { existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import { window, Uri, languages, Range, Position, Selection } from 'vscode'
import { error, getSelectedText, info, transformSnippetToText, transformTextToSnippet } from './utils'
import { updateGroup, GROUP_DEFAULT } from './group'
import { provider } from './provider'
import type { Snippet } from './types'

export const SCOPE_GLOBAL = '*'
export const TMP_FILE_SUFFIX = 'gh_snippets_tmp.snippets'

export async function normalizeSnippet(text: string): Promise<Snippet | undefined> {
  if (!text) {
    text = getSelectedText() || ''
    text = text.replace(/\$/g, '\\$')
  }

  const key = await window.showInputBox({ placeHolder: 'snippet key' })
  if (!key) return

  const language = window.activeTextEditor?.document.languageId

  return {
    scope: language || SCOPE_GLOBAL,
    prefix: key,
    body: [text],
    description: '',
  }
}

export async function openSippetFile(group: string = GROUP_DEFAULT, snippet: Snippet): Promise<void> {
  // 1. snippet to text
  const text = transformSnippetToText(group, snippet)
  const language = window.activeTextEditor?.document.languageId || 'text'

  // 2. create file
  const { prefix } = snippet
  const removeSlash = (str: string) => str.replace(/\//g, '_')
  const filename = `${removeSlash(group)}---${removeSlash(prefix)}_${TMP_FILE_SUFFIX}`
  const filepath = path.join(os.tmpdir(), filename)

  // 3. open file
  let content
  if (!existsSync(filepath))
    await writeFile(filepath, content = text)
  const editor = await window.showTextDocument(Uri.file(filepath))
  await languages.setTextDocumentLanguage(window.activeTextEditor!.document, language)

  // 4. watch text change
  if (content === text) return
  const document = editor.document
  const maxLine = document.lineCount - 1
  const endChar = document.lineAt(maxLine).range.end.character
  const range = new Range(0, 0, maxLine, endChar)
  if (content === null)
    editor.document.getText(range)
  await editor.edit((eb) => {
    eb.replace(range, text)
  })
  const position = new Position(maxLine, endChar)
  editor.selection = new Selection(position, position)
}

export async function saveSnippet(text: string, group: string = GROUP_DEFAULT) {
  const snippet = transformTextToSnippet(text)
  if (!snippet)
    return error('Can\'t convert to snippet by select nothing')

  if (!snippet.prefix)
    return error('snippet prefix is required')

  if (!snippet.body || snippet.body.length === 0)
    return error('snippet content is required')

  snippet.scope = snippet.scope || SCOPE_GLOBAL
  snippet.description = snippet.description || ''
  group = snippet.group || group

  await updateGroup(group, snippet as Snippet)

  info(`snippet ${snippet.prefix} is saved`)
  provider.refresh()
}
