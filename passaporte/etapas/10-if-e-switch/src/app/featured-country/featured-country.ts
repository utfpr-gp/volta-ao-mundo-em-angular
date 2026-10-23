import { Component, signal } from '@angular/core';

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

  protected readonly visited = signal(false);
  protected readonly draft = signal('');
  protected readonly savedNote = signal('');

  protected toggleVisited(): void {
    this.visited.update((value) => !value);
  }

  protected onType(text: string): void {
    this.draft.set(text);
  }

  protected saveNote(text: string): void {
    this.savedNote.set(text);
  }
}
