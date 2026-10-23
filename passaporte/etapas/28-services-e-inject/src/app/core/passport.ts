import { computed, Service, signal } from '@angular/core';
import { COUNTRIES } from './countries';
import { Country } from './country';

/** O passaporte de quem usa o app: os países, quais foram visitados e as anotações. Um só para o app inteiro. */
@Service()
export class Passport {
  // Só o service muda o estado; quem está de fora lê pelas versões somente leitura.
  private readonly countriesState = signal<Country[]>(COUNTRIES);
  private readonly notesState = signal<Record<string, string>>({});

  readonly countries = this.countriesState.asReadonly();
  readonly visitedCount = computed(() => this.countriesState().filter((country) => country.visited).length);

  find(code: string): Country | undefined {
    return this.countriesState().find((country) => country.code === code.toUpperCase());
  }

  note(code: string): string {
    return this.notesState()[code.toUpperCase()] ?? '';
  }

  toggleVisited(code: string): void {
    this.countriesState.update((countries) =>
      countries.map((country) =>
        country.code === code.toUpperCase() ? { ...country, visited: !country.visited } : country,
      ),
    );
  }

  remove(code: string): void {
    this.countriesState.update((countries) => countries.filter((country) => country.code !== code.toUpperCase()));
  }

  saveNote(code: string, text: string): void {
    this.notesState.update((notes) => ({ ...notes, [code.toUpperCase()]: text }));
  }
}
