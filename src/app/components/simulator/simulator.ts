import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulator.html',
  styleUrl: './simulator.scss',
})
export class Simulator implements OnInit {
  hours: number = 2;
  pricePerHour: number = 15;
  minHours: number = 2;
  showTooltip: boolean = true;
  isPulsing: boolean = true;

  ngOnInit() {
    // El tooltip desaparecerá después de 5 segundos, coincidiendo con la animación CSS
    setTimeout(() => {
      this.showTooltip = false;
    }, 5000);

    // El parpadeo/pulso también se detiene después de un tiempo para no distraer demasiado
    setTimeout(() => {
      this.isPulsing = false;
    }, 10000);
  }

  getTotal(): number {
    return this.hours * this.pricePerHour;
  }

  updateHours(event: any) {
    this.hours = event.target.value;
    // Si el usuario ya interactuó, quitamos el pulso de aviso
    this.isPulsing = false;
    this.showTooltip = false;
  }
}
