import * as os from 'os'
import * as path from 'path'
import { existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import { window, Uri, languages, Range, Position, Selection } from 'vscode'
import { error, getSelectedText, info, transformSnippetToText, transformTextToSnippet } from './utils'
import { updateGroup, GROUP_DEFAULT, removeSnippet } from './group'
import { provider } from './provider'
import type { Snippet } from './types'

export const SCOPE_GLOBAL = ''
export const TMP_FILE_SUFFIX = 'SnippetManager_tmp.snippets'

export function normalizeSnippetScope(scope?: string) {
  if (!scope || scope === '*' || scope === 'all') return SCOPE_GLOBAL
  // remove comma space
  return scope.split(',').map(s => s.trim()).join(',')
}

export function normalizeSnippetGroup(group?: string) {
  if (!group || group === '*' || group === 'all') return GROUP_DEFAULT
  return group
}

export async function normalizeSnippet(text: string): Promise<Snippet | undefined> {
  if (!text) {
    text = getSelectedText() || ''
    text = text.replace(/\$/g, '\\$')
  }

  let key = await window.showInputBox({ placeHolder: 'snippet key' })
  key = key && key.trim()
  if (!key) return

  const language = window.activeTextEditor?.document.languageId

  return {
    scope: language || SCOPE_GLOBAL,
    prefix: key,
    body: [text],
    description: '',
  }
}

// current editing origin snippet
let currentEditingGroup: string | undefined
export async function openSippetFile(group: string = GROUP_DEFAULT, snippet: Snippet): Promise<void> {
  currentEditingGroup = group
  // 1. snippet to text
  const text = transformSnippetToText(group, snippet)
  // 2. create file
  const { prefix } = snippet
  const removeSlash = (str: string) => str.replace(/\//g, '_')
  const filename = `${removeSlash(group)}=${removeSlash(prefix)}_${TMP_FILE_SUFFIX}`
  const filepath = path.join(os.tmpdir(), filename)

  // 3. open file
  let content
  if (!existsSync(filepath))
    await writeFile(filepath, content = text)
  const editor = await window.showTextDocument(Uri.file(filepath))
  let language = window.activeTextEditor?.document.languageId || 'text'
  const scope = normalizeSnippetScope(snippet.scope)
  if (scope) {
    const languages = scope.split(',')
    language = (languages[0] && languages[0].trim()) || language
  }
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

  snippet.scope = normalizeSnippetScope(snippet.scope)
  snippet.description = snippet.description || ''
  group = normalizeSnippetGroup(snippet.group)
  delete snippet.group

  if (currentEditingGroup && currentEditingGroup !== group)
    await removeSnippet(currentEditingGroup, snippet.prefix)

  await updateGroup(group, snippet as Snippet)

  info(`snippet "${snippet.prefix}" is saved`)
  provider.refresh()
}
