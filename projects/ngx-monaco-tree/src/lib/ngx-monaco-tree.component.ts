import { Component, viewChildren, input, output, model } from '@angular/core';
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
        <monaco-tree-file class="monaco-tree-file-container"
          (dragDropFile)="dragDropFile.emit($event)"
          cdkDropList
          [cdkDropListData]="tree()"
          (contextMenuClick)="handleClickContextMenu($event)"
          [theme]="theme()"
          [name]="row.name"
          [content]="row.content"
          [color]="row.color"
          [(current)]="currentFile">
        </monaco-tree-file>
      }
    </div>
    `,
  styleUrls: ['./ngx-monaco-tree.component.scss']
})
export class NgxMonacoTreeComponent {
  private readonly children = viewChildren(MonacoTreeFileComponent);

  readonly theme = input<'vs-dark' | 'vs-light'>('vs-dark');
  readonly tree = input.required<MonacoTreeElement[]>();
  readonly width = input("300px");
  readonly height = input("500px");

  readonly clickContextMenu = output<ContextMenuAction>();
  readonly dragDropFile = output<DragAndDropEvent>();

  readonly currentFile = model<string | null>(null);

  handleClickContextMenu(event: ContextMenuAction) {
    this.clickContextMenu.emit(event);
  }

  handleNewFile() {
    const currentFile = this.currentFile();
    if (currentFile !== null) {
      this.clickContextMenu.emit(["new_file", currentFile])
    }
  }

  handleNewDirectory() {
    const currentFile = this.currentFile();
    if (currentFile !== null) {
      this.clickContextMenu.emit(["new_directory", currentFile])
    }
  }

  handleCollapseAll() {
    this.children().forEach((child) => child.collapseAll());
  }
}
