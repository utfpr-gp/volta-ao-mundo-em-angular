import { HttpClient, httpResource } from '@angular/common/http';
import { computed, effect, inject, Resource, Service } from '@angular/core';
import { catchError, debounceTime, EMPTY, firstValueFrom, Subject, switchMap } from 'rxjs';
import { API_URL } from './api';
import { Auth } from './auth';
import { ApiCountry, Country } from './country';
import { Trip } from './trip';

/** A API de países do livro: 195 países, publicada junto com ele. */
export const COUNTRIES_URL = 'https://utfpr-gp.github.io/volta-ao-mundo-em-angular/api/paises.json';
/** As duas tabelas do Passaporte no Supabase, pela API REST dele. */
export const PASSPORTS_URL = `${API_URL}/passports`;
export const TRIPS_URL = `${API_URL}/trips`;
/** As colunas de uma viagem que o app usa (o user_id fica no banco). */
const TRIP_COLUMNS = 'id,country,arrival,days,transport,companion';

/** Uma linha da tabela passports, sem o user_id: o que o app lê e salva. */
interface SavedPassport {
  visited: string[];
  notes: Record<string, string>;
}

const EMPTY_PASSPORT: SavedPassport = { visited: [], notes: {} };

/** A chave da cópia no localStorage: uma por conta, para uma pessoa nunca ver a cópia de outra no mesmo navegador. */
export function copyKey(userId: string): string {
  return `passaporte:${userId}`;
}

/** Lê a cópia guardada no navegador. Se não houver, ou se estiver estragada, começa vazio. */
function readCopy(userId: string): SavedPassport {
  try {
    const text = localStorage.getItem(copyKey(userId));
    return text ? (JSON.parse(text) as SavedPassport) : EMPTY_PASSPORT;
  } catch {
    return EMPTY_PASSPORT;
  }
}

/** O passaporte de quem usa o app: os países vêm da API do livro; o que você marcou fica no Supabase. */
@Service()
export class Passport {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);

  /** Os países da API. O httpResource faz o GET, guarda a resposta e sabe se está carregando ou deu erro. */
  private readonly catalogRef = httpResource<ApiCountry[]>(() => COUNTRIES_URL);

  /**
   * R: o passaporte de quem entrou. Sem login, a função devolve undefined: nenhuma requisição, e o resource fica 'idle'.
   * Quando a pessoa entra ou sai, o signedIn() muda, e o resource pede de novo, sozinho.
   */
  private readonly savedRef = httpResource<SavedPassport | null>(
    () => (this.auth.signedIn() ? { url: PASSPORTS_URL, params: { select: 'visited,notes' } } : undefined), // [!code highlight]
    // A API devolve sempre uma lista: com a linha de quem entrou, ou vazia, se a pessoa ainda não salvou nada.
    { parse: (rows) => (rows as SavedPassport[])[0] ?? null },
  );

  /** R: o diário de quem entrou, da viagem mais recente para a mais antiga. */
  private readonly tripsRef = httpResource<Trip[]>(() =>
    this.auth.signedIn() ? { url: TRIPS_URL, params: { select: TRIP_COLUMNS, order: 'arrival.desc' } } : undefined,
  );

  /** Para fora, a versão somente leitura: as telas olham o status, mas não escrevem. */
  readonly catalog: Resource<ApiCountry[] | undefined> = this.catalogRef.asReadonly();

  /** A cópia do navegador de quem entrou, para quando o Supabase não responder. Sem login, nada. */
  private readonly copy = computed(() => {
    const userId = this.auth.user()?.id;
    return userId ? readCopy(userId) : EMPTY_PASSPORT;
  });

  /** O passaporte que vale: o do Supabase, quando ele responde; senão, a cópia do navegador. */
  private readonly saved = computed<SavedPassport>(() =>
    this.savedRef.hasValue() ? (this.savedRef.value() ?? EMPTY_PASSPORT) : this.copy(),
  );

  readonly countries = computed<Country[]>(() => {
    const countries = this.catalogRef.hasValue() ? this.catalogRef.value() : [];
    const visited = this.saved().visited;
    return countries.map((country) => ({ ...country, visited: visited.includes(country.code) }));
  });
  readonly visitedCount = computed(() => this.saved().visited.length);
  readonly trips = computed(() => (this.tripsRef.hasValue() ? this.tripsRef.value() : []));

  /** Cada letra digitada numa anotação passa por aqui. */
  private readonly noteEdits = new Subject<void>();

  constructor() {
    // Toda vez que o passaporte de quem entrou chega ou muda, uma cópia vai para o navegador, na chave dessa pessoa.
    effect(() => {
      const userId = this.auth.user()?.id;
      if (userId && this.savedRef.hasValue()) localStorage.setItem(copyKey(userId), JSON.stringify(this.saved()));
    });

    // Salvar é uma ação, e não um dado para mostrar: continua com o HttpClient e o RxJS.
    // Se o salvamento falhar, o errorInterceptor já avisou o app; aqui, o catchError só impede que a fila morra.
    this.noteEdits.pipe(debounceTime(500), switchMap(() => this.upsert().pipe(catchError(() => EMPTY)))).subscribe();
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

  saveNote(code: string, text: string): void {
    const saved = this.saved();
    this.savedRef.set({ ...saved, notes: { ...saved.notes, [code.toUpperCase()]: text } });
    if (this.auth.signedIn()) this.noteEdits.next();
  }

  /** C: registra uma viagem no diário e, de quebra, marca o país como visitado. */
  async addTrip(trip: Trip): Promise<void> {
    const { id, ...row } = trip; // o id quem dá é o banco
    // O return=representation pede ao Supabase a linha criada, já com o id.
    const [created] = await firstValueFrom( // [!code highlight]
      this.http.post<Trip[]>(TRIPS_URL, row, { params: { select: TRIP_COLUMNS }, headers: { Prefer: 'return=representation' } }), // [!code highlight]
    ); // [!code highlight]
    this.tripsRef.update((trips) => [created, ...(trips ?? [])]);
    if (!this.saved().visited.includes(trip.country)) this.toggleVisited(trip.country);
  }

  /** U: troca os dados de uma viagem. O filtro id=eq.<id> diz qual linha; sem ele, o Supabase recusa. */
  async updateTrip(trip: Trip): Promise<void> {
    const { id, ...changes } = trip; // o id vai no filtro, e não no corpo: ele não pode mudar
    const [updated] = await firstValueFrom(
      this.http.patch<Trip[]>(TRIPS_URL, changes, { // [!code highlight]
        params: { id: `eq.${id}`, select: TRIP_COLUMNS }, // [!code highlight]
        headers: { Prefer: 'return=representation' },
      }),
    );
    this.tripsRef.update((trips) => trips?.map((t) => (t.id === id ? updated : t)));
  }

  /** D: apaga uma viagem do diário. */
  async deleteTrip(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(TRIPS_URL, { params: { id: `eq.${id}` } })); // [!code highlight]
    this.tripsRef.update((trips) => trips?.filter((t) => t.id !== id));
  }

  private save(): void {
    // Sem login, a mudança fica só nesta visita. O aviso de erro é do errorInterceptor.
    if (this.auth.signedIn()) this.upsert().subscribe({ error: () => {} });
  }

  /** C ou U, conforme o caso: cria a linha do passaporte na primeira vez, e a atualiza nas seguintes (upsert). */
  private upsert() {
    return this.http.post(PASSPORTS_URL, this.saved(), { headers: { Prefer: 'resolution=merge-duplicates' } }); // [!code highlight]
  }
}
