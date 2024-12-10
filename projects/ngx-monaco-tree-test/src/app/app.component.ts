import { Component } from '@angular/core';
import { ContextMenuAction, MonacoTreeElement } from 'ngx-monaco-tree';
import { FormsModule } from "@angular/forms";

import { NgxMonacoTreeComponent } from "../../../ngx-monaco-tree/src/lib/ngx-monaco-tree.component";
import { DragAndDropEvent } from "../../../ngx-monaco-tree/src/lib/monaco-tree-file/monaco-tree-file.type";

const TOO_MANY_FILES_IN_FOLDER = 200;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [FormsModule, NgxMonacoTreeComponent]
})
export class AppComponent {
  dark = true;
  currentFile = 'src/app/app.component.html';
  tree = [
    {
      name: '.vscode',
      content: [{ name: 'settings.json' }],
    },
    {
      name: 'src',
      content: [
        {
          name: 'app',
          content: [
            { name: 'app.component.html' },
            { name: 'app.component.css', color: 'gray' },
            { name: 'app.component.spec.ts', color: 'yellow' },
            { name: 'app.component.ts', color: 'green' },
            { name: 'app.module.ts', color: 'red' },
          ],
        },
        {
          name: 'assets',
          content: [{ name: '.gitkeep' }],
        },
        {
          name: 'environments',
          content: [
            { name: 'environment.prod.ts' },
            { name: 'environment.ts' },
          ],
        },
        {
          name: 'folder-with-too-many-files',
          content: Array.from({ length: TOO_MANY_FILES_IN_FOLDER }).map((_, index) => ({ name: `file_${index + 1}.ts` }))
        },
        {
          name: 'favicon.ico',
        },
        {
          name: 'index.html',
        },
        {
          name: 'main.ts',
        },
        {
          name: 'polyfill.ts',
        },
        {
          name: 'styles.css',
        },
      ],
    },
    {
      name: 'angular.json',
    },
    {
      name: 'package-lock.json',
    },
    {
      name: 'package.json',
    },
    {
      name: 'tsconfig.json',
    },
  ];

  changeCurrentFile() {
    this.currentFile = this.currentFile === `src/folder-with-too-many-files/file_${TOO_MANY_FILES_IN_FOLDER}.ts`
      ? 'src/app/app.component.html'
      : `src/folder-with-too-many-files/file_${TOO_MANY_FILES_IN_FOLDER}.ts`;
  }

  handleContextMenu(action: ContextMenuAction) {
    if (action[0] === 'new_directory') {
      const filename = window.prompt('name');
      this.create('directory', filename ?? 'New Directory', action[1], this.tree);
    } else if (action[0] === 'new_file') {
      const filename = window.prompt('name');
      this.create('file', filename ?? 'New File', action[1], this.tree);
    } else if (action[0] === 'delete_file') {
      this.remove(action[1], this.tree);
    } else if (action[0] === 'rename_file') {
      const filename = window.prompt('rename');
      this.rename(action[1], filename ?? 'Renamed File', this.tree);
    }
  }

  handleDragDrop(event: DragAndDropEvent) {
    const file = this.find(event.sourceFile, this.tree);
    if (!file) return;
    let destination = this.find(event.destinationFile, this.tree);
    if (destination?.content === undefined) destination = this.find(event.destinationFile.split('/').slice(0, -1).join('/'), this.tree);
    if (destination?.content) {
      this.remove(event.sourceFile, this.tree);
      destination.content.push(file as MonacoTreeElement);
    } else {
      this.remove(event.sourceFile, this.tree);
      this.tree.push(file as MonacoTreeElement);
    }
  }

  rename(path: string, filename: string, localTree: MonacoTreeElement[]) {
    const spited = path.split('/');
    if (spited.length === 1) {
      const file = localTree.find((el) => el.name == path);
      if (filename && file) file.name = filename;
    } else {
      const file = localTree.find((el) => el.name == spited[0]);
      if (!file || !file.content) return;
      this.rename(spited.slice(1).join('/'), filename, file?.content);
    }
  }

  remove(path: string, localTree: MonacoTreeElement[]) {
    const spited = path.split('/');
    if (spited.length === 1) {
      const index = localTree.findIndex((el) => el.name == path);
      localTree.splice(index, 1);
    } else {
      const file = localTree.find((el) => el.name == spited[0]);
      if (!file || !file.content) return;
      this.remove(spited.slice(1).join('/'), file?.content);
    }
  }

  create(
    type: 'directory' | 'file',
    filename: string,
    path: string,
    localTree: MonacoTreeElement[]
  ) {
    const splitted = path.split('/');
    if (!filename) return;
    if (splitted.length === 1) {
      const file = localTree.find((el) => el.name == path);
      if (!file) return;
      else if (file.content === undefined) {
        localTree.push({
          name: filename,
          content: type === 'directory' ? [] : undefined,
        });
      } else {
        file.content.push({
          name: filename,
          content: type === 'directory' ? [] : undefined,
        });
      }
    } else {
      const file = localTree.find((el) => el.name == splitted[0]);
      if (!file || !file.content) return;
      this.create(type, filename, splitted.slice(1).join('/'), file?.content);
    }
  }

  find(path: string, localTree: MonacoTreeElement[]): MonacoTreeElement | undefined {
    const spited = path.split('/');
    if (spited.length === 1) {
      return localTree.find((el) => el.name == path);
    } else {
      const file = localTree.find((el) => el.name == spited[0]);
      if (!file || !file.content) return;
      return this.find(spited.slice(1).join('/'), file?.content);
    }
  }
}
