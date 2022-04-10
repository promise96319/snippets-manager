import { window } from 'vscode'
import { displayName } from './json'

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
