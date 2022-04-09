import { window } from 'vscode'

// Get the selected text in active editor
export const getSelectedText = (): string => {
  const editor = window.activeTextEditor
  if (!editor) return ''
  return editor.document.getText(editor.selection)
}

// export const transformTextToSnippets = (text: string): string[] => {
//   const comment = utils.getLineComment(languageId)
//   const snippet = {}
//   let lines = text.split('\n')
//   let body = ''
//   for (let i = 0; i < lines.length; i++) {
//     if (lines[i] == '/* eslint-disable */') {
//       body = lines.slice(i + 1)
//       while (body[0] == '') body.shift()
//       lines = lines.slice(0, i)
//       break
//     }
//     if (!lines[i].startsWith(comment)) {
//       body = lines.slice(i)
//       while (body[0] == '') body.shift()
//       lines = lines.slice(0, i)
//       break
//     }
//   }
//   let prev
//   let key
//   for (let line of lines) {
//     line = line.slice(comment.length)
//     const m = /\s*@\w+\s*/.exec(line)
//     if (m) {
//       prev = m[0]
//       key = prev.trim().slice(1)
//       snippet[key] = (snippet[key] || '') + line.slice(prev.length)
//     }
//     else if (prev) {
//       snippet[key] += `\n${line.replace(/^\s+/, '')}`
//     }
//   }
//   snippet.body = body
//   return snippet
// }
