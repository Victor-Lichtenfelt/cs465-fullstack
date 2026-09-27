import { Routes } from '@angular/router';
import { AddTrip } from './add-trip/add-trip'
import { TripListing } from './trip-listing/trip-listing';
import { TripAdvancedQuerying } from './trip-advanced-querying/trip-advanced-querying';
import { EditTrip } from './edit-trip/edit-trip';
import { Login } from './login/login';

export const routes: Routes = [
    { path: 'add-trip', component: AddTrip},
    { path: 'edit-trip', component: EditTrip},
    { path: 'login', component: Login},
    { path: 'query-trips', component: TripAdvancedQuerying},
    { path: '', component: TripListing, pathMatch: 'full'}
];
