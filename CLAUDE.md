# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ngx-monaco-tree** is an Angular library that provides a reusable tree view component styled after VS Code's file explorer. The component is built on top of [monaco-editor](https://github.com/microsoft/monaco-editor), [vscode](https://github.com/microsoft/vscode) styling, and uses Material Design icons from [vscode-material-icon-theme](https://github.com/PKief/vscode-material-icon-theme).

The repository is structured as a monorepo containing:
- **Library** (`projects/ngx-monaco-tree`): The publishable npm package
- **Test App** (`projects/ngx-monaco-tree-test`): A demo/testing application that uses the library

## Architecture

### Component Hierarchy

The tree component uses a hierarchical structure:

1. **NgxMonacoTreeComponent** (`projects/ngx-monaco-tree/src/lib/ngx-monaco-tree.component.ts`)
   - Main entry point, renders tree at the top level
   - Handles toolbar actions (new file, new directory, collapse all)
   - Manages `currentFile` as a two-way model
   - Emits context menu and drag-drop events

2. **MonacoTreeFileComponent** (`projects/ngx-monaco-tree/src/lib/monaco-tree-file/`)
   - Recursive component for rendering individual files/folders
   - Handles expand/collapse state, context menus, and drag-drop
   - Uses Angular CDK's `CdkDropList` for drag-drop functionality

3. **MonacoTreeIconsComponent** (`projects/ngx-monaco-tree/src/lib/monaco-tree-icons/`)
   - Toolbar with icon buttons for actions

4. **MonacoTreeContextMenuComponent** (`projects/ngx-monaco-tree/src/lib/monaco-tree-context-menu/`)
   - Context menu (right-click actions): create file/folder, rename, delete

### Icon System

Icon resolution is handled by utility functions that match file extensions and folder names to Material icons:
- `extension-icon.ts`: Maps file extensions to icon names
- `folder-icon.ts`: Maps folder names to special folder icons
- `file-icon.ts`: Determines icon for a file

Icons are served from VSCode's codicon set (`@vscode/codicons`).

### State Management

- Uses Angular's new signal-based API for reactivity
- Component inputs are defined with `input()` and `input.required()`
- Events are emitted via `output()` 
- Two-way binding on `currentFile` via `model()`

## Commands

### Development

- `npm start` / `pnpm start` – Start dev server for test app (http://localhost:4200)
- `pnpm watch:app` – Watch library changes and rebuild incrementally
- `pnpm watch:test` – Watch test app in development mode
- `pnpm watch` – Watch both library and test app

### Building

- `pnpm run build:app` – Build library for production (`dist/ngx-monaco-tree`)
- `pnpm run build:test` – Build test app for production (`dist/ngx-monaco-tree-test`)
- `pnpm build` – Build entire project

### Testing

- `pnpm test` – Run Jasmine tests with Karma (runs all `.spec.ts` files)
- Tests are configured in `projects/ngx-monaco-tree/karma.conf.js`

## Important Files & Structure

```
projects/ngx-monaco-tree/
├── src/
│   ├── lib/
│   │   ├── ngx-monaco-tree.component.ts      # Main component
│   │   ├── ngx-monaco-tree.type.ts           # Types: MonacoTreeElement
│   │   ├── monaco-tree-file/                 # Recursive file/folder item
│   │   ├── monaco-tree-icons/                # Toolbar buttons
│   │   └── monaco-tree-context-menu/         # Right-click menu
│   ├── utils/
│   │   ├── extension-icon.ts                 # File extension → icon mapping
│   │   ├── folder-icon.ts                    # Folder name → icon mapping
│   │   └── file-icon.ts                      # Unified icon resolution
│   ├── public-api.ts                         # Library exports
│   └── test.ts                               # Karma test setup
├── ng-package.json                           # ng-packagr config
├── karma.conf.js                             # Test runner config
└── tsconfig.*.json                           # TypeScript configurations
```

## Key Types

### MonacoTreeElement
```typescript
type MonacoTreeElement = {
  name: string;
  color?: 'red' | 'yellow' | 'green' | 'gray' | string;
  content?: MonacoTreeElement[]  // folder content (undefined for files)
}
```

### Events
- `clickContextMenu(action: ContextMenuAction)` – Context menu actions (create/rename/delete)
- `dragDropFile(event: DragAndDropEvent)` – File/folder drag-drop operations

### Component Inputs/Outputs
```typescript
// Inputs (via Angular signals API)
tree: MonacoTreeElement[] (required)
theme: 'vs-dark' | 'vs-light' (default: 'vs-dark')
width: string (default: '300px')
height: string (default: '500px')

// Two-way binding
currentFile: string | null

// Outputs
clickContextMenu: ContextMenuAction
dragDropFile: DragAndDropEvent
```

## Publishing & CI/CD

The library is published to npm via GitHub Actions (`.github/workflows/main.yml`):
- Triggered on push to any branch or PR
- Uses pnpm for dependency management
- On `master` branch: increments version, tags release, publishes to npm
- Requires `NPM_TOKEN` secret in GitHub

The library is built using **ng-packagr**, which compiles TypeScript and outputs to `dist/ngx-monaco-tree`.

## Angular Version & Dependencies

- **Angular 21.1.0** (recently upgraded from v20)
- Uses **Angular CDK** for drag-drop functionality
- Standalone component API (no NgModule required)
- CSS uses SCSS
- VSCode codicons for all icons

## Testing the Component

1. Run `pnpm start` to start the dev server
2. Navigate to http://localhost:4200 to see the test app
3. The test app demonstrates:
   - Rendering the tree
   - Handling context menu actions (create, delete, rename)
   - Handling drag-drop operations
   - Switching between light/dark themes
   - Managing the current file selection

## Notable Implementation Details

- **Recursive rendering**: MonacoTreeFileComponent renders itself for nested content
- **Drag-drop**: Uses Angular CDK's `CdkDropList` for drop zone detection
- **Path tracking**: Files emit their full path (e.g., `src/app/app.component.ts`) when clicked
- **In-memory tree**: The tree is entirely in-memory; mutations happen via event handlers
