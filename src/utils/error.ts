import { readFileSync } from 'fs'
import { join } from 'path'
import { window } from 'vscode'

const packageJsonPath = join(__dirname, '..', '..', 'package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
const displayName = packageJson.displayName || 'Snippet Manager'

export const info = (msg: string) => {
  window.showInformationMessage(`${displayName}: ${msg}`)
}

export const error = (msg: string) => {
  window.showErrorMessage(`${displayName}: ${msg}`)
}

export const handleFnWithError = (fn?: any, msg?: string) => {
  try {
    return fn && fn()
  }
  catch (_) {
    msg && error(`${displayName}: ${msg}`)
  }
}
