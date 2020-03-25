import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YamlCardViewerComponent } from './yaml-card-viewer.component';

describe('YamlCardViewerComponent', () => {
  let component: YamlCardViewerComponent;
  let fixture: ComponentFixture<YamlCardViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YamlCardViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YamlCardViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
