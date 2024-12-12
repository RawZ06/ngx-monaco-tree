import { Component, ElementRef, HostListener, inject, input, model } from '@angular/core';
import { ContextMenuElementSeparator, ContextMenuElementText } from "./monaco-tree-context-menu.type";
import { NgClass } from '@angular/common';


@Component({
  selector: 'monaco-tree-context-menu',
  imports: [NgClass],
  templateUrl: './monaco-tree-context-menu.component.html',
  styleUrls: ['./monaco-tree-context-menu.component.scss']
})
export class MonacoTreeContextMenuComponent {
  private readonly eRef = inject(ElementRef);

  top = model<number | undefined>(undefined);
  left = model<number | undefined>(undefined)

  readonly theme = input<'vs-dark' | 'vs-light'>('vs-dark');

  readonly elements = input.required<Array<ContextMenuElementSeparator | ContextMenuElementText>>();

  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.top.set(-1000);
      this.left.set(-1000);
    }
  }
}
