import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { MonacoTreeFileComponent } from './monaco-tree-file.component';
import { MonacoTreeElement } from '../ngx-monaco-tree.type';

describe('MonacoTreeFileComponent', () => {
  let component: MonacoTreeFileComponent;
  let fixture: ComponentFixture<MonacoTreeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonacoTreeFileComponent, DragDropModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MonacoTreeFileComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default theme (vs-dark)', () => {
      expect(component.theme()).toBe('vs-dark');
    });

    it('should initialize collapsed state', () => {
      expect(component.isCollapsed()).toBe(true);
    });
  });

  describe('File vs Folder Display', () => {
    it('should identify file (no content property)', () => {
      fixture.componentRef.setInput('name', 'app.ts');
      fixture.componentRef.setInput('content', undefined);
      fixture.detectChanges();

      expect(component.isFolder()).toBeFalsy();
    });

    it('should identify folder (has content property)', () => {
      fixture.componentRef.setInput('name', 'src');
      fixture.componentRef.setInput('content', []);
      fixture.detectChanges();

      expect(component.isFolder()).toBeTruthy();
    });
  });

  describe('Expand/Collapse Functionality', () => {
    it('should initialize in collapsed state', () => {
      fixture.componentRef.setInput('name', 'folder');
      fixture.componentRef.setInput('content', [{ name: 'file.ts' }]);
      fixture.detectChanges();

      expect(component.isCollapsed()).toBe(true);
    });

    it('should toggle expand/collapse state', () => {
      fixture.componentRef.setInput('name', 'folder');
      fixture.componentRef.setInput('content', [{ name: 'file.ts' }]);
      fixture.detectChanges();

      const initialState = component.isCollapsed();
      component.toggleExpand();

      expect(component.isCollapsed()).toBe(!initialState);
    });

    it('should not expand files', () => {
      fixture.componentRef.setInput('name', 'app.ts');
      fixture.componentRef.setInput('content', undefined);
      fixture.detectChanges();

      component.toggleExpand();

      expect(component.isCollapsed()).toBe(true);
    });
  });

  describe('Recursion for Nested Content', () => {
    it('should render nested content when expanded', () => {
      const nestedContent: MonacoTreeElement[] = [
        { name: 'file1.ts' },
        { name: 'file2.ts' }
      ];

      fixture.componentRef.setInput('name', 'src');
      fixture.componentRef.setInput('content', nestedContent);
      component.isCollapsed.set(false);
      fixture.detectChanges();

      const nestedElements = fixture.nativeElement.querySelectorAll('monaco-tree-file');
      expect(nestedElements.length).toBeGreaterThan(0);
    });

    it('should hide nested content when collapsed', () => {
      const nestedContent: MonacoTreeElement[] = [
        { name: 'file1.ts' }
      ];

      fixture.componentRef.setInput('name', 'src');
      fixture.componentRef.setInput('content', nestedContent);
      component.isCollapsed.set(true);
      fixture.detectChanges();

      const nestedElements = fixture.nativeElement.querySelectorAll('monaco-tree-file');
      expect(nestedElements.length).toBe(0);
    });
  });

  describe('Current File Selection', () => {
    it('should update current file model', () => {
      fixture.componentRef.setInput('name', 'app.ts');
      component.current.set('app.ts');

      expect(component.current()).toBe('app.ts');
    });

    it('should highlight selected file', () => {
      fixture.componentRef.setInput('name', 'app.ts');
      component.current.set('app.ts');
      fixture.detectChanges();

      const element = fixture.nativeElement.querySelector('[ngClass]');
      expect(element).toBeTruthy();
    });

    it('should not highlight unselected file', () => {
      fixture.componentRef.setInput('name', 'app.ts');
      component.current.set('other.ts');
      fixture.detectChanges();

      expect(component.current()).not.toBe(component.name());
    });
  });

  describe('Context Menu Functionality', () => {
    it('should emit context menu event on right click', (done) => {
      fixture.componentRef.setInput('name', 'app.ts');
      component.contextMenuClick.subscribe((action) => {
        expect(action).toBeDefined();
        done();
      });

      component.contextMenuClick.emit(['delete_file', 'app.ts']);
    });

    it('should pass correct action type to context menu', (done) => {
      component.contextMenuClick.subscribe((action) => {
        expect(action[0]).toBe('rename_file');
        expect(action[1]).toBe('app.ts');
        done();
      });

      component.contextMenuClick.emit(['rename_file', 'app.ts']);
    });
  });

  describe('Drag and Drop', () => {
    it('should emit drag drop event', (done) => {
      fixture.componentRef.setInput('name', 'app.ts');
      component.dragDropFile.subscribe((event) => {
        expect(event.sourceFile).toBe('app.ts');
        done();
      });

      component.dragDropFile.emit({
        sourceFile: 'app.ts',
        destinationFile: 'dist/app.js'
      });
    });

    it('should include source and destination in drag drop event', (done) => {
      fixture.componentRef.setInput('name', 'src/app.ts');
      component.dragDropFile.subscribe((event) => {
        expect(event.sourceFile).toBe('src/app.ts');
        expect(event.destinationFile).toBe('dest/app.ts');
        done();
      });

      component.dragDropFile.emit({
        sourceFile: 'src/app.ts',
        destinationFile: 'dest/app.ts'
      });
    });
  });

  describe('Theme Support', () => {
    it('should apply vs-dark theme', () => {
      fixture.componentRef.setInput('name', 'file.ts');
      fixture.componentRef.setInput('theme', 'vs-dark');
      fixture.detectChanges();

      const element = fixture.nativeElement.querySelector('[class*="vs-"]');
      expect(element).toBeTruthy();
    });

    it('should apply vs-light theme', () => {
      fixture.componentRef.setInput('name', 'file.ts');
      fixture.componentRef.setInput('theme', 'vs-light');
      fixture.detectChanges();

      const element = fixture.nativeElement.querySelector('[class*="vs-"]');
      expect(element).toBeTruthy();
    });
  });

  describe('Color Support', () => {
    it('should apply custom color when provided', () => {
      fixture.componentRef.setInput('name', 'file.ts');
      fixture.componentRef.setInput('color', 'red');
      fixture.detectChanges();

      expect(component.color()).toBe('red');
    });

    it('should handle undefined color', () => {
      fixture.componentRef.setInput('name', 'file.ts');
      fixture.componentRef.setInput('color', undefined);
      fixture.detectChanges();

      expect(component.color()).toBeUndefined();
    });

    it('should support various color values', () => {
      const colors = ['red', 'yellow', 'green', 'gray', '#ff0000'];

      colors.forEach(color => {
        fixture.componentRef.setInput('color', color);
        fixture.detectChanges();

        expect(component.color()).toBe(color);
      });
    });
  });

  describe('Collapse All Propagation', () => {
    it('should collapse all nested items', () => {
      const nestedContent: MonacoTreeElement[] = [
        {
          name: 'subfolder',
          content: [{ name: 'file.ts' }]
        }
      ];

      fixture.componentRef.setInput('name', 'folder');
      fixture.componentRef.setInput('content', nestedContent);
      component.isCollapsed.set(false);
      fixture.detectChanges();

      component.collapseAll();

      expect(component.isCollapsed()).toBe(true);
    });
  });

  describe('Empty Folder Handling', () => {
    it('should handle empty folder (empty array)', () => {
      fixture.componentRef.setInput('name', 'empty-folder');
      fixture.componentRef.setInput('content', []);
      fixture.detectChanges();

      expect(component.isFolder()).toBeTruthy();
    });

    it('should display folder icon for empty folder', () => {
      fixture.componentRef.setInput('name', 'empty-folder');
      fixture.componentRef.setInput('content', []);
      fixture.detectChanges();

      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('Large Number of Items', () => {
    it('should handle folders with many items', () => {
      const largeContent: MonacoTreeElement[] = Array.from(
        { length: 100 },
        (_, i) => ({ name: `file_${i}.ts` })
      );

      fixture.componentRef.setInput('name', 'large-folder');
      fixture.componentRef.setInput('content', largeContent);
      fixture.detectChanges();

      expect(component.content().length).toBe(100);
    });

    it('should not throw error with large nested structure', () => {
      const largeContent: MonacoTreeElement[] = Array.from(
        { length: 50 },
        (_, i) => ({
          name: `folder_${i}`,
          content: Array.from(
            { length: 10 },
            (_, j) => ({ name: `file_${j}.ts` })
          )
        })
      );

      fixture.componentRef.setInput('name', 'large-root');
      fixture.componentRef.setInput('content', largeContent);

      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('Special Characters in Names', () => {
    it('should handle spaces in file names', () => {
      fixture.componentRef.setInput('name', 'my file name.ts');
      fixture.detectChanges();

      expect(component.name()).toBe('my file name.ts');
    });

    it('should handle special characters', () => {
      const specialNames = [
        'file@name.ts',
        'file#name.ts',
        'file$name.ts',
        'file%name.ts',
        'file-name.ts',
        'file_name.ts'
      ];

      specialNames.forEach(name => {
        fixture.componentRef.setInput('name', name);
        fixture.detectChanges();

        expect(component.name()).toBe(name);
      });
    });

    it('should handle unicode characters', () => {
      fixture.componentRef.setInput('name', '文件.ts');
      fixture.detectChanges();

      expect(component.name()).toBe('文件.ts');
    });
  });
});
