import { Component,  OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripCard } from '../trip-card/trip-card';

import { TripData } from '../services/trip-data'
import { Trip } from '../models/trip';

import { Router } from '@angular/router';

import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCard],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
  providers: [TripData]
})

export class TripListing implements OnInit {

  trips!: Trip[];
  message: string = '';

  constructor(
    private tripData: TripData,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private authenticationService: Authentication
  ) {
    console.log('trip-listing constructor');
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  private getStuff(): void {
    this.tripData.getTrips()
      .subscribe({
        next: (value: any) => {
          this.trips = value;
          if(value.length > 0)
          {
            this.message = 'There are ' + value.length + ' trips available.';
            for(const part of this.trips)
            {
              console.log(part);
            }
          }
          else
          {
            this.message = 'There were no trips retireved from the database';
          }
          console.log(this.message);
          this.changeDetector.markForCheck();
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      })
  }

  public isLoggedIn()
  {
    return this.authenticationService.isLoggedIn();
  }

  ngOnInit(): void {
    console.log('trip-listing::ngOnInit');
    this.getStuff();
    
  }
}

