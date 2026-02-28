import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  formData = {
    name: '',
    phone: '',
    email: '',
    message: '',
    privacy: false
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  onSubmit() {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      this.submitError = false;
      this.submitSuccess = false;
      
      this.http.post('https://cuidastur.com/contacto-directo', this.formData)
        .subscribe({
          next: () => {
            console.log('Envío exitoso detectado');
            this.isSubmitting = false;
            this.submitSuccess = true;
            this.resetForm();
            this.cdr.detectChanges(); // Forzar actualización visual
            
            // Ocultar el mensaje de éxito automáticamente después de 5 segundos
            setTimeout(() => {
              this.submitSuccess = false;
              this.cdr.detectChanges();
            }, 5000);
          },
          error: (err) => {
            console.error('Error al enviar el formulario:', err);
            this.isSubmitting = false;
            this.submitError = true;
            this.cdr.detectChanges();
          }
        });
    }
  }

  isFormValid(): boolean {
    return (
      this.formData.name.trim().length > 2 &&
      this.formData.phone.trim().length >= 9 &&
      this.formData.privacy === true
    );
  }

  private resetForm() {
    this.formData = {
      name: '',
      phone: '',
      email: '',
      message: '',
      privacy: false
    };
  }
}
