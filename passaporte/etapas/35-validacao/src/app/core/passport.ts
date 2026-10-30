import { HttpClient, httpResource } from '@angular/common/http';
import { computed, effect, inject, Resource, Service, signal } from '@angular/core';
import { catchError, debounceTime, EMPTY, Observable, Subject, switchMap } from 'rxjs';
import { ApiCountry, Country } from './country';
import { Trip } from './trip';

/** A API de países do livro: 195 países, publicada junto com ele. */
export const COUNTRIES_URL = 'https://utfpr-gp.github.io/volta-ao-mundo-em-angular/api/paises.json';
/** O json-server rodando no seu computador, com o npm run api. */
export const PASSPORT_URL = 'http://localhost:3000/passport';

/** A chave da cópia do passaporte no localStorage do navegador. */
export const STORAGE_KEY = 'passaporte';

/** O que fica salvo no json-server e no navegador. */
interface SavedPassport {
  visited: string[];
  notes: Record<string, string>;
  /** Opcional: passaportes salvos antes do diário de viagens não têm. */
  trips?: Trip[];
}

/** Lê a cópia guardada no navegador. Se não houver, ou se estiver estragada, começa vazio. */
function readCopy(): SavedPassport {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    return text ? (JSON.parse(text) as SavedPassport) : { visited: [], notes: {} };
  } catch {
    return { visited: [], notes: {} };
  }
}

/** O passaporte de quem usa o app: os países vêm da API; o que você marcou fica salvo no json-server. */
@Service()
export class Passport {
  private readonly http = inject(HttpClient);

  /** Os países da API. O httpResource faz o GET, guarda a resposta e sabe se está carregando ou deu erro. */
  private readonly catalogRef = httpResource<ApiCountry[]>(() => COUNTRIES_URL);
  /** O passaporte salvo no json-server. */
  private readonly savedRef = httpResource<SavedPassport>(() => PASSPORT_URL);

  /** Para fora, a versão somente leitura: as telas olham o status, mas não escrevem. */
  readonly catalog: Resource<ApiCountry[] | undefined> = this.catalogRef.asReadonly();

  /** A cópia do navegador, lida uma vez, ao abrir o app. */
  private readonly copy = readCopy();

  /** O passaporte que vale: o do json-server, quando ele responde; senão, a cópia do navegador. */
  private readonly saved = computed<SavedPassport>(() => (this.savedRef.hasValue() ? this.savedRef.value() : this.copy));
  private readonly putFailed = signal(false);

  /** O aviso no topo: o passaporte salvo não veio, ou o último PUT falhou. */
  readonly saveFailed = computed(() => this.savedRef.status() === 'error' || this.putFailed());

  readonly countries = computed<Country[]>(() => {
    const countries = this.catalogRef.hasValue() ? this.catalogRef.value() : [];
    const visited = this.saved().visited;
    return countries.map((country) => ({ ...country, visited: visited.includes(country.code) }));
  });
  readonly visitedCount = computed(() => this.saved().visited.length);
  readonly trips = computed(() => this.saved().trips ?? []);

  /** Cada letra digitada numa anotação passa por aqui. */
  private readonly noteEdits = new Subject<void>();

  constructor() {
    // Toda vez que o passaporte muda, uma cópia vai para o navegador. É um efeito colateral: escreve fora do Angular.
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.saved()));
    });

    // Salvar é uma ação, e não um dado para mostrar: continua com o HttpClient e o RxJS.
    this.noteEdits
      .pipe(
        debounceTime(500),
        switchMap(() =>
          this.put().pipe(
            catchError(() => {
              this.putFailed.set(true);
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe(() => this.putFailed.set(false));
  }

  /** Pede os países de novo, por exemplo depois de um erro de rede. */
  reloadCountries(): void {
    this.catalogRef.reload();
  }

  find(code: string): Country | undefined {
    return this.countries().find((country) => country.code === code.toUpperCase());
  }

  note(code: string): string {
    return this.saved().notes[code.toUpperCase()] ?? '';
  }

  toggleVisited(code: string): void {
    const upper = code.toUpperCase();
    const saved = this.saved();
    // Escrever no value põe o resource no estado 'local': o valor agora é nosso, não o da última resposta.
    this.savedRef.set({
      ...saved,
      visited: saved.visited.includes(upper) ? saved.visited.filter((c) => c !== upper) : [...saved.visited, upper],
    });
    this.save();
  }

  /** Tira o país da lista só nesta visita: não é salvo, e ele volta ao recarregar a página. */
  remove(code: string): void {
    if (!this.catalogRef.hasValue()) return;
    this.catalogRef.update((countries) => countries?.filter((country) => country.code !== code.toUpperCase()));
  }

  /** Registra uma viagem no diário e, de quebra, marca o país como visitado. */
  addTrip(trip: Trip): void {
    const { visited, notes, trips = [] } = this.saved();
    this.savedRef.set({
      notes,
      visited: visited.includes(trip.country) ? visited : [...visited, trip.country],
      trips: [...trips, trip],
    });
    this.save();
  }

  saveNote(code: string, text: string): void {
    const saved = this.saved();
    this.savedRef.set({ ...saved, notes: { ...saved.notes, [code.toUpperCase()]: text } });
    this.noteEdits.next();
  }

  private save(): void {
    this.put().subscribe({
      next: () => this.putFailed.set(false),
      error: () => this.putFailed.set(true),
    });
  }

  private put(): Observable<SavedPassport> {
    return this.http.put<SavedPassport>(PASSPORT_URL, this.saved());
  }
}
