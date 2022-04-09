import { window } from 'vscode'

// Get the selected text in active editor
export const getSelectedText = (): string => {
  const editor = window.activeTextEditor
  if (!editor) return ''
  return editor.document.getText(editor.selection)
}
