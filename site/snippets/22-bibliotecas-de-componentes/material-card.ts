import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [MatCardModule, MatButtonModule],
  selector: 'app-country-card',
  templateUrl: './country-card.html',
  styleUrl: './country-card.css',
})
export class CountryCard {
  protected readonly visited = signal(false);
}
