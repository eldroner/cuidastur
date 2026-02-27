import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
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
      console.log('Datos del formulario:', this.formData);
      
      // Aquí conectaremos con el servicio del backend más adelante
      // Simulamos un envío exitoso
      setTimeout(() => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.resetForm();
      }, 1500);
    }
  }

  isFormValid(): boolean {
    return (
      this.formData.name.length > 2 &&
      this.formData.phone.length >= 9 &&
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
