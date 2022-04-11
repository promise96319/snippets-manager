export interface Snippet {
  scope: string;
  prefix: string;
  body: string[];
  description: string;
}

export type SnippetsMap = Record<string, Snippet>

export type GroupsMap= Record<string, SnippetsMap>
