import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTimeslipComponent } from './view-timeslip.component';

describe('ViewTimeslipComponent', () => {
  let component: ViewTimeslipComponent;
  let fixture: ComponentFixture<ViewTimeslipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTimeslipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTimeslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
