import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, map, Subject } from 'rxjs';
import { Passport } from '../../../core/passport';
import { CountryCard } from '../country-card/country-card';
import { Panel } from '../../../shared/panel/panel';

type Filter = 'all' | 'visited' | 'wishlist';

/** "Japão" e "japao" viram a mesma coisa: sem acento e em minúsculas. */
function simplify(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

@Component({
  imports: [CountryCard, Panel],
  selector: 'app-country-list',
  templateUrl: './country-list.html',
})
export class CountryList {
  protected readonly passport = inject(Passport);
  protected readonly countries = this.passport.countries;

  protected readonly filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'visited', label: 'Visitados' },
    { value: 'wishlist', label: 'Desejados' },
  ];

  protected readonly filter = signal<Filter>('all');

  /** Cada letra digitada na busca entra aqui. */
  protected readonly typed = new Subject<string>();
  /** O termo que vale, depois de a pessoa parar de digitar. */
  protected readonly term = signal('');

  constructor() {
    this.typed
      .pipe(
        map(simplify),
        filter((text) => text.length !== 1),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((text) => this.term.set(text));
  }

  protected readonly visible = computed(() => {
    const chosen = this.filter();
    const term = this.term();
    return this.countries().filter(
      (country) =>
        (chosen === 'all' ? true : chosen === 'visited' ? country.visited : !country.visited) &&
        simplify(country.name).includes(term),
    );
  });
}
