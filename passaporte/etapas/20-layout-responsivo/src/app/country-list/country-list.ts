import { Component, computed, signal } from '@angular/core';
import { Country } from '../country';
import { CountryCard } from '../country-card/country-card';
import { Panel } from '../panel/panel';

type Filter = 'all' | 'visited' | 'wishlist';

@Component({
  imports: [CountryCard, Panel],
  selector: 'app-country-list',
  templateUrl: './country-list.html',
})
export class CountryList {
  protected readonly countries = signal<Country[]>([
    { code: 'BR', name: 'Brasil', capital: 'Brasília', visited: true },
    { code: 'JP', name: 'Japão', capital: 'Tóquio', visited: false },
    { code: 'PT', name: 'Portugal', capital: 'Lisboa', visited: true },
    { code: 'IT', name: 'Itália', capital: 'Roma', visited: false },
    { code: 'AR', name: 'Argentina', capital: 'Buenos Aires', visited: true },
    { code: 'CA', name: 'Canadá', capital: 'Ottawa', visited: false },
  ]);

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
