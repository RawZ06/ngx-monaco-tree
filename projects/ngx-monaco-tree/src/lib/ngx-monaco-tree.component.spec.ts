import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NgxMonacoTreeComponent } from './ngx-monaco-tree.component';
import { MonacoTreeElement } from './ngx-monaco-tree.type';

describe('NgxMonacoTreeComponent', () => {
  let component: NgxMonacoTreeComponent;
  let fixture: ComponentFixture<NgxMonacoTreeComponent>;

  const mockTree: MonacoTreeElement[] = [
    {
      name: 'src',
      content: [
        { name: 'app.ts' },
        { name: 'app.html' }
      ]
    },
    {
      name: 'README.md'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMonacoTreeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NgxMonacoTreeComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default theme (vs-dark)', () => {
      expect(component.theme()).toBe('vs-dark');
    });

    it('should initialize with default width (300px)', () => {
      expect(component.width()).toBe('300px');
    });

    it('should initialize with default height (500px)', () => {
      expect(component.height()).toBe('500px');
    });

    it('should initialize currentFile as null', () => {
      expect(component.currentFile()).toBeNull();
    });
  });

  describe('Input Properties', () => {
    it('should render tree content', () => {
      fixture.componentRef.setInput('tree', mockTree);
      fixture.detectChanges();

      const treeElement = fixture.nativeElement.querySelector('.monaco-tree');
      expect(treeElement).toBeTruthy();
    });

    it('should support custom dimensions via input', () => {
      fixture.componentRef.setInput('tree', mockTree);
      fixture.componentRef.setInput('width', '600px');
      fixture.componentRef.setInput('height', '800px');
      fixture.detectChanges();

      const treeElement = fixture.nativeElement.querySelector('.monaco-tree');
      expect(treeElement.style.width).toBe('600px');
      expect(treeElement.style.height).toBe('800px');
    });
  });

  describe('Two-way Binding (currentFile)', () => {
    it('should update currentFile model', () => {
      const filePath = 'src/app.ts';
      component.currentFile.set(filePath);

      expect(component.currentFile()).toBe(filePath);
    });

    it('should handle null currentFile', () => {
      component.currentFile.set(null);
      expect(component.currentFile()).toBeNull();
    });
  });

  describe('Event Emissions', () => {
    it('should emit clickContextMenu event', (done) => {
      fixture.componentRef.setInput('tree', mockTree);
      fixture.detectChanges();

      component.clickContextMenu.subscribe((action) => {
        expect(action).toBeDefined();
        expect(action[0]).toBe('new_file');
        expect(action[1]).toBe('src');
        done();
      });

      component.handleClickContextMenu(['new_file', 'src']);
    });

    it('should emit dragDropFile event', (done) => {
      component.dragDropFile.subscribe((event) => {
        expect(event).toBeDefined();
        done();
      });

      component.dragDropFile.emit({
        sourceFile: 'src/app.ts',
        destinationFile: 'dist/app.js'
      });
    });
  });

  describe('Toolbar Actions', () => {
    it('should handle new file action when currentFile is set', () => {
      component.currentFile.set('src');
      spyOn(component.clickContextMenu, 'emit');

      component.handleNewFile();

      expect(component.clickContextMenu.emit).toHaveBeenCalledWith(['new_file', 'src']);
    });

    it('should not emit new file action when currentFile is null', () => {
      component.currentFile.set(null);
      spyOn(component.clickContextMenu, 'emit');

      component.handleNewFile();

      expect(component.clickContextMenu.emit).not.toHaveBeenCalled();
    });

    it('should handle new directory action when currentFile is set', () => {
      component.currentFile.set('src');
      spyOn(component.clickContextMenu, 'emit');

      component.handleNewDirectory();

      expect(component.clickContextMenu.emit).toHaveBeenCalledWith(['new_directory', 'src']);
    });

    it('should not emit new directory action when currentFile is null', () => {
      component.currentFile.set(null);
      spyOn(component.clickContextMenu, 'emit');

      component.handleNewDirectory();

      expect(component.clickContextMenu.emit).not.toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('should apply correct CSS classes', () => {
      fixture.componentRef.setInput('tree', mockTree);
      fixture.componentRef.setInput('theme', 'vs-dark');
      fixture.detectChanges();

      const treeElement = fixture.nativeElement.querySelector('.monaco-tree');
      expect(treeElement.classList.contains('monaco-tree')).toBeTruthy();
      expect(treeElement.classList.contains('vs-dark')).toBeTruthy();
    });

    it('should apply inline styles for dimensions', () => {
      fixture.componentRef.setInput('tree', mockTree);
      fixture.componentRef.setInput('width', '400px');
      fixture.componentRef.setInput('height', '600px');
      fixture.detectChanges();

      const treeElement = fixture.nativeElement.querySelector('.monaco-tree');
      const style = treeElement.getAttribute('style');
      expect(style).toContain('width:400px');
      expect(style).toContain('height:600px');
    });
  });

  describe('Empty Tree', () => {
    it('should handle empty tree array', () => {
      fixture.componentRef.setInput('tree', []);
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should render container even with empty tree', () => {
      fixture.componentRef.setInput('tree', []);
      fixture.detectChanges();

      const treeElement = fixture.nativeElement.querySelector('.monaco-tree');
      expect(treeElement).toBeTruthy();
    });
  });

  describe('Deep Tree Structure', () => {
    it('should handle deeply nested tree structures', () => {
      const deepTree: MonacoTreeElement[] = [
        {
          name: 'level1',
          content: [
            {
              name: 'level2',
              content: [
                {
                  name: 'level3',
                  content: [
                    { name: 'level4.ts' }
                  ]
                }
              ]
            }
          ]
        }
      ];

      fixture.componentRef.setInput('tree', deepTree);
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('Color Support', () => {
    it('should preserve file color property', () => {
      const coloredTree: MonacoTreeElement[] = [
        { name: 'red-file.ts', color: 'red' },
        { name: 'yellow-file.ts', color: 'yellow' },
        { name: 'green-file.ts', color: 'green' },
        { name: 'gray-file.ts', color: 'gray' }
      ];

      fixture.componentRef.setInput('tree', coloredTree);
      fixture.detectChanges();

      expect(component.tree().every(file => file.color)).toBeTruthy();
    });
  });
});
