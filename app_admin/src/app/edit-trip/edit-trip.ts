import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import { TripData } from '../services/trip-data';
import { DeclareVarStmt } from '@angular/compiler';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css',
})

export class EditTrip implements OnInit{
  public editForm!: FormGroup;
  submitted = false;
  message : string = '';

  constructor (
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripData
  ) {}

  ngOnInit(): void {
    let tripCode = localStorage.getItem("tripCode");
    if(!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    console.log('EditTrip::ngOnInit');
    console.log('tripcode:' + tripCode);

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      lengthDays: ['', Validators.required],
      lengthNights: ['', Validators.required], 
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
      publicity: [false]
    });

    this.tripDataService.getTrip(tripCode)
      .subscribe({
        next: (value: any) => {
          this.editForm.patchValue(value);
          if(!value)
          {
            this.message = 'No Trip Retrieved!';
          }
          else
          {
            this.message = 'Trip: ' + tripCode + ' retrieved';
          }
          console.log(this.message);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }

  public onSubmit()
  {
    this.submitted = true;

    if(this.editForm.valid)
    {
      this.tripDataService.updateTrip(this.editForm.value)
        .subscribe({
          next: (value: any) => {
            console.log(value);
            this.router.navigate(['']);
          },
          error: (error: any) => {
            console.log('Error: ' + error);
          }
        })
    }
  }

  get f() { return this.editForm.controls; }
}
