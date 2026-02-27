import { Component, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.scss'
})
export class CookieBanner implements OnInit {
  isVisible = signal(false);
  accept = output<void>();
  openInfo = output<void>();

  ngOnInit() {
    // Si el usuario no ha aceptado antes, mostramos el banner tras 1 seg
    const accepted = localStorage.getItem('cookies-accepted');
    if (!accepted) {
      setTimeout(() => {
        this.isVisible.set(true);
      }, 1500);
    }
  }

  onAccept() {
    localStorage.setItem('cookies-accepted', 'true');
    this.isVisible.set(false);
    this.accept.emit();
  }

  onOpenInfo(event: Event) {
    event.preventDefault();
    this.openInfo.emit();
  }
}
