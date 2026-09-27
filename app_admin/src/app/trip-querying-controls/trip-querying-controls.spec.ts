import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripQueryingControls } from './trip-querying-controls';

describe('TripQueryingControls', () => {
  let component: TripQueryingControls;
  let fixture: ComponentFixture<TripQueryingControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripQueryingControls],
    }).compileComponents();

    fixture = TestBed.createComponent(TripQueryingControls);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
