import { window } from 'vscode'

export const info = (msg: string) => {
  window.showInformationMessage(msg)
}

export const error = (msg: string) => {
  window.showErrorMessage(msg)
}

export const handleFnWithError = (fn?: any, msg?: string) => {
  try {
    return fn && fn()
  }
  catch (_) {
    msg && error(msg)
  }
}
