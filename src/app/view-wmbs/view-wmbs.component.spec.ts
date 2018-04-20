import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWmbsComponent } from './view-wmbs.component';

describe('ViewWmbsComponent', () => {
  let component: ViewWmbsComponent;
  let fixture: ComponentFixture<ViewWmbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWmbsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWmbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
