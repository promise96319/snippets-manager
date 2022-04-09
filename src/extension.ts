import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "snippets-manager" is now active!')

  const disposable = vscode.commands.registerCommand('snippets-manager.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from Snippets Manager!')
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
