import * as os from 'os'
import * as path from 'path'
import { existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import { window, Uri, languages } from 'vscode'
import { getSelectedText, transformSnippetToText } from './utils'
import type { Snippet } from './types'

export const SCOPE_GLOBAL = '*'
export const GROUP_DEFAULT = 'default'

/**
 * add snippet
 * @param text snippet content
 */
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
  const filename = `${removeSlash(group)}-${removeSlash(prefix)}.snippets`
  const filepath = path.join(os.tmpdir(), filename)

  // 3. open file
  if (!existsSync(filepath))
    await writeFile(filepath, text)
  await window.showTextDocument(Uri.file(filepath))
  await languages.setTextDocumentLanguage(window.activeTextEditor!.document, language)
}

export async function editSnippet(snippet: Snippet) {
  // 1. write file and open it

  // 2. edit file and save
}

// export async function saveSnippet(snippet: Snippet) {

// }
