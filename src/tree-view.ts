import { join } from 'path'
import type { TreeDataProvider, TreeView, Event } from 'vscode'
import { EventEmitter, TreeItem, window } from 'vscode'
import { getAllGroups } from './group'
import type { SnippetsMap } from './types'

export class GroupItem extends TreeItem {
  snippets: SnippetsMap

  constructor(
    group: string,
    snippets: SnippetsMap,
    // collapsibleState: TreeItemCollapsibleState,
  ) {
    super(group)
    this.id = group
    this.label = group
    this.description = group
    this.tooltip = group
    this.snippets = snippets
  }

  iconPath = {
    light: join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
    dark: join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg'),
  }
}

export class GroupTreeProvider implements TreeDataProvider<GroupItem> {
  private _onDidChangeTreeData = new EventEmitter<GroupItem | undefined | null | void>()
  readonly onDidChangeTreeData: Event<GroupItem | undefined | null | void> = this._onDidChangeTreeData.event
  tree!: TreeView<any>

  getTreeItem(element: GroupItem): GroupItem {
    return element
  }

  async getChildren(element?: GroupItem): Promise<GroupItem[]> {
    if (element)
      return []

    const groups = await getAllGroups()
    console.log('groups ==> ', groups)
    const groupItems: GroupItem[] = []
    Object.entries(groups).forEach(([group, snippets]) => {
      groupItems.push(new GroupItem(group, snippets))
    })
    return groupItems
  }

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }
}
