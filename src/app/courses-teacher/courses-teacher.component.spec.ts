import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesTeacherComponent } from './courses-teacher.component';

describe('CoursesTeacherComponent', () => {
  let component: CoursesTeacherComponent;
  let fixture: ComponentFixture<CoursesTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
