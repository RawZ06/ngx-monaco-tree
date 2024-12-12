import { Component, ElementRef, HostListener, OnChanges, SimpleChanges, inject, viewChildren, input, output, model, computed, signal } from '@angular/core';
import { extensions } from '../../utils/extension-icon';
import { files } from '../../utils/file-icon';
import { folders } from '../../utils/folder-icon';
import { MonacoTreeElement } from '../ngx-monaco-tree.type';
import {
  ContextMenuElementSeparator,
  ContextMenuElementText
} from "../monaco-tree-context-menu/monaco-tree-context-menu.type";
import { ContextMenuAction, DragAndDropEvent } from "./monaco-tree-file.type";
import { MonacoTreeContextMenuComponent } from "../monaco-tree-context-menu/monaco-tree-context-menu.component";
import { NgClass, NgStyle } from "@angular/common";
import { DragDropModule, CdkDragDrop, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

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
  imports: [
    MonacoTreeContextMenuComponent,
    DragDropModule,
    NgClass,
    NgStyle,
    CdkDrag,
    CdkDrag,
    CdkDropList
  ],
  templateUrl: './monaco-tree-file.component.html',
  styleUrls: ['./monaco-tree-file.component.scss']
})
export class MonacoTreeFileComponent implements OnChanges {
  private readonly eRef = inject(ElementRef);
  private readonly children = viewChildren(MonacoTreeFileComponent);

  readonly name = input.required<string>();
  readonly path = input('');
  readonly color = input<string | undefined>();
  readonly content = input.required<MonacoTreeElement[] | undefined>();
  readonly depth = input(0);
  readonly theme = input<'vs-dark' | 'vs-light'>('vs-dark');

  readonly current = model<string | null>(null);

  readonly contextMenuClick = output<ContextMenuAction>();
  readonly dragDropFile = output<DragAndDropEvent>();

  readonly open = signal(false);
  readonly position = signal<[number, number] | undefined>(undefined);

  readonly fullPath = computed(() => `${this.path() ? this.path() + '/' : ''}${this.name()}`);
  readonly isActive = computed(() => this.current() === this.fullPath());
  readonly style = computed(() => `margin-left: ${10 * this.depth()}px`);
  readonly folder = computed(() => Array.isArray(this.content()));
  readonly icon = computed(() => {
    if (this.folder()) {
      const name = this.name();
      if (Object.keys(folders).includes(name)) {
        const icon = folders[name as keyof typeof folders];
        if (this.open()) return icon + '-open'
        else return icon;
      }
      else {
        if (this.open()) return 'folder-open'
        else return 'folder';
      }
    } else {
      const name = this.name();
      if (Object.keys(files).includes(name)) {
        return files[name as keyof typeof files];
      } else {
        let splitted = name.split('.')
        while (splitted.length > 0) {
          splitted = splitted.slice(1)
          const ext = splitted.join('.')
          if (ext && Object.keys(extensions).includes(ext)) {
            return extensions[ext as keyof typeof extensions];
          }
        }
        return 'file'
      }
    }
  });
  readonly colorStyle = computed(() => {
    const color = this.color();
    switch (color) {
      case 'red':
        return '#c74e39'
      case 'yellow':
        return '#e2c08d'
      case 'green':
        return '#81b88b'
      case 'gray':
        return '#8c8c8c'
      default:
        if (color?.startsWith("#")) return color;
        else if (color) {
          console.warn("Invalid color ", color, " please use red | yellow | green | gray or a valid hex color with #.")
          return;
        } else {
          return;
        }
    }
  });

  readonly contextMenu: Array<ContextMenuElementSeparator | ContextMenuElementText> = [
    {
      type: "element", name: 'New File', action: () => {
        this.contextMenuClick.emit(["new_file", this.fullPath()])
        this.position.set([-1000, -1000]);
      }
    },
    {
      type: "element", name: 'New Directory', action: () => {
        this.contextMenuClick.emit(["new_directory", this.fullPath()])
        this.position.set([-1000, -1000]);
      }
    },
    { type: "separator" },
    {
      type: "element", name: 'Rename', action: () => {
        this.contextMenuClick.emit(["rename_file", this.fullPath()])
        this.position.set([-1000, -1000]);
      }
    },
    {
      type: "element", name: 'Delete', action: () => {
        this.contextMenuClick.emit(["delete_file", this.fullPath()])
        this.position.set([-1000, -1000]);
      }
    }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['current']
      && this.current()?.startsWith(this.fullPath())
    ) {
      if (!this.open() && !this.isActive()) {
        this.toggle(false);
      }
      if (this.isActive()) {
        // Needed as `scrollIntoViewIfNeeded` is not supported on Firefox
        if (this.eRef.nativeElement.scrollIntoViewIfNeeded) {
          this.eRef.nativeElement.scrollIntoViewIfNeeded();
        } else {
          this.eRef.nativeElement.scrollIntoView();
        }
      }
    }
  }

  toggle(shouldChangeCurrent = true) {
    this.open.update((open) => !open);
    if (shouldChangeCurrent) {
      this.current.set(this.fullPath());
    }
  }

  handleRightClickFile(event: MouseEvent) {
    event.preventDefault()
    const pos = getAbsolutePosition(event.target);
    this.position.set([pos.x + event.offsetX, pos.y + event.offsetY]);
  }

  collapseAll() {
    this.children().forEach((child) => child.collapseAll());
    this.open.set(false);
  }

  @HostListener('document:contextmenu', ['$event'])
  clickOut(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.position.set([-1000, -1000]);
    }
  }

  drop($event: CdkDragDrop<any>) {
    const file = $event.item.data;
    // Find the container where the file is dropped (thank copilot)
    const containers = document.querySelectorAll('.monaco-tree-file-container');
    const targetContainer = Array.from(containers).find((container) => {
      const { left, right, bottom, top } = container.getBoundingClientRect();
      const { x, y } = $event.dropPoint;
      return x >= left && x <= right && y >= top && y <= bottom;
    });
    if (targetContainer) {
      const path = targetContainer.getAttribute('ng-reflect-path');
      const name = targetContainer.getAttribute('ng-reflect-name');
      this.dragDropFile.emit({ sourceFile: file, destinationFile: path ? `${path}/${name}` : '/' });
    } else {
      this.dragDropFile.emit({ sourceFile: file, destinationFile: '/' });
    }
  }
}
