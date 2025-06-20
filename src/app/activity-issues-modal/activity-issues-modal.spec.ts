import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityIssuesModal } from './activity-issues-modal';

describe('ActivityIssuesModal', () => {
  let component: ActivityIssuesModal;
  let fixture: ComponentFixture<ActivityIssuesModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityIssuesModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityIssuesModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
