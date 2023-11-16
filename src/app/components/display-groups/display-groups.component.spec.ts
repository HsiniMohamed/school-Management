import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayGroupsComponent } from './display-groups.component';

describe('DisplayGroupsComponent', () => {
  let component: DisplayGroupsComponent;
  let fixture: ComponentFixture<DisplayGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
