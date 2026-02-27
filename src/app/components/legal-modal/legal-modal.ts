import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LegalType = 'aviso' | 'privacidad' | 'cookies' | null;

@Component({
  selector: 'app-legal-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-modal.html',
  styleUrl: './legal-modal.scss'
})
export class LegalModal {
  type = input<LegalType>(null);
  close = output<void>();

  onClose() {
    this.close.emit();
  }
}
