import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MonacoTreeElement } from './ngx-monaco-tree.type';
import {ContextMenuAction} from "./monaco-tree-file/monaco-tree-file.type";
import {MonacoTreeFileComponent} from "./monaco-tree-file/monaco-tree-file.component";
import {NgForOf} from "@angular/common";
import {MonacoTreeIconsComponent} from "./monaco-tree-icons/monaco-tree-icons.component";

@Component({
  selector: 'monaco-tree',
  standalone: true,
  imports: [MonacoTreeFileComponent, MonacoTreeIconsComponent, NgForOf],
	template: `
    <div [style]="'width:' + width + ';height:' + height" [class]="'monaco-tree ' + theme">
        <monaco-tree-icons [theme]="theme" (onNewDirectory)="handleNewDirectory()" (onNewFile)="handleNewFile()" (onCollapseAll)="handleCollapseAll()"></monaco-tree-icons>
        <monaco-tree-file (contextMenuClick)="handleClickContextMenu($event)" (clickFile)="handleClickFile($event)" [theme]="theme" *ngFor="let row of tree" [name]="row.name" [path]="row.name" [content]="row.content" [color]="row.color" [depth]="0" [hide]="false" [current]="currentFile"></monaco-tree-file>
    </div>
	`,
	styleUrls: ['./ngx-monaco-tree.component.scss']
})
export class NgxMonacoTreeComponent {

  @Input() theme: 'vs-dark' | 'vs-light' = 'vs-dark';
	@Input() tree: MonacoTreeElement[] = []

	@Input() width = "300px"
	@Input() height = "500px"

	@Output() clickFile = new EventEmitter<string>();
	@Output() clickContextMenu = new EventEmitter<ContextMenuAction>();

  currentFile: string|null = null;

	handleClickFile(path: string) {
		this.clickFile.emit(path);
    this.currentFile = path;
	}

	handleClickContextMenu(event: ContextMenuAction) {
		this.clickContextMenu.emit(event);
	}

  handleNewFile() {
    if(this.currentFile !== null) {
      this.clickContextMenu.emit(["new_file", this.currentFile])
    }
  }

  handleNewDirectory() {
    if(this.currentFile !== null) {
      this.clickContextMenu.emit(["new_directory", this.currentFile])
    }
  }

  handleCollapseAll() {
    const tree = JSON.parse(JSON.stringify(this.tree));
    this.tree = tree;
  }
}
