import { Component, ElementRef, HostListener, Input, OnInit, inject } from '@angular/core';
import {ContextMenuElementSeparator, ContextMenuElementText} from "./monaco-tree-context-menu.type";


@Component({
    selector: 'monaco-tree-context-menu',
    templateUrl: './monaco-tree-context-menu.component.html',
    styleUrls: ['./monaco-tree-context-menu.component.scss']
})
export class MonacoTreeContextMenuComponent {
	private readonly eRef = inject(ElementRef);

	@Input() top: number | undefined;
	@Input() left: number | undefined

	@Input() theme: 'vs-dark' | 'vs-light' = 'vs-dark';

	@Input() elements: Array<ContextMenuElementSeparator|ContextMenuElementText> = []

	@HostListener('document:click', ['$event'])
	clickOut(event: MouseEvent) {
		if(!this.eRef.nativeElement.contains(event.target)) {
			this.top = -1000;
			this.left = -1000;
		}
	}
}
