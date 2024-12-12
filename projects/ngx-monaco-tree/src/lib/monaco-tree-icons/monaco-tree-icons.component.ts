import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'monaco-tree-icons',
  standalone: true,
  templateUrl: './monaco-tree-icons.component.html',
  styleUrl: './monaco-tree-icons.component.scss'
})
export class MonacoTreeIconsComponent {
  @Input() theme: 'vs-dark'|'vs-light' = 'vs-dark';
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
