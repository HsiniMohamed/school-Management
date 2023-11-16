import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPaymentsComponent } from './display-payments.component';

describe('DisplayPaymentsComponent', () => {
  let component: DisplayPaymentsComponent;
  let fixture: ComponentFixture<DisplayPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
