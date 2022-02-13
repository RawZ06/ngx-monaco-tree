import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MonacoTreeElement } from './ngx-monaco-tree.type';
import {ContextMenuAction} from "./monaco-tree-file/monaco-tree-file.type";

@Component({
  selector: 'monaco-tree',
	template: `
    <div [style]="'width:' + width + ';height:' + height" [class]="'monaco-tree ' + theme">
        <monaco-tree-file (contextMenuClick)="handleClickContextMenu($event)" (clickFile)="handleClickFile($event)" [theme]="theme" *ngFor="let row of tree" [name]="row.name" [content]="row.content" [depth]="0" [hide]="false"></monaco-tree-file>
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
	// @Output() contextMenuClick = new EventEmitter<ContextMenuAction>();

	// contextMenu: Array<ContextMenuElementSeparator|ContextMenuElementText> = [
	// 	{type: "element", name: 'New File', action: () => {
	// 		this.contextMenuClick.emit(["new_file", this.curr ?? ''])
	// 	} },
	// 	{type: "element", name: 'New Directory', action: () => {
	// 			this.contextMenuClick.emit(["new_directory", this.curr ?? ''])
	// 		} },
	// 	{type: "separator" },
	// 	{type: "element", name: 'Delete', action: () => {
	// 			this.contextMenuClick.emit(["delete_file", this.curr ?? ''])
	// 	} }
	// ]

	handleClickFile(path: string) {
		this.clickFile.emit(path);
	}

	handleClickContextMenu(event: ContextMenuAction) {
		this.clickContextMenu.emit(event);
	}

}
