import { Component, ElementRef, HostListener, Input, OnInit, inject, input } from '@angular/core';
import {ContextMenuElementSeparator, ContextMenuElementText} from "./monaco-tree-context-menu.type";


@Component({
    selector: 'monaco-tree-context-menu',
    templateUrl: './monaco-tree-context-menu.component.html',
    styleUrls: ['./monaco-tree-context-menu.component.scss']
})
export class MonacoTreeContextMenuComponent {
	private readonly eRef = inject(ElementRef);

	// TODO: Skipped for migration because:
	// Your application code writes to the input. This prevents migration.
	@Input() top: number | undefined;
	// TODO: Skipped for migration because:
	// Your application code writes to the input. This prevents migration.
	@Input() left: number | undefined

	readonly theme = input<'vs-dark' | 'vs-light'>('vs-dark');

	readonly elements = input<Array<ContextMenuElementSeparator | ContextMenuElementText>>([]);

	@HostListener('document:click', ['$event'])
	clickOut(event: MouseEvent) {
		if(!this.eRef.nativeElement.contains(event.target)) {
			this.top = -1000;
			this.left = -1000;
		}
	}
}
