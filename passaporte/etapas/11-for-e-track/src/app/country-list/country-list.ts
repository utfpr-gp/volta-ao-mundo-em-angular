import { Component, computed, signal } from '@angular/core';
import { Country } from '../country';

type Filter = 'all' | 'visited' | 'wishlist';

@Component({
  imports: [],
  selector: 'app-country-list',
  styleUrl: './country-list.css',
  templateUrl: './country-list.html',
})
export class CountryList {
  protected readonly countries = signal<Country[]>([
    { code: 'BR', name: 'Brasil', capital: 'Brasília', flag: '🇧🇷', visited: true },
    { code: 'JP', name: 'Japão', capital: 'Tóquio', flag: '🇯🇵', visited: false },
    { code: 'PT', name: 'Portugal', capital: 'Lisboa', flag: '🇵🇹', visited: true },
    { code: 'IT', name: 'Itália', capital: 'Roma', flag: '🇮🇹', visited: false },
    { code: 'AR', name: 'Argentina', capital: 'Buenos Aires', flag: '🇦🇷', visited: true },
    { code: 'CA', name: 'Canadá', capital: 'Ottawa', flag: '🇨🇦', visited: false },
  ]);

  protected readonly filter = signal<Filter>('all');

  protected readonly visible = computed(() => {
    const filter = this.filter();
    return this.countries().filter((country) =>
      filter === 'all' ? true : filter === 'visited' ? country.visited : !country.visited,
    );
  });

  protected remove(code: string): void {
    this.countries.update((countries) => countries.filter((country) => country.code !== code));
  }
}
