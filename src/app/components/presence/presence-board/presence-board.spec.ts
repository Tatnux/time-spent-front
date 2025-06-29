import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceBoard } from './presence-board';

describe('PresenceBoard', () => {
  let component: PresenceBoard;
  let fixture: ComponentFixture<PresenceBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresenceBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresenceBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
