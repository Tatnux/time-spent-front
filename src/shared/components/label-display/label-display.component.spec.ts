import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelDisplay } from './label-display.component';

describe('Tag', () => {
  let component: LabelDisplay;
  let fixture: ComponentFixture<LabelDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
