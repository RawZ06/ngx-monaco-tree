import { Component, Input, viewChildren, input, output } from '@angular/core';
import { MonacoTreeElement } from './ngx-monaco-tree.type';
import { ContextMenuAction, DragAndDropEvent } from "./monaco-tree-file/monaco-tree-file.type";
import { MonacoTreeFileComponent } from "./monaco-tree-file/monaco-tree-file.component";
import { MonacoTreeIconsComponent } from "./monaco-tree-icons/monaco-tree-icons.component";
import { CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'monaco-tree',
  imports: [MonacoTreeFileComponent, MonacoTreeIconsComponent, DragDropModule, CdkDropList],
  template: `
    <div [style]="'width:' + width() + ';height:' + height()" [class]="'monaco-tree ' + theme()">
      <monaco-tree-icons [theme]="theme()" (newDirectory)="handleNewDirectory()" (newFile)="handleNewFile()" (collapseAll)="handleCollapseAll()"></monaco-tree-icons>
      @for (row of tree(); track row.name) {
        <monaco-tree-file (dragDropFile)="dragDropFile.emit($event)" class="monaco-tree-file-container" cdkDropList [cdkDropListData]="tree()" (contextMenuClick)="handleClickContextMenu($event)" (clickFile)="handleClickFile($event)" [theme]="theme()" [name]="row.name" [path]="row.name" [content]="row.content" [color]="row.color" [depth]="0" [hide]="false" [current]="currentFile"></monaco-tree-file>
      }
    </div>
    `,
  styleUrls: ['./ngx-monaco-tree.component.scss']
})
export class NgxMonacoTreeComponent {

  readonly theme = input<'vs-dark' | 'vs-light'>('vs-dark');
  readonly tree = input<MonacoTreeElement[]>([]);

  readonly width = input("300px");
  readonly height = input("500px");

  readonly clickFile = output<string>();
  readonly clickContextMenu = output<ContextMenuAction>();
  readonly dragDropFile = output<DragAndDropEvent>();

  // TODO: Skipped for migration because:
  // Your application code writes to the input. This prevents migration.
  @Input() currentFile: string | null = null;

  private children = viewChildren(MonacoTreeFileComponent);

  handleClickFile(path: string) {
    this.clickFile.emit(path);
    this.currentFile = path;
  }

  handleClickContextMenu(event: ContextMenuAction) {
    this.clickContextMenu.emit(event);
  }

  handleNewFile() {
    if (this.currentFile !== null) {
      this.clickContextMenu.emit(["new_file", this.currentFile])
    }
  }

  handleNewDirectory() {
    if (this.currentFile !== null) {
      this.clickContextMenu.emit(["new_directory", this.currentFile])
    }
  }

  handleCollapseAll() {
    this.children().forEach((child) => child.collapseAll());
  }
}
