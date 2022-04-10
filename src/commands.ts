import type { ExtensionContext } from 'vscode'
import { commands, window, workspace } from 'vscode'
import { error, getSelectedText } from './utils'
import { normalizeSnippet, openSippetFile, saveSnippet, TMP_FILE_SUFFIX } from './snippets'
import type { GroupItem } from './provider'
import { provider } from './provider'
import { isGroupNameExisted, addGroup, renameGroup, removeGroup } from './group'

export const createRegisterCommand = (ctx: ExtensionContext) => (cmd: string, callback: any) => {
  const commandPrefix = 'SnippetsManager'
  return ctx.subscriptions.push(commands.registerCommand(`${commandPrefix}.${cmd}`, callback))
}

// Group
export const registerGroupCommands = (registerCommand: (cmd: string, callback: any) => any) => {
  registerCommand('addGroup', async() => {
    const group = await window.showInputBox({ placeHolder: 'snippets group name' })
    if (!group) return
    if (isGroupNameExisted(group)) return error(`Snippets group named "${group}"  already exists`)
    await addGroup(group)
    provider.refresh()
  })

  registerCommand('renameGroup', async({ group }: GroupItem) => {
    let newGroup = await window.showInputBox({ placeHolder: group }) || group
    newGroup = newGroup.trim()
    if (newGroup === group)
      return
    if (isGroupNameExisted(newGroup))
      return error(`Snippets group named "${newGroup}" already exists`)

    await renameGroup(group, newGroup)
    provider.refresh()
  })

  registerCommand('deleteGroup', async({ group }: GroupItem) => {
    const pickResult = await window.showQuickPick(['No', 'Yes'], {
      placeHolder: `Are you sure? delete snippet group ${group}`,
    })
    if (pickResult !== 'Yes') return
    await removeGroup(group)
    provider.refresh()
  })
}

export const registerCommands = (ctx: ExtensionContext) => {
  const registerCommand = createRegisterCommand(ctx)
  registerGroupCommands(registerCommand)

  registerCommand('run', async() => {
    const text = getSelectedText()
    if (!text) return error('Can\'t convert to snippet by select nothing')
    const snippet = await normalizeSnippet(text)
    if (!snippet) return
    const language = window.activeTextEditor?.document.languageId
    await openSippetFile(language, snippet)
  })

  registerCommand('open', async() => {
    provider.tree.reveal(await provider.getChildren())
  })

  registerCommand('refresh', async() => {
    provider.refresh()
  })

  workspace.onDidSaveTextDocument((e) => {
    if (!e.fileName.endsWith(TMP_FILE_SUFFIX)) return
    saveSnippet(e.getText())
  })
}
