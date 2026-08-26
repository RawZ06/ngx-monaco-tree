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

- **Angular 22.1.3** (recently upgraded from v21)
- **TypeScript 6.0.3** (required for Angular 22)
- Uses **Angular CDK 22.1.1** for drag-drop functionality
- Standalone component API (no NgModule required)
- CSS uses SCSS
- VSCode codicons (v0.0.45) for all icons
- Comprehensive test suite with 34+ unit and integration tests

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

## Release Process

### Important Constraints
- **Pushing**: Only humans can push commits to the repository. The AI will never push.
- **Commits**: The AI can freely create commits.
- **Tags**: The CI/CD pipeline (GitHub Actions) automatically creates tags based on version bumps on `master` branch.
- **Changelog Workflow**: Follow semantic versioning - only published versions get numbered sections.

### CHANGELOG.md Structure
The CHANGELOG follows this pattern:

```markdown
### Current
- Feature added in development
- Bug fix in development

### 20.1.0
- Previously published version
```

**Key Rules:**
- **"Current" section**: Contains ALL unpublished changes (new features, fixes, breaking changes)
- **Numbered versions**: Only exist for packages published to npm (e.g., 20.1.0, 21.0.0)
- **AI Responsibility**: Add changes to "Current" section - DO NOT pre-assign version numbers
- **CI/CD Responsibility**: When merging to `master`, CI assigns version number from `package.json` and creates git tag

### Steps for Development Work
1. Make code changes and create commits (AI can do this)
2. Update `CHANGELOG.md` **"Current"** section with a description of changes
3. DO NOT add version numbers or dates to changes yet
4. Update `projects/ngx-monaco-tree/package.json` version only if intentional (major/minor/patch bump)
5. Create commit with all changes

### Steps When Publishing (Human Responsibility)
1. **Push to remote**: `git push origin develop`
2. **Create PR**: From `develop` → `master`
3. **Merge PR**: To `master`
4. **CI/CD pipeline automatically**:
   - Reads version from `package.json`
   - Creates git tag `vX.Y.Z`
   - Moves "Current" section into numbered version section with date
   - Resets "Current" to empty
   - Publishes to npm
