import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const commands = [
    // run
    vscode.commands.registerCommand('SnippetsManager.run', () => {
      vscode.window.showInformationMessage('Snippets Manager is running!')
    }),
  ]

  context.subscriptions.push(...commands)
}

export function deactivate() {}
