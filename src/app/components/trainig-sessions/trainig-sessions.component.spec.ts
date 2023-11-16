import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainigSessionsComponent } from './trainig-sessions.component';

describe('TrainigSessionsComponent', () => {
  let component: TrainigSessionsComponent;
  let fixture: ComponentFixture<TrainigSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainigSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainigSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
