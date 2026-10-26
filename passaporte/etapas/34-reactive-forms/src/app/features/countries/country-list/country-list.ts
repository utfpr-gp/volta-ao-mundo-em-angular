import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
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

  /** O que está escrito no campo de busca, letra a letra. */
  protected readonly searchText = signal('');

  /** O termo que vale: o signal vira Observable, passa pela esteira e volta a ser signal. */
  protected readonly term = toSignal(
    toObservable(this.searchText).pipe(
      map(simplify),
      filter((text) => text.length !== 1),
      debounceTime(300),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

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
