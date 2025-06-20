import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLogView } from './time-log-view';

describe('TimeLogView', () => {
  let component: TimeLogView;
  let fixture: ComponentFixture<TimeLogView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeLogView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeLogView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
