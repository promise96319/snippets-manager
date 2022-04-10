import type { ExtensionContext } from 'vscode'
import { commands, window, workspace } from 'vscode'
import { error, getSelectedText } from './utils'
import { normalizeSnippet, openSippetFile, saveSnippet, TMP_FILE_SUFFIX } from './snippets'
import { provider } from './tree-view'

export const createRegisterCommand = (ctx: ExtensionContext) => (cmd: string, callback: () => void) => {
  return ctx.subscriptions.push(commands.registerCommand(cmd, callback))
}

export const registerCommands = (ctx: ExtensionContext) => {
  const registerCommand = createRegisterCommand(ctx)

  registerCommand('SnippetsManager.run', async() => {
    const text = getSelectedText()
    if (!text) return error('Can\'t convert to snippet by select nothing')
    const snippet = await normalizeSnippet(text)
    if (!snippet) return
    const language = window.activeTextEditor?.document.languageId
    await openSippetFile(language, snippet)
  })

  registerCommand('SnippetsManager.open', async() => {
    provider.tree.reveal(await provider.getChildren())
  })

  registerCommand('SnippetsManager.refresh', async() => {
    provider.refresh()
  })

  workspace.onDidSaveTextDocument((e) => {
    if (!e.fileName.endsWith(TMP_FILE_SUFFIX)) return
    saveSnippet(e.getText())
  })
}
