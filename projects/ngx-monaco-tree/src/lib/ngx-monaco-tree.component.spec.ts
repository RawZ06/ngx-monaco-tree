import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMonacoTreeComponent } from './ngx-monaco-tree.component';
import { MonacoTreeElement } from './ngx-monaco-tree.type';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
      imports: [NgxMonacoTreeComponent, DragDropModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NgxMonacoTreeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default theme vs-dark', () => {
    expect(component.theme()).toBe('vs-dark');
  });

  it('should have default width 300px', () => {
    expect(component.width()).toBe('300px');
  });

  it('should have default height 500px', () => {
    expect(component.height()).toBe('500px');
  });

  it('should render tree container', () => {
    fixture.componentRef.setInput('tree', mockTree);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.monaco-tree');
    expect(container).toBeTruthy();
  });

  it('should apply theme class', () => {
    fixture.componentRef.setInput('tree', mockTree);
    fixture.componentRef.setInput('theme', 'vs-dark');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.monaco-tree');
    expect(container.classList.contains('vs-dark')).toBe(true);
  });

  it('should apply custom dimensions', () => {
    fixture.componentRef.setInput('tree', mockTree);
    fixture.componentRef.setInput('width', '500px');
    fixture.componentRef.setInput('height', '800px');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.monaco-tree');
    expect(container.style.width).toBe('500px');
    expect(container.style.height).toBe('800px');
  });

  it('should update currentFile model', () => {
    component.currentFile.set('src/app.ts');
    expect(component.currentFile()).toBe('src/app.ts');
  });

  it('should emit clickContextMenu on handleClickContextMenu', (done) => {
    component.clickContextMenu.subscribe((action) => {
      expect(action[0]).toBe('new_file');
      expect(action[1]).toBe('src');
      done();
    });

    component.handleClickContextMenu(['new_file', 'src']);
  });

  it('should emit dragDropFile event', (done) => {
    component.dragDropFile.subscribe((event) => {
      expect(event.sourceFile).toBe('src/app.ts');
      done();
    });

    component.dragDropFile.emit({
      sourceFile: 'src/app.ts',
      destinationFile: 'dist/app.js'
    });
  });

  it('should handle new file action with currentFile set', () => {
    component.currentFile.set('src');
    spyOn(component.clickContextMenu, 'emit');

    component.handleNewFile();

    expect(component.clickContextMenu.emit).toHaveBeenCalledWith(['new_file', 'src']);
  });

  it('should not emit new file when currentFile is null', () => {
    component.currentFile.set(null);
    spyOn(component.clickContextMenu, 'emit');

    component.handleNewFile();

    expect(component.clickContextMenu.emit).not.toHaveBeenCalled();
  });

  it('should handle new directory action', () => {
    component.currentFile.set('src');
    spyOn(component.clickContextMenu, 'emit');

    component.handleNewDirectory();

    expect(component.clickContextMenu.emit).toHaveBeenCalledWith(['new_directory', 'src']);
  });

  it('should render tree structure', () => {
    fixture.componentRef.setInput('tree', mockTree);
    fixture.detectChanges();

    const treeItems = fixture.nativeElement.querySelectorAll('monaco-tree-file');
    expect(treeItems.length).toBeGreaterThan(0);
  });

  it('should handle light theme', () => {
    fixture.componentRef.setInput('tree', mockTree);
    fixture.componentRef.setInput('theme', 'vs-light');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.monaco-tree');
    expect(container.classList.contains('vs-light')).toBe(true);
  });

  it('should handle empty tree', () => {
    fixture.componentRef.setInput('tree', []);
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('should preserve currentFile through re-renders', () => {
    fixture.componentRef.setInput('tree', mockTree);
    component.currentFile.set('src/app.ts');
    fixture.detectChanges();

    expect(component.currentFile()).toBe('src/app.ts');

    fixture.componentRef.setInput('theme', 'vs-light');
    fixture.detectChanges();

    expect(component.currentFile()).toBe('src/app.ts');
  });

  it('should handle color preservation in tree', () => {
    const coloredTree: MonacoTreeElement[] = [
      { name: 'red-file.ts', color: 'red' },
      { name: 'green-file.ts', color: 'green' }
    ];

    fixture.componentRef.setInput('tree', coloredTree);
    fixture.detectChanges();

    const tree = component.tree();
    expect(tree[0].color).toBe('red');
    expect(tree[1].color).toBe('green');
  });

  it('should handle deeply nested structure', () => {
    const deepTree: MonacoTreeElement[] = [
      {
        name: 'level1',
        content: [
          {
            name: 'level2',
            content: [
              {
                name: 'level3.ts'
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
