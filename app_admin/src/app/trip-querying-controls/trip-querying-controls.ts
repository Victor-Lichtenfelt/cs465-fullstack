import { Component,  OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Communication } from '../services/communication';

@Component({
  selector: 'app-trip-querying-controls',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trip-querying-controls.html',
  styleUrl: './trip-querying-controls.css',
})

export class TripQueryingControls implements OnInit {
  public queryForm!: FormGroup;

  constructor (
    private formBuilder: FormBuilder,
    private sending: Communication
  ) {}

  ngOnInit() {
    console.log('trip-querying-controls::ngOnInit');
     this.queryForm = this.formBuilder.group({
      _id: [], 
      beginAcceptableDate: [''], 
      endAcceptableDate: [''],
      /*, 
      beginAcceptablePrice: [''], 
      endAcceptablePrice: ['']
      beginAcceptableQuality: [''], 
      endAcceptableQuality: [''], 
      beginAcceptableLength: [''], 
      endAcceptableLength: ['']
      */
     });
  }

  

  public onSubmit(): void {
    console.log('trip-querying-controls::onSubmit');
    this.sending.data = this.queryForm;
  }


}
