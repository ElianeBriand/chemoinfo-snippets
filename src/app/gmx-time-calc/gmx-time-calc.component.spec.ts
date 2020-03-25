import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmxTimeCalcComponent } from './gmx-time-calc.component';

describe('GmxTimeCalcComponent', () => {
  let component: GmxTimeCalcComponent;
  let fixture: ComponentFixture<GmxTimeCalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmxTimeCalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmxTimeCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
