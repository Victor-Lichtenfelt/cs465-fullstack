import { Component,  OnInit, ChangeDetectorRef } from '@angular/core';

import { TripQueryingControls } from '../trip-querying-controls/trip-querying-controls';
import { TripCard } from '../trip-card/trip-card';

import { TripData } from '../services/trip-data'
import { Trip } from '../models/trip';

import { Router } from '@angular/router';

import { Authentication } from '../services/authentication';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Communication } from '../services/communication';


@Component({
  selector: 'app-trip-advanced-querying',
  imports: [CommonModule, TripCard, TripQueryingControls],
  templateUrl: './trip-advanced-querying.html',
  styleUrl: './trip-advanced-querying.css',
  providers: [TripData, TripQueryingControls]
})

export class TripAdvancedQuerying implements OnInit {

  trips!: Trip[];
  message: string = '';

    constructor(
      private tripData: TripData,
      private changeDetector: ChangeDetectorRef,
      private recieved: Communication
    ) {
      console.log('trip-advanced-querying constructor');
      this.recieved.whenInfoChanged.subscribe(change => this.updateQuery(change))
    }


  updateQuery($event: FormGroup) : void
  {
    console.log('button-click gets here');
    this.tripData.getQueryTrips($event.value)
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
      });
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
      });
  }

  ngOnInit(): void {
    this.getStuff();
  }
}
