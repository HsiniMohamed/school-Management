import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainigSessionComponent } from './trainig-session.component';

describe('TrainigSessionComponent', () => {
  let component: TrainigSessionComponent;
  let fixture: ComponentFixture<TrainigSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainigSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainigSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
