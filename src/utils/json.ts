
import { readFileSync } from 'fs'
import { resolve } from 'path'

export const readJsonFileSync = (filePath: string): Record<string, any> => {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  }
  catch (e: any) {
    throw new Error(`readJsonFileSync: ${e.message}`)
  }
}

export const readPkgJson = (): Record<string, any> => {
  return readJsonFileSync(resolve(__filename, '../../../package.json'))
}

export const getPkgDisplayName = (): string => {
  const packageJson = readPkgJson()
  return (packageJson && packageJson.displayName) || 'Snippet Manager'
}

export const displayName = getPkgDisplayName()
