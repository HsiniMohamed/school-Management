import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesStudentComponent } from './classes-student.component';

describe('ClassesStudentComponent', () => {
  let component: ClassesStudentComponent;
  let fixture: ComponentFixture<ClassesStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassesStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassesStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
