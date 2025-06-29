import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceCalendar } from './presence-calendar';

describe('PresenceCalendar', () => {
  let component: PresenceCalendar;
  let fixture: ComponentFixture<PresenceCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresenceCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresenceCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
