import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MonacoTreeFileComponent } from './monaco-tree-file/monaco-tree-file.component';
import { NgxMonacoTreeComponent } from './ngx-monaco-tree.component';
import { MonacoTreeContextMenuComponent } from './monaco-tree-context-menu/monaco-tree-context-menu.component';



@NgModule({
  declarations: [
    NgxMonacoTreeComponent,
    MonacoTreeFileComponent,
    MonacoTreeContextMenuComponent,
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    NgxMonacoTreeComponent
  ]
})
export class NgxMonacoTreeModule { }
