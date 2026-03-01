import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsService } from '../../services/google-maps.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

declare const google: any;

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulator.html',
  styleUrl: './simulator.scss',
})
export class Simulator implements OnInit {
  private mapsService = inject(GoogleMapsService);
  private cdr = inject(ChangeDetectorRef);
  
  hours: number = 2;
  daysPerWeek: number = 1; // Nueva propiedad
  pricePerHour: number = 15;
  minHours: number = 2;
  showTooltip: boolean = true;
  isPulsing: boolean = true;
  isMapsApiLoaded: boolean = false;

  // Nuevas propiedades para distancia
  address: string = '';
  predictions: any[] = [];
  distanceKm: number = 0;
  extraDistanceCost: number = 0;
  referencePoint: string = 'Plaza de España, Avilés, Asturias, España'; // Centro de Avilés
  
  private searchSubject = new Subject<string>();

  ngOnInit() {
    // Comprobar si la API de Google Maps está disponible (con reintentos)
    this.checkApiStatus();

    // Configurar búsqueda de direcciones con debounce para no saturar la API
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(input => this.mapsService.getPlacePredictions(input))
    ).subscribe(predictions => {
      this.predictions = predictions;
      this.cdr.detectChanges();
    });

    setTimeout(() => {
      this.showTooltip = false;
      this.cdr.detectChanges();
    }, 5000);

    setTimeout(() => {
      this.isPulsing = false;
      this.cdr.detectChanges();
    }, 10000);
  }

  private checkApiStatus() {
    const check = () => {
      if (typeof google !== 'undefined' && google.maps) {
        this.isMapsApiLoaded = true;
        this.cdr.detectChanges();
        return true;
      }
      return false;
    };

    if (!check()) {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (check() || count > 10) clearInterval(interval);
      }, 500);
    }
  }

  onAddressInput(event: any) {
    const value = event.target.value;
    this.address = value;
    if (value.length > 3) {
      this.searchSubject.next(value);
    } else {
      this.predictions = [];
    }
  }

  selectPrediction(prediction: any) {
    this.address = prediction.description;
    this.predictions = [];
    
    // Calcular distancia
    this.mapsService.getDistance(this.referencePoint, this.address).subscribe({
      next: (distance) => {
        if (distance) {
          // Convertir metros a KM
          this.distanceKm = Math.round(distance.value / 1000);
          this.calculateExtraCost();
        }
      },
      error: (err) => console.error('Error calculando distancia:', err)
    });
  }

  calculateExtraCost() {
    const FREE_RADIUS = 10;
    const COST_PER_KM = 0.50; // Coste por km extra

    if (this.distanceKm > FREE_RADIUS) {
      const extraKm = this.distanceKm - FREE_RADIUS;
      // Ida y vuelta (extraKm * 2) multiplicado por los días a la semana
      this.extraDistanceCost = (extraKm * 2) * COST_PER_KM * this.daysPerWeek;
    } else {
      this.extraDistanceCost = 0;
    }
  }

  getTotal(): number {
    return (this.hours * this.pricePerHour) + this.extraDistanceCost;
  }

  updateHours(event: any) {
    this.hours = parseInt(event.target.value);
    this.isPulsing = false;
    this.showTooltip = false;
  }

  updateDays(days: number) {
    this.daysPerWeek = days;
    if (this.distanceKm > 0) {
      this.calculateExtraCost();
    }
  }
}
