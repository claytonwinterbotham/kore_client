import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatecustomdayComponent } from './createcustomday.component';

describe('CreatecustomdayComponent', () => {
  let component: CreatecustomdayComponent;
  let fixture: ComponentFixture<CreatecustomdayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatecustomdayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatecustomdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
