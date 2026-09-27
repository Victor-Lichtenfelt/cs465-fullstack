import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripAdvancedQuerying } from './trip-advanced-querying';

describe('TripAdvancedQuerying', () => {
  let component: TripAdvancedQuerying;
  let fixture: ComponentFixture<TripAdvancedQuerying>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripAdvancedQuerying],
    }).compileComponents();

    fixture = TestBed.createComponent(TripAdvancedQuerying);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
