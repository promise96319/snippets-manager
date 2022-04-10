import type { TreeDataProvider, TreeView, Event } from 'vscode'
import { EventEmitter, TreeItem, TreeItemCollapsibleState, window } from 'vscode'
import { refreshGroups } from './group'
import type { Snippet, SnippetsMap } from './types'

export class GroupItem extends TreeItem {
  group: string
  snippets: SnippetsMap

  constructor(
    group: string,
    snippets: SnippetsMap,
    collapsibleState: TreeItemCollapsibleState,
  ) {
    super(group)
    this.id = group
    this.label = group
    this.description = ''
    this.tooltip = ''
    this.collapsibleState = collapsibleState

    this.group = group
    this.snippets = snippets
    this.contextValue = 'group'
  }

  // iconPath = join(__filename, '..', 'check-circle-filled.svg')
  iconPath = '$(list-tree)'
}

export class SnippetItem extends TreeItem {
  group: string
  snippet: Snippet

  constructor(
    group: string,
    snippet: Snippet,
  ) {
    super(snippet.prefix)
    this.id = `${group}_${snippet.prefix}_${snippet.scope}`
    this.label = snippet.prefix
    this.description = snippet.description
    this.tooltip = snippet.description

    this.group = group
    this.snippet = snippet
  }

  iconPath = '$(terminal-view-icon)'
}

export class GroupTreeProvider implements TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData = new EventEmitter<GroupItem | undefined | null | void>()
  readonly onDidChangeTreeData: Event<GroupItem | undefined | null | void> = this._onDidChangeTreeData.event
  tree!: TreeView<any>

  getTreeItem(element: TreeItem): TreeItem {
    return element
  }

  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    // If element is provided, is should be a group, show its snippets
    if (element && element instanceof GroupItem) {
      return Object.values(element.snippets).map((snippet) => {
        return new SnippetItem(element.group, snippet)
      })
    }
    // If no element is provided, return the group list
    else {
      const groups = await refreshGroups()
      const groupItems: GroupItem[] = []
      Object.entries(groups).forEach(([group, snippets]) => {
        groupItems.push(new GroupItem(group, snippets, TreeItemCollapsibleState.Collapsed))
      })
      return groupItems
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }
}

export const provider = new GroupTreeProvider()
provider.tree = window.createTreeView('SnippetsManager', {
  treeDataProvider: provider,
})
