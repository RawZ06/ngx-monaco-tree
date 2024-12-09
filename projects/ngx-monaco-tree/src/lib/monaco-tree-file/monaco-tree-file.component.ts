import {Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, viewChildren} from '@angular/core';
import { extensions } from '../../utils/extension-icon';
import { files } from '../../utils/file-icon';
import { folders } from '../../utils/folder-icon';
import { MonacoTreeElement } from '../ngx-monaco-tree.type';
import {
	ContextMenuElementSeparator,
	ContextMenuElementText
} from "../monaco-tree-context-menu/monaco-tree-context-menu.type";
import {ContextMenuAction, DragAndDropEvent} from "./monaco-tree-file.type";
import {MonacoTreeContextMenuComponent} from "../monaco-tree-context-menu/monaco-tree-context-menu.component";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {DragDropModule, CdkDragDrop, CdkDrag, CdkDropList} from '@angular/cdk/drag-drop';

function getAbsolutePosition(element: any) {
	const r = { x: element.offsetLeft, y: element.offsetTop };
	if (element.offsetParent) {
		const tmp = getAbsolutePosition(element.offsetParent);
		r.x += tmp.x;
		r.y += tmp.y;
	}
	return r;
};

@Component({
  selector: 'monaco-tree-file',
  standalone: true,
  imports: [NgIf, NgForOf, MonacoTreeContextMenuComponent, DragDropModule, NgStyle, CdkDrag, CdkDrag, CdkDropList],
  templateUrl: './monaco-tree-file.component.html',
  styleUrls: ['./monaco-tree-file.component.scss']
})
export class MonacoTreeFileComponent implements OnChanges {
	@Input() name = '';
  @Input() path = '';
  @Input() color?: string|null|undefined = '';
	@Input() content: MonacoTreeElement[]|undefined|null = undefined;
	@Input() depth = 0;
	@Input() theme: 'vs-dark'|'vs-light' = 'vs-dark';
	@Input() hide = false;
  @Input() current: string|null = null;

	@Output() clickFile = new EventEmitter<string>();
	@Output() contextMenuClick = new EventEmitter<ContextMenuAction>();
  @Output() dragDropFile = new EventEmitter<DragAndDropEvent>();

  private children = viewChildren(MonacoTreeFileComponent);

	open = false;
	position: [number, number]|undefined = undefined;


	constructor(private eRef: ElementRef) {
	}

	ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['current']
      && !!this.current
      && this.current.startsWith(this.path)
    ) {
      if (!this.open && this.current !== this.path) {
        this.toggle(false);
      }
      if (this.current === this.path) {
        // Needed as `scrollIntoViewIfNeeded` is not supported on Firefox
        if (this.eRef.nativeElement.scrollIntoViewIfNeeded) {
          this.eRef.nativeElement.scrollIntoViewIfNeeded();
        } else {
          this.eRef.nativeElement.scrollIntoView();
        }
      }
    }
	}

	contextMenu: Array<ContextMenuElementSeparator|ContextMenuElementText> = [
		{type: "element", name: 'New File', action: () => {
				this.contextMenuClick.emit(["new_file", this.name])
				this.position = [-1000, -1000];
			} },
		{type: "element", name: 'New Directory', action: () => {
				this.contextMenuClick.emit(["new_directory", this.name])
				this.position = [-1000, -1000];
			} },
		{type: "separator" },
		{type: "element", name: 'Rename', action: () => {
				this.contextMenuClick.emit(["rename_file", this.name])
				this.position = [-1000, -1000];
			} },
		{type: "element", name: 'Delete', action: () => {
				this.contextMenuClick.emit(["delete_file", this.name])
				this.position = [-1000, -1000];
			} }
	]


	get icon() {
		if(this.folder) {
			if(Object.keys(folders).includes(this.name)) {
				const icon = folders[this.name as keyof typeof folders];
				if(this.open) return icon + '-open'
				else return icon;
			}
			else {
				if(this.open) return 'folder-open'
				else return 'folder';
			}
		} else {
			if(Object.keys(files).includes(this.name)) {
				return files[this.name as keyof typeof files];

			} else {
				let splitted = this.name.split('.')
				while(splitted.length > 0) {
					splitted = splitted.slice(1)
					const ext = splitted.join('.')
					if(ext && Object.keys(extensions).includes(ext)) {
						return extensions[ext as keyof typeof extensions];
					}
				}
				return 'file'
			}

		}
	}

	toggle(shouldEmit = true) {
		this.open = !this.open;
    if (shouldEmit) {
		  this.clickFile.emit(this.name)
    }
	}

	get style() {
		return 'margin-left: '+ 10*this.depth +'px'
	}

	get folder() {
		return this.content !== null && this.content !== undefined
	}

  get isActive() {
    return this.current === this.path;
  }

	handleClickFile(file: string) {
		this.clickFile.emit(this.name + '/' + file);
	}

	handleRightClickFile(event: MouseEvent) {
		event.preventDefault()
		const pos = getAbsolutePosition(event.target);
		this.position = [pos.x + event.offsetX, pos.y + event.offsetY]
	}

	handleRightClick(event: ContextMenuAction) {
		this.contextMenuClick.emit([event[0], this.name + '/' + event[1]]);
	}

  collapseAll() {
    this.children().forEach((child) => child.collapseAll());
    this.open = false;
  }

	@HostListener('document:contextmenu', ['$event'])
	clickOut(event: MouseEvent) {
		if(!this.eRef.nativeElement.contains(event.target)) {
			this.position = [-1000, -1000];
		}
	}

  get colorStyle() {
    switch(this.color) {
      case 'red':
        return '#c74e39'
      case 'yellow':
        return '#e2c08d'
      case 'green':
        return '#81b88b'
      case 'gray':
        return '#8c8c8c'
      default:
        if(this.color?.startsWith("#")) return this.color;
        else if(this.color) {
          console.warn("Invalid color ", this.color, " please use red | yellow | green | gray or a valid hex color with #.")
          return null;
        } else {
          return null;
        }
    }
  }

  drop($event: CdkDragDrop<any>) {
    const file = $event.item.data;
    //Find the container where the file is dropped (thank copilot)
    const containers = document.querySelectorAll('.monaco-tree-file-container');
    let targetContainer: Element|null = null;
    for (const container of Array.from(containers)) {
      const boundingRect = container.getBoundingClientRect();
      if ($event.dropPoint.x >= boundingRect.left && $event.dropPoint.x <= boundingRect.right &&
        $event.dropPoint.y >= boundingRect.top && $event.dropPoint.y <= boundingRect.bottom) {
        targetContainer = container;
      }
    }

    if (targetContainer) {
      this.dragDropFile.emit({sourceFile: file, destinationFile: targetContainer.getAttribute('ng-reflect-path') ?? '/'});
    } else {
      this.dragDropFile.emit({sourceFile: file, destinationFile: '/'});
    }
  }
}
