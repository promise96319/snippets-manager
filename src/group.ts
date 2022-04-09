
import { type } from 'os'
import { readFile, writeFile, readdir, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import type { Snippet } from './types'

function getSnippetsPath() {
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

export const VSCODE_SNIPPETS_PATH = getSnippetsPath()
export const SNIPPETS_PREFIX = 'ghghgh_'

type SnippetsMap = Record<string, Snippet>
type GroupsMap= Record<string, SnippetsMap>

export function isGroupName(filename: string) {
  return filename.startsWith(SNIPPETS_PREFIX) && filename.endsWith('.code-snippets')
}

export function parseGroupName(filename: string) {
  return filename.replace(/\.code-snippets$/, '').replace(SNIPPETS_PREFIX, '')
}

export async function getGroupPath(group: string) {
  const fileName = `${SNIPPETS_PREFIX}${group}.code-snippets`
  const groupPath = join(VSCODE_SNIPPETS_PATH, fileName)
  if (!existsSync(groupPath))
    await writeFile(groupPath, '{}')

  return groupPath
}

export async function writeGroup(group: string, snippetsMap: SnippetsMap) {
  const groupPath = await getGroupPath(group)
  return await writeFile(groupPath, JSON.stringify(snippetsMap, null, 2))
}

export async function readGroup(group: string): Promise<SnippetsMap> {
  const path = await getGroupPath(group)
  const text = await readFile(path, 'utf8')
  // eslint-disable-next-line no-new-func
  return new Function(`return ${text}`)() as SnippetsMap
}

export async function updateGroup(group: string, snippet: Snippet) {
  const snippetsMap: SnippetsMap = await readGroup(group)
  snippetsMap[snippet.prefix] = snippet
  return await writeGroup(group, snippetsMap)
}

export async function removeGroup(group: string) {
  const groupPath = await getGroupPath(group)
  if (existsSync(groupPath))
    return await unlink(groupPath)
}

export async function removeAllGroups() {
  if (existsSync(VSCODE_SNIPPETS_PATH)) {
    const files = await readdir(VSCODE_SNIPPETS_PATH)
    files.forEach(async(file) => {
      if (isGroupName(file))
        await removeGroup(parseGroupName(file))
    })
  }
}

export async function getAllGroups(): Promise<GroupsMap> {
  if (!existsSync(VSCODE_SNIPPETS_PATH))
    await mkdir(VSCODE_SNIPPETS_PATH)

  let files = await readdir(VSCODE_SNIPPETS_PATH)
  files = files.filter(isGroupName)
  const groups: GroupsMap = {}
  for (const file of files) {
    const group = parseGroupName(file)
    const snippetsMap: SnippetsMap = await readGroup(group)
    groups[group] = snippetsMap
  }

  return groups
}
