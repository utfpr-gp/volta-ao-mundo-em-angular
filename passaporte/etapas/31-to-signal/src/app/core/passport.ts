import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { catchError, debounceTime, EMPTY, Observable, Subject, switchMap } from 'rxjs';
import { ApiCountry, Country } from './country';

/** A API de países do livro: 195 países, publicada junto com ele. */
export const COUNTRIES_URL = 'https://utfpr-gp.github.io/volta-ao-mundo-em-angular/api/paises.json';
/** O json-server rodando no seu computador, com o npm run api. */
export const PASSPORT_URL = 'http://localhost:3000/passport';

/** O que fica salvo no json-server. */
interface SavedPassport {
  visited: string[];
  notes: Record<string, string>;
}

/** O passaporte de quem usa o app: os países vêm da API; o que você marcou fica salvo no json-server. */
@Service()
export class Passport {
  private readonly http = inject(HttpClient);

  private readonly catalog = signal<ApiCountry[]>([]);
  private readonly visitedCodes = signal<string[]>([]);
  private readonly notesState = signal<Record<string, string>>({});

  readonly status = signal<'carregando' | 'pronto' | 'erro'>('carregando');
  readonly saveFailed = signal(false);

  readonly countries = computed<Country[]>(() =>
    this.catalog().map((country) => ({ ...country, visited: this.visitedCodes().includes(country.code) })),
  );
  readonly visitedCount = computed(() => this.visitedCodes().length);

  /** Cada letra digitada numa anotação passa por aqui. */
  private readonly noteEdits = new Subject<void>();

  constructor() {
    // Espera a pessoa parar de digitar por meio segundo e só então salva. Se um PUT ainda estiver a caminho quando
    // outro começar, o switchMap cancela o antigo. O catchError segura o erro para o caminho não morrer com ele.
    this.noteEdits
      .pipe(
        debounceTime(500),
        switchMap(() =>
          this.put().pipe(
            catchError(() => {
              this.saveFailed.set(true);
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe(() => this.saveFailed.set(false));
    this.load();
  }

  /** Busca os países e o passaporte salvo. Também serve para tentar de novo depois de um erro. */
  load(): void {
    this.status.set('carregando');
    this.http.get<ApiCountry[]>(COUNTRIES_URL).subscribe({
      next: (countries) => {
        this.catalog.set(countries);
        this.status.set('pronto');
      },
      error: () => this.status.set('erro'),
    });
    this.http.get<SavedPassport>(PASSPORT_URL).subscribe({
      next: (saved) => {
        this.visitedCodes.set(saved.visited);
        this.notesState.set(saved.notes);
        this.saveFailed.set(false);
      },
      error: () => this.saveFailed.set(true),
    });
  }

  find(code: string): Country | undefined {
    return this.countries().find((country) => country.code === code.toUpperCase());
  }

  note(code: string): string {
    return this.notesState()[code.toUpperCase()] ?? '';
  }

  toggleVisited(code: string): void {
    const upper = code.toUpperCase();
    this.visitedCodes.update((codes) => (codes.includes(upper) ? codes.filter((c) => c !== upper) : [...codes, upper]));
    this.save();
  }

  /** Tira o país da lista só nesta visita: não é salvo, e ele volta ao recarregar a página. */
  remove(code: string): void {
    this.catalog.update((countries) => countries.filter((country) => country.code !== code.toUpperCase()));
  }

  saveNote(code: string, text: string): void {
    this.notesState.update((notes) => ({ ...notes, [code.toUpperCase()]: text }));
    this.noteEdits.next();
  }

  private save(): void {
    this.put().subscribe({
      next: () => this.saveFailed.set(false),
      error: () => this.saveFailed.set(true),
    });
  }

  private put(): Observable<SavedPassport> {
    const body: SavedPassport = { visited: this.visitedCodes(), notes: this.notesState() };
    return this.http.put<SavedPassport>(PASSPORT_URL, body);
  }
}
