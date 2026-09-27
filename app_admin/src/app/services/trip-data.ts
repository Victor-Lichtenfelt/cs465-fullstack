import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';

import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';
import { FormGroup } from '@angular/forms';
import { Query } from '../models/query';

@Injectable({
    providedIn: 'root'
})

export class TripData {
    advancedUrl = 'http://localhost:3000/api/trips/advancedQuery';
    url = 'http://localhost:3000/api/trips';
    baseUrl = 'http://localhost:3000/api';

    constructor(
        private http: HttpClient,
        @Inject(BROWSER_STORAGE) private storage: Storage
    ) {}

    // Call to our /login endpoint, returms JWT
    login(user: User, passwd: string) : Observable<AuthResponse> {
        // console.log('Inside TripData::login');
        return this.handleAuthAPICall('login', user, passwd);
    }

    // Call to out /register endpoint, creates user and returns JWT.
    register(user: User, passwed: string) : Observable<AuthResponse> {
        // console.log('Inside TripData::register');
        return this.handleAuthAPICall('register', user, passwed);
    }

    //helper method to process both login and register methods
    handleAuthAPICall(endpoint: string, user: User, passwd: string) : 
    Observable<AuthResponse> {
        // console.log('Inside TripData::handleAuthAPICall');
        let formData = {
            name: user.name,
            email: user.email,
            password: passwd
        };

        return this.http.post<AuthResponse>(this.baseUrl + '/' + endpoint, formData);
    }

    getTrips() : Observable<Trip[]> {
        return this.http.get<Trip[]>(this.url);
    }

    getQueryTrips(formData: Query) : Observable<Trip[]> {
        return this.http.post<Trip[]>(this.advancedUrl, formData);
    }

    addTrip(formData: Trip) : Observable<Trip> {
        return this.http.post<Trip>(this.url, formData);
    }

    getTrip(tripCode: string) : Observable<Trip[]> {
        return this.http.get<Trip[]>(this.url + '/' + tripCode);
    }

    updateTrip(formData: Trip) : Observable<Trip> {
        return this.http.put<Trip>(this.url + '/' + formData.code, formData);
    }
}
