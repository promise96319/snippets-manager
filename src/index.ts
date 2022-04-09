import type { ExtensionContext } from 'vscode'
import { registerCommands } from './commands'

export function activate(ctx: ExtensionContext) {
  registerCommands(ctx)
}

export function deactivate() {}
