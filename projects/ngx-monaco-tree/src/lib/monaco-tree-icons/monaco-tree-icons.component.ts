import {Component, input, output} from '@angular/core';


@Component({
    selector: 'monaco-tree-icons',
    templateUrl: './monaco-tree-icons.component.html',
    styleUrl: './monaco-tree-icons.component.scss'
})
export class MonacoTreeIconsComponent {
  readonly theme = input<'vs-dark' | 'vs-light'>('vs-dark');
  readonly newFile = output<void>();
  readonly newDirectory = output<void>();
  readonly collapseAll = output<void>();

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
