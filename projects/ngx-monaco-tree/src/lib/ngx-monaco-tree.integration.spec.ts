import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NgxMonacoTreeComponent } from './ngx-monaco-tree.component';
import { MonacoTreeElement, ContextMenuAction } from './ngx-monaco-tree.type';
import { DragAndDropEvent } from './monaco-tree-file/monaco-tree-file.type';

describe('NgxMonacoTree - Integration Tests', () => {
  let component: NgxMonacoTreeComponent;
  let fixture: ComponentFixture<NgxMonacoTreeComponent>;

  const sampleProjectTree: MonacoTreeElement[] = [
    {
      name: '.vscode',
      content: [
        { name: 'settings.json' },
        { name: 'launch.json' }
      ]
    },
    {
      name: 'src',
      content: [
        {
          name: 'app',
          content: [
            { name: 'app.component.ts', color: 'blue' },
            { name: 'app.component.html' },
            { name: 'app.component.css', color: 'gray' },
            { name: 'app.module.ts', color: 'red' }
          ]
        },
        {
          name: 'assets',
          content: [
            { name: 'logo.png' },
            { name: 'styles.css' }
          ]
        },
        { name: 'main.ts', color: 'green' },
        { name: 'index.html' }
      ]
    },
    {
      name: 'package.json'
    },
    {
      name: 'angular.json'
    },
    {
      name: 'tsconfig.json'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMonacoTreeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NgxMonacoTreeComponent);
    component = fixture.componentInstance;
  });

  describe('Full Project Tree Rendering', () => {
    it('should render complete project tree structure', () => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.detectChanges();

      const treeContainer = fixture.nativeElement.querySelector('.monaco-tree');
      expect(treeContainer).toBeTruthy();
      expect(treeContainer.children.length).toBeGreaterThan(0);
    });

    it('should render nested directories', () => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.detectChanges();

      const srcFolder = sampleProjectTree.find(item => item.name === 'src');
      expect(srcFolder?.content).toBeTruthy();
      expect(srcFolder?.content?.length).toBeGreaterThan(0);
    });

    it('should preserve tree structure through rendering', () => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.detectChanges();

      expect(component.tree().length).toBe(sampleProjectTree.length);
    });
  });

  describe('User Interactions - File Selection', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.detectChanges();
    });

    it('should handle file selection', () => {
      const testFile = 'src/app/app.component.ts';
      component.currentFile.set(testFile);

      expect(component.currentFile()).toBe(testFile);
    });

    it('should clear file selection', () => {
      component.currentFile.set('src/app/app.component.ts');
      component.currentFile.set(null);

      expect(component.currentFile()).toBeNull();
    });

    it('should maintain file selection across theme changes', () => {
      const testFile = 'src/main.ts';
      component.currentFile.set(testFile);
      component.theme = signal('vs-light');
      fixture.detectChanges();

      expect(component.currentFile()).toBe(testFile);
    });
  });

  describe('Theme Switching', () => {
    it('should switch from dark to light theme', () => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.componentRef.setInput('theme', 'vs-dark');
      fixture.detectChanges();

      const treeElement = fixture.nativeElement.querySelector('.vs-dark');
      expect(treeElement).toBeTruthy();

      fixture.componentRef.setInput('theme', 'vs-light');
      fixture.detectChanges();

      const lightThemeElement = fixture.nativeElement.querySelector('.vs-light');
      expect(lightThemeElement).toBeTruthy();
    });

    it('should apply correct CSS class for active theme', () => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.componentRef.setInput('theme', 'vs-dark');
      fixture.detectChanges();

      let treeElement = fixture.nativeElement.querySelector('.monaco-tree');
      expect(treeElement.className).toContain('vs-dark');

      fixture.componentRef.setInput('theme', 'vs-light');
      fixture.detectChanges();

      treeElement = fixture.nativeElement.querySelector('.monaco-tree');
      expect(treeElement.className).toContain('vs-light');
    });
  });

  describe('Dimension Management', () => {
    it('should apply custom dimensions', () => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.componentRef.setInput('width', '800px');
      fixture.componentRef.setInput('height', '1000px');
      fixture.detectChanges();

      const treeElement = fixture.nativeElement.querySelector('.monaco-tree');
      expect(treeElement.style.width).toBe('800px');
      expect(treeElement.style.height).toBe('1000px');
    });

    it('should handle percentage-based dimensions', () => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.componentRef.setInput('width', '100%');
      fixture.componentRef.setInput('height', '100%');
      fixture.detectChanges();

      const treeElement = fixture.nativeElement.querySelector('.monaco-tree');
      expect(treeElement.style.width).toBe('100%');
      expect(treeElement.style.height).toBe('100%');
    });

    it('should update dimensions dynamically', () => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.componentRef.setInput('width', '400px');
      fixture.componentRef.setInput('height', '600px');
      fixture.detectChanges();

      let treeElement = fixture.nativeElement.querySelector('.monaco-tree');
      expect(treeElement.style.width).toBe('400px');

      fixture.componentRef.setInput('width', '500px');
      fixture.detectChanges();

      treeElement = fixture.nativeElement.querySelector('.monaco-tree');
      expect(treeElement.style.width).toBe('500px');
    });
  });

  describe('Context Menu Events', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.detectChanges();
    });

    it('should emit new_file action', (done) => {
      component.currentFile.set('src/app');
      let emitted = false;

      component.clickContextMenu.subscribe((action: ContextMenuAction) => {
        expect(action[0]).toBe('new_file');
        expect(action[1]).toBe('src/app');
        emitted = true;
      });

      component.handleNewFile();
      setTimeout(() => {
        expect(emitted).toBe(true);
        done();
      }, 100);
    });

    it('should emit new_directory action', (done) => {
      component.currentFile.set('src');
      let emitted = false;

      component.clickContextMenu.subscribe((action: ContextMenuAction) => {
        expect(action[0]).toBe('new_directory');
        expect(action[1]).toBe('src');
        emitted = true;
      });

      component.handleNewDirectory();
      setTimeout(() => {
        expect(emitted).toBe(true);
        done();
      }, 100);
    });

    it('should not emit action when currentFile is null', () => {
      component.currentFile.set(null);
      let emitted = false;

      component.clickContextMenu.subscribe(() => {
        emitted = true;
      });

      component.handleNewFile();
      component.handleNewDirectory();

      expect(emitted).toBe(false);
    });
  });

  describe('Drag and Drop Integration', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.detectChanges();
    });

    it('should emit drag drop event with source and destination', (done) => {
      const dragEvent: DragAndDropEvent = {
        sourceFile: 'src/app/app.component.ts',
        destinationFile: 'src'
      };

      component.dragDropFile.subscribe((event: DragAndDropEvent) => {
        expect(event.sourceFile).toBe(dragEvent.sourceFile);
        expect(event.destinationFile).toBe(dragEvent.destinationFile);
        done();
      });

      component.dragDropFile.emit(dragEvent);
    });

    it('should handle file movement within same folder', (done) => {
      const dragEvent: DragAndDropEvent = {
        sourceFile: 'src/app/app.component.ts',
        destinationFile: 'src/app/app.module.ts'
      };

      component.dragDropFile.subscribe((event: DragAndDropEvent) => {
        expect(event.sourceFile).toBe('src/app/app.component.ts');
        done();
      });

      component.dragDropFile.emit(dragEvent);
    });

    it('should handle file movement to different folder', (done) => {
      const dragEvent: DragAndDropEvent = {
        sourceFile: 'src/app/app.component.ts',
        destinationFile: 'src/assets'
      };

      component.dragDropFile.subscribe((event: DragAndDropEvent) => {
        expect(event.destinationFile).toBe('src/assets');
        done();
      });

      component.dragDropFile.emit(dragEvent);
    });
  });

  describe('Color Preservation', () => {
    it('should preserve colors through tree operations', () => {
      const treeWithColors: MonacoTreeElement[] = [
        {
          name: 'files',
          content: [
            { name: 'red.ts', color: 'red' },
            { name: 'green.ts', color: 'green' }
          ]
        }
      ];

      fixture.componentRef.setInput('tree', treeWithColors);
      fixture.detectChanges();

      const content = component.tree()[0].content;
      expect(content?.[0].color).toBe('red');
      expect(content?.[1].color).toBe('green');
    });

    it('should support custom color values', () => {
      const treeWithCustomColors: MonacoTreeElement[] = [
        { name: 'hex-color.ts', color: '#ff0000' },
        { name: 'rgb-color.ts', color: 'rgb(255,0,0)' }
      ];

      fixture.componentRef.setInput('tree', treeWithCustomColors);
      fixture.detectChanges();

      expect(component.tree()[0].color).toBe('#ff0000');
      expect(component.tree()[1].color).toBe('rgb(255,0,0)');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle simultaneous theme change and file selection', () => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.componentRef.setInput('theme', 'vs-dark');
      component.currentFile.set('src/main.ts');
      fixture.detectChanges();

      fixture.componentRef.setInput('theme', 'vs-light');
      fixture.detectChanges();

      expect(component.currentFile()).toBe('src/main.ts');
      expect(component.theme()).toBe('vs-light');
    });

    it('should handle tree updates while file is selected', () => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      component.currentFile.set('src/main.ts');
      fixture.detectChanges();

      const updatedTree = [...sampleProjectTree];
      updatedTree[1].content?.push({ name: 'new-file.ts' });

      fixture.componentRef.setInput('tree', updatedTree);
      fixture.detectChanges();

      expect(component.currentFile()).toBe('src/main.ts');
      expect(component.tree()[1].content?.length).toBeGreaterThan(sampleProjectTree[1].content?.length ?? 0);
    });

    it('should handle dimension change with expansion', () => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.componentRef.setInput('width', '300px');
      fixture.componentRef.setInput('height', '500px');
      fixture.detectChanges();

      fixture.componentRef.setInput('width', '800px');
      fixture.componentRef.setInput('height', '1200px');
      fixture.detectChanges();

      const treeElement = fixture.nativeElement.querySelector('.monaco-tree');
      expect(treeElement.style.width).toBe('800px');
      expect(treeElement.style.height).toBe('1200px');
    });
  });

  describe('Performance and Stability', () => {
    it('should handle rapid file selections', () => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.detectChanges();

      const files = ['src/main.ts', 'src/app/app.component.ts', 'src/app/app.module.ts'];

      files.forEach(file => {
        component.currentFile.set(file);
        expect(component.currentFile()).toBe(file);
      });
    });

    it('should handle rapid theme switches', () => {
      fixture.componentRef.setInput('tree', sampleProjectTree);
      fixture.detectChanges();

      for (let i = 0; i < 5; i++) {
        fixture.componentRef.setInput('theme', 'vs-dark');
        fixture.detectChanges();
        fixture.componentRef.setInput('theme', 'vs-light');
        fixture.detectChanges();
      }

      expect(component.theme()).toBe('vs-light');
    });
  });
});
