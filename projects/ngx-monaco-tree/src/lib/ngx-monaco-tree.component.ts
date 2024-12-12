import { Component, EventEmitter, Input, OnInit, Output, viewChildren } from '@angular/core';
import { MonacoTreeElement } from './ngx-monaco-tree.type';
import {ContextMenuAction, DragAndDropEvent} from "./monaco-tree-file/monaco-tree-file.type";
import {MonacoTreeFileComponent} from "./monaco-tree-file/monaco-tree-file.component";
import {NgForOf} from "@angular/common";
import {MonacoTreeIconsComponent} from "./monaco-tree-icons/monaco-tree-icons.component";
import {CdkDropList, DragDropModule} from '@angular/cdk/drag-drop';
import { sortTreeElement } from '../utils/tree.helpers';

@Component({
  selector: 'monaco-tree',
  standalone: true,
  imports: [MonacoTreeFileComponent, MonacoTreeIconsComponent, DragDropModule, NgForOf, CdkDropList],
	template: `
    <div [style]="'width:' + width + ';height:' + height" [class]="'monaco-tree ' + theme">
        <monaco-tree-icons [theme]="theme" (newDirectory)="handleNewDirectory()" (newFile)="handleNewFile()" (collapseAll)="handleCollapseAll()"></monaco-tree-icons>
        <monaco-tree-file (dragDropFile)="dragDropFile.emit($event)" class="monaco-tree-file-container" cdkDropList [cdkDropListData]="tree" (contextMenuClick)="handleClickContextMenu($event)" (clickFile)="handleClickFile($event)" [theme]="theme" *ngFor="let row of sortedTree" [name]="row.name" [path]="row.name" [content]="row.content" [color]="row.color" [depth]="0" [hide]="false" [current]="currentFile"></monaco-tree-file>
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
  @Output() dragDropFile = new EventEmitter<DragAndDropEvent>();

  @Input() currentFile: string|null = null;

  private children = viewChildren(MonacoTreeFileComponent);

  // TODO use computed once we use input-signal instead of input-decorator
  get sortedTree() {
    return this.tree?.slice().sort(sortTreeElement)
  }

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
    this.children().forEach((child) => child.collapseAll());
  }
}
