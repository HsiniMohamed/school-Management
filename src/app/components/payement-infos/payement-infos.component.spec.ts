import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayementInfosComponent } from './payement-infos.component';

describe('PayementInfosComponent', () => {
  let component: PayementInfosComponent;
  let fixture: ComponentFixture<PayementInfosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayementInfosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayementInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
