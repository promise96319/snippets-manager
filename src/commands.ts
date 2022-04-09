import type { ExtensionContext } from 'vscode'
import { commands, window } from 'vscode'
import { error, getSelectedText } from './utils'

const registerCommand = (ctx: ExtensionContext, cmd: string, callback: () => void) => {
  return ctx.subscriptions.push(commands.registerCommand(cmd, callback))
}

export const registerCommands = (ctx: ExtensionContext) => {
  registerCommand(ctx, 'SnippetsManager.run', () => {
    const text = getSelectedText()
    if (!text) return error('Can\'t convert to snippet by select nothing')
    const language = window.activeTextEditor?.document.languageId
  })
}
