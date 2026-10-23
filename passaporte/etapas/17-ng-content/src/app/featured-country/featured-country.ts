import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { StarRating } from '../star-rating/star-rating';

@Component({
  imports: [DecimalPipe, DatePipe, UpperCasePipe, StarRating],
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
  protected readonly rating = signal(0);
  protected readonly draft = signal('');
  protected readonly savedNote = signal('');
  protected readonly savedAt = signal<Date | null>(null);

  protected toggleVisited(): void {
    this.visited.update((value) => !value);
  }

  protected onType(text: string): void {
    this.draft.set(text);
  }

  protected saveNote(text: string): void {
    this.savedNote.set(text);
    this.savedAt.set(new Date());
  }
}
