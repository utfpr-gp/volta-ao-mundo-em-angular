import { Component, computed, signal } from '@angular/core';
import { Country } from '../../../core/country';
import { COUNTRIES } from '../../../core/countries';
import { CountryCard } from '../country-card/country-card';
import { Panel } from '../../../shared/panel/panel';
import { StampBook } from '../stamp-book/stamp-book';

type Filter = 'all' | 'visited' | 'wishlist';

@Component({
  imports: [CountryCard, Panel, StampBook],
  selector: 'app-country-list',
  templateUrl: './country-list.html',
})
export class CountryList {
  protected readonly countries = signal<Country[]>(COUNTRIES);

  protected readonly filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'visited', label: 'Visitados' },
    { value: 'wishlist', label: 'Desejados' },
  ];

  protected readonly filter = signal<Filter>('all');

  protected readonly visible = computed(() => {
    const filter = this.filter();
    return this.countries().filter((country) =>
      filter === 'all' ? true : filter === 'visited' ? country.visited : !country.visited,
    );
  });

  protected toggleVisited(code: string): void {
    this.countries.update((countries) =>
      countries.map((country) => (country.code === code ? { ...country, visited: !country.visited } : country)),
    );
  }

  protected remove(code: string): void {
    this.countries.update((countries) => countries.filter((country) => country.code !== code));
  }
}
