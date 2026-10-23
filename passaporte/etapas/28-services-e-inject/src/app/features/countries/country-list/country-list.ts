import { Component, computed, inject, signal } from '@angular/core';
import { Passport } from '../../../core/passport';
import { CountryCard } from '../country-card/country-card';
import { Panel } from '../../../shared/panel/panel';

type Filter = 'all' | 'visited' | 'wishlist';

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

  protected readonly visible = computed(() => {
    const filter = this.filter();
    return this.countries().filter((country) =>
      filter === 'all' ? true : filter === 'visited' ? country.visited : !country.visited,
    );
  });
}
