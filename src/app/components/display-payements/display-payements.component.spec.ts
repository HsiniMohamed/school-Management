import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPayementsComponent } from './display-payements.component';

describe('DisplayPayementsComponent', () => {
  let component: DisplayPayementsComponent;
  let fixture: ComponentFixture<DisplayPayementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayPayementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPayementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
