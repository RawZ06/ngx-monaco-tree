import { MonacoTreeElement } from "../lib/ngx-monaco-tree.type";

/**
 * Alphabetical sort method + folders before files
 */
export const sortTreeElement = (a: MonacoTreeElement, b: MonacoTreeElement) => {
  if (!!a.content !== !!b.content) {
    return a.content ? -1 : 1;
  }
  return a.name < b.name ? -1 : 1;
}
