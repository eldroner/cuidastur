import { Component, output } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  openLegal = output<string>();

  onOpenLegal(type: string, event: Event) {
    event.preventDefault();
    this.openLegal.emit(type);
  }
}
