import type { ExtensionContext } from 'vscode'
import { commands, window } from 'vscode'
import { error, getSelectedText } from './utils'
import { normalizeSnippet, openSippetFile, editSnippet } from './snippets'

const registerCommand = (ctx: ExtensionContext, cmd: string, callback: () => void) => {
  return ctx.subscriptions.push(commands.registerCommand(cmd, callback))
}

export const registerCommands = (ctx: ExtensionContext) => {
  registerCommand(ctx, 'SnippetsManager.run', async() => {
    const text = getSelectedText()
    if (!text) return error('Can\'t convert to snippet by select nothing')
    const snippet = await normalizeSnippet(text)
    if (!snippet) return
    const language = window.activeTextEditor?.document.languageId
    await openSippetFile(language, snippet)
  })
}
