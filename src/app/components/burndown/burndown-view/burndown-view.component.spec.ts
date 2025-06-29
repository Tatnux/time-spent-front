import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurndownViewComponent } from './burndown-view.component';

describe('BurndownViewComponent', () => {
  let component: BurndownViewComponent;
  let fixture: ComponentFixture<BurndownViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BurndownViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BurndownViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});