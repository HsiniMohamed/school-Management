import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsTeacherComponent } from './groups-teacher.component';

describe('GroupsTeacherComponent', () => {
  let component: GroupsTeacherComponent;
  let fixture: ComponentFixture<GroupsTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
