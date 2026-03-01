import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  private autocompleteService: any;
  private distanceMatrixService: any;
  private geocoder: any;

  constructor() {
    this.checkGoogleStatus();
  }

  private checkGoogleStatus(): void {
    if (typeof google !== 'undefined' && google.maps) {
      this.initServices();
    } else {
      // Reintentar cada 500ms hasta que la API esté cargada
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (typeof google !== 'undefined' && google.maps) {
          this.initServices();
          clearInterval(interval);
        }
        if (attempts > 10) clearInterval(interval);
      }, 500);
    }
  }

  private initServices(): void {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.distanceMatrixService = new google.maps.DistanceMatrixService();
    this.geocoder = new google.maps.Geocoder();
  }

  getPlacePredictions(input: string): Observable<any[]> {
    const predictionsSubject = new Subject<any[]>();
    if (!this.autocompleteService) {
      predictionsSubject.next([]);
      return predictionsSubject.asObservable();
    }

    this.autocompleteService.getPlacePredictions(
      { 
        input: input, 
        componentRestrictions: { country: 'es' },
        locationBias: { radius: 50000, center: { lat: 43.5562, lng: -5.9248 } } // Bias towards Avilés
      },
      (predictions: any[], status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          predictionsSubject.next(predictions);
        } else {
          predictionsSubject.next([]);
        }
        predictionsSubject.complete();
      }
    );
    return predictionsSubject.asObservable();
  }

  getDistance(origin: string, destination: string): Observable<any> {
    const distanceSubject = new Subject<any>();
    if (!this.distanceMatrixService) {
      distanceSubject.error('Distance service not initialized.');
      return distanceSubject.asObservable();
    }

    this.distanceMatrixService.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response: any, status: any) => {
        if (status === google.maps.DistanceMatrixStatus.OK) {
          const distance = response.rows[0].elements[0].distance;
          distanceSubject.next(distance);
        } else {
          distanceSubject.error('Error fetching distance: ' + status);
        }
        distanceSubject.complete();
      }
    );
    return distanceSubject.asObservable();
  }
}
