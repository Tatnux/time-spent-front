import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLogChart } from './time-log-chart';

describe('TimeLogChart', () => {
  let component: TimeLogChart;
  let fixture: ComponentFixture<TimeLogChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeLogChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeLogChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
