# NgxMonacoTree

> Warning : This is a proof of concept. Some features will be added in the future.

This is a Tree view based on [monaco-editor](https://github.com/microsoft/monaco-editor) and [vscode](https://github.com/microsoft/vscode) on Angular.

<img width="387" alt="Screenshot 2022-02-06 at 21 57 31" src="https://user-images.githubusercontent.com/44646690/152701329-f53622ee-d28e-4019-ac70-ae551d36560f.png">

## Changelog

### Current
- Add color to files
- Add highlight on selected file or folder
- Add buttons to create file or folder, and collapse all folders

### 15.2.0 (bad version use 17.1.0)
- Migrate to Angular 17
- Migrate from yarn to pnpm
- Passing to standalone components
- CI/CD with Github Actions

### 15.1.1
- Add demo on stackblitz in README

### 15.1.0
- Fix theme in context menu

### 15.0.0
- Upgrade to Angular 15

### 14.0.0
- Upgrade to Angular 14


## Features

- Folder and file management
- Dark or Light theme
- Icon files based on Materiel Icon ([vscode-material-icon-theme](https://github.com/PKief/vscode-material-icon-theme))
- Auto Matching between file ou folder name and icon
- Event on click with path (click to app.module.ts trigger an event with path information (`src/app/app.module.ts`for example)

## Demo

Stackblitz : [ngx-monaco-tree-demo](https://stackblitz.com/fork/ngx-monaco-tree-demo?file=src/app/app.component.ts)

## Installation

Available on Angular 13, 14, 15, 17 or highter

Install it
```bash
npm i --save ngx-monaco-tree @vscode/codicons
```

```bash
yarn add ngx-monaco-tree @vscode/codicons
```

Edit your angular.json to add icons

```json
...
assets: [
	...
	{
		"glob": "**/*",
		"input": "node_modules/ngx-monaco-tree/assets",
		"output": "/assets/"
	}
]
styles: [
	...
	"node_modules/@vscode/codicons/dist/codicon.css"
]
...
```

Import directly in your module or component

```typescript
import {NgxMonacoTreeComponent} from "./ngx-monaco-tree.component";

@NgModule({
  ...
    imports: [
        ...
        NgxMonacoTreeComponent,
    ],
})

export class AppModule {
}
```

In your app.component.ts

```typescript
tree: [
  {
    name: ".vscode",
    content: [{ name: "settings.json" }],
  },
  {
    name: "src",
    content: [
      {
        name: "app",
        content: [
          { name: "app.component.html" },
          { name: 'app.component.css', color: 'gray' },
          { name: 'app.component.spec.ts', color: 'yellow' },
          { name: 'app.component.ts', color: 'green' },
          { name: 'app.module.ts', color: 'red' },
        ],
      },
      {
        name: "assets",
        content: [{ name: ".gitkeep" }],
      },
      {
        name: "environments",
        content: [{ name: "environment.prod.ts" }, { name: "environment.ts" }],
      },
      {
        name: "favicon.ico",
      },
      {
        name: "index.html",
      },
      {
        name: "main.ts",
      },
      {
        name: "polyfill.ts",
      },
      {
        name: "styles.css",
      },
    ],
  },
  {
    name: "angular.json",
  },
  {
    name: "package-lock.json",
  },
  {
    name: "package.json",
  },
  {
    name: "tsconfig.json",
  },
];
```

In your html

```html
<monaco-tree  [tree]="tree"></monaco-tree>
```

## Arguments

List of arguments

| name | type | default | description |
|--|--|--|--|
| tree   | MonacoTreeElement | `[]` | Tree view of your file system |
| theme   | `vs-dark` / `vs-light` | `vs-dark` | Theme light or dark |
| height   | string | `500px` | Height of MonacoTree |
| width   | string | `300px` | Width of MonacoTree |

List of events

| name | arguments | description |
|--|--|--|
| clickFile | path: string | callback to invoke when file or folder is clicked 
| clickContextMenu | action: ContextMenuAction | callback to invoke when element in context menu is clicked

Note :

```typescript
type MonacoTreeElement = {
	name: string;
	content?: MonacoTreeElement[],
  color?: 'red'|'yellow'|'green'|'gray'|string
}

type ContextMenuAction = ['new_file'|'new_directory'|'delete_file'|'rename_file', string];
```

## Future features

- Drag & Drop

## Credits

[monaco-editor](https://github.com/microsoft/monaco-editor)
[vscode](https://github.com/microsoft/vscode)
[vscode-material-icon-theme](https://github.com/PKief/vscode-material-icon-theme)
[monaco-tree](https://github.com/BlueMagnificent/monaco-tree)

## License

MIT
