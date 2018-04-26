import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomdayComponent } from './add-customday.component';

describe('AddCustomdayComponent', () => {
  let component: AddCustomdayComponent;
  let fixture: ComponentFixture<AddCustomdayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomdayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
