import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Passport } from '../../../core/passport';
import { LocalClock } from '../../../shared/local-clock/local-clock';
import { StarRating } from '../../../shared/star-rating/star-rating';

@Component({
  imports: [DecimalPipe, DatePipe, UpperCasePipe, StarRating, LocalClock],
  selector: 'app-featured-country',
  styleUrl: './featured-country.css',
  templateUrl: './featured-country.html',
})
export class FeaturedCountry {
  private readonly passport = inject(Passport);

  protected readonly country = {
    code: 'JP',
    name: 'Japão',
    capital: 'Tóquio',
    population: 123_000_000,
    flagUrl: 'https://flagcdn.com/w160/jp.png',
    timeZone: 'Asia/Tokyo',
  };

  private readonly noteField = viewChild.required<ElementRef<HTMLInputElement>>('note');

  protected readonly visited = computed(() => this.passport.find(this.country.code)?.visited ?? false);
  protected readonly rating = signal(0);
  protected readonly draft = signal('');
  protected readonly savedNote = signal('');
  protected readonly savedAt = signal<Date | null>(null);

  protected toggleVisited(): void {
    this.passport.toggleVisited(this.country.code);
    if (this.visited()) {
      // Acabou de visitar: leva o cursor direto para a anotação da viagem.
      this.noteField().nativeElement.focus();
    }
  }

  protected onType(text: string): void {
    this.draft.set(text);
  }

  protected saveNote(text: string): void {
    this.savedNote.set(text);
    this.savedAt.set(new Date());
  }
}
