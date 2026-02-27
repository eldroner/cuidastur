import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Services } from './components/services/services';
import { Simulator } from './components/simulator/simulator';
import { Contact } from './components/contact/contact';
import { Footer } from './components/footer/footer';
import { LegalModal, LegalType } from './components/legal-modal/legal-modal';
import { CookieBanner } from './components/cookie-banner/cookie-banner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    Header, 
    Hero, 
    About, 
    Services, 
    Simulator, 
    Contact, 
    Footer,
    LegalModal,
    CookieBanner
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('cuidastur');
  protected readonly activeLegalType = signal<LegalType>(null);

  openLegal(type: string) {
    this.activeLegalType.set(type as LegalType);
    document.body.style.overflow = 'hidden';
  }

  closeLegal() {
    this.activeLegalType.set(null);
    document.body.style.overflow = 'auto';
  }

  handleCookieInfo() {
    this.openLegal('cookies');
  }
}
