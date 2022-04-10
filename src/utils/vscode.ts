import { type } from 'os'
import { join } from 'path'
import { window } from 'vscode'

// Get the selected text in active editor
export function getSelectedText(): string {
  const editor = window.activeTextEditor
  if (!editor) return ''
  return editor.document.getText(editor.selection)
}

export function getSnippetsPath() {
  let vsCodeUserSettingsPath
  const isInsiders = /insiders/i.test(process.argv0)
  const isCodium = /codium/i.test(process.argv0)
  const isOSS = /vscode-oss/i.test(__dirname)
  const CodeDir = isInsiders ? 'Code - Insiders' : isCodium ? 'VSCodium' : isOSS ? 'Code - OSS' : 'Code'
  const isPortable = !!process.env.VSCODE_PORTABLE
  if (isPortable) {
    vsCodeUserSettingsPath = `${process.env.VSCODE_PORTABLE}/user-data/User/`
  }
  else {
    switch (type()) {
      case 'Darwin':
        vsCodeUserSettingsPath = `${process.env.HOME}/Library/Application Support/${CodeDir}/User/`
        break
      case 'Linux':
        vsCodeUserSettingsPath = `${process.env.HOME}/.config/${CodeDir}/User/`
        break
      case 'Windows_NT':
        vsCodeUserSettingsPath = `${process.env.APPDATA}\\${CodeDir}\\User\\`
        break
      default:
        vsCodeUserSettingsPath = `${process.env.HOME}/.config/${CodeDir}/User/`
        break
    }
  }
  return join(vsCodeUserSettingsPath, 'snippets')
}
