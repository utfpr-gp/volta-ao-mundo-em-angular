import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-featured-country',
  styleUrl: './featured-country.css',
  templateUrl: './featured-country.html',
})
export class FeaturedCountry {
  protected readonly country = {
    name: 'Japão',
    capital: 'Tóquio',
    population: 123_000_000,
    flagUrl: 'https://flagcdn.com/w160/jp.png',
  };

  protected visited = false;
  protected draft = '';
  protected savedNote = '';

  protected toggleVisited(): void {
    this.visited = !this.visited;
  }

  protected onType(text: string): void {
    this.draft = text;
  }

  protected saveNote(text: string): void {
    this.savedNote = text;
  }
}
