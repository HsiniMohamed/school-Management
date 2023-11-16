import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsStudentComponent } from './payments-student.component';

describe('PaymentsStudentComponent', () => {
  let component: PaymentsStudentComponent;
  let fixture: ComponentFixture<PaymentsStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
