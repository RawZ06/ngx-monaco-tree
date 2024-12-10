import {Component, EventEmitter, Output, input} from '@angular/core';


@Component({
    selector: 'monaco-tree-icons',
    templateUrl: './monaco-tree-icons.component.html',
    styleUrl: './monaco-tree-icons.component.scss'
})
export class MonacoTreeIconsComponent {
  readonly theme = input<'vs-dark' | 'vs-light'>('vs-dark');
  @Output() newFile = new EventEmitter<void>();
  @Output() newDirectory = new EventEmitter<void>();
  @Output() collapseAll = new EventEmitter<void>();

  handleNewFile() {
    this.newFile.emit();
  }

  handleNewDirectory() {
    this.newDirectory.emit();
  }

  handleCollapseAll() {
    this.collapseAll.emit();
  }
}
