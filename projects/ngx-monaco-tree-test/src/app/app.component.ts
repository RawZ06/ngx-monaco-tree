import { Component } from '@angular/core';
import { ContextMenuAction, MonacoTreeElement } from 'ngx-monaco-tree';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgxMonacoTreeComponent} from "../../../ngx-monaco-tree/src/lib/ngx-monaco-tree.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, FormsModule, NgxMonacoTreeComponent],
})
export class AppComponent {
  dark = true;
  currentFile = '';
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
            { name: 'app.component.css' },
            { name: 'app.component.spec.ts' },
            { name: 'app.component.ts' },
            { name: 'app.module.ts' },
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

  handleContextMenu(action: ContextMenuAction) {
    if (action[0] === 'new_directory') {
      this.create('directory', action[1], this.tree);
    } else if (action[0] === 'new_file') {
      this.create('file', action[1], this.tree);
    } else if (action[0] === 'delete_file') {
      this.remove(action[1], this.tree);
    } else if (action[0] === 'rename_file') {
      this.rename(action[1], this.tree);
    }
  }

  rename(path: string, localTree: MonacoTreeElement[]) {
    const spited = path.split('/');
    if (spited.length === 1) {
      const file = localTree.find((el) => el.name == path);
      const filename = window.prompt('rename');
      if (filename && file) file.name = filename;
    } else {
      const file = localTree.find((el) => el.name == spited[0]);
      if (!file || !file.content) return;
      this.rename(spited.slice(1).join('/'), file?.content);
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
    path: string,
    localTree: MonacoTreeElement[]
  ) {
    const spited = path.split('/');
    const filename = window.prompt('name');
    if (!filename) return;
    if (spited.length === 1) {
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
      const file = localTree.find((el) => el.name == spited[0]);
      if (!file || !file.content) return;
      this.create(type, spited.slice(1).join('/'), file?.content);
    }
  }
}
