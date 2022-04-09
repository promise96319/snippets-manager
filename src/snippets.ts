import { window } from 'vscode'
import { getSelectedText } from './utils'

export const SCOPE_GLOBAL = '*'
export const GROUP_DEFAULT = 'default'

export interface Snippet {
  scope: string;
  prefix: string;
  body: string[];
  description: string;
}

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

// export async function editSnippet(snippet: Snippet) {

// }

// export async function saveSnippet(snippet: Snippet) {

// }
