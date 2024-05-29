import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'monaco-tree-icons',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './monaco-tree-icons.component.html',
  styleUrl: './monaco-tree-icons.component.scss'
})
export class MonacoTreeIconsComponent {
  @Input() theme: 'vs-dark'|'vs-light' = 'vs-dark';
  @Output() onNewFile = new EventEmitter<void>();
  @Output() onNewDirectory = new EventEmitter<void>();
  @Output() onCollapseAll = new EventEmitter<void>();

  handleNewFile() {
    this.onNewFile.emit();
  }

  handleNewDirectory() {
    this.onNewDirectory.emit();
  }

  handleCollapseAll() {
    this.onCollapseAll.emit();
  }
}
