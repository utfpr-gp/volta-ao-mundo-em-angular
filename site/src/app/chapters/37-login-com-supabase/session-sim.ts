import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface SimSession {
  email: string;
  /** Minuto, no relógio do simulador, em que o token vence. */
  expiresAt: number;
  refreshes: number;
}

const EMAIL = 'ana@exemplo.com';
const STORAGE_KEY = 'sb-abcdwxyz-auth-token';
/** O token de acesso dura 60 minutos; o Supabase o renova sozinho um pouco antes. */
const TOKEN_MINUTES = 60;

/** Simulador do capítulo 37: a vida de uma sessão do Supabase, com os avisos do onAuthStateChange e o que fica guardado no navegador. */
@Component({
  selector: 'vm-session-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">A vida de uma sessão</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Entre, recarregue a página, deixe o tempo passar e saia. Repare em quais avisos o Supabase manda, no que o service
          guarda e no que fica no navegador.
        </span>
      </figcaption>

      <div class="flex flex-wrap gap-2">
        <button type="button" class="rounded-full border border-line px-3 py-1 font-mono text-xs font-bold" (click)="signIn(true)">
          signInWithPassword (senha certa)
        </button>
        <button type="button" class="rounded-full border border-line px-3 py-1 font-mono text-xs font-bold" (click)="signIn(false)">
          signInWithPassword (senha errada)
        </button>
        <button type="button" class="rounded-full border border-line px-3 py-1 text-xs font-bold" (click)="reload()">
          ⟳ Recarregar a página
        </button>
        <button type="button" class="rounded-full border border-line px-3 py-1 text-xs font-bold" (click)="passHour()">
          ⏱ Passar 1 hora
        </button>
        <button type="button" class="rounded-full border border-line px-3 py-1 font-mono text-xs font-bold" (click)="signOut()">
          signOut()
        </button>
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border border-line bg-surface-raised p-4 text-ink">
          <span class="block text-sm font-bold">Os avisos do onAuthStateChange</span>
          <ol data-events class="mt-2 flex flex-col gap-1 font-mono text-xs">
            @for (event of events(); track $index) {
              <li>{{ event }}</li>
            } @empty {
              <li class="text-ink-muted">(nenhum aviso ainda)</li>
            }
          </ol>
        </div>

        <pre data-state class="overflow-x-auto rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">auth.signedIn(): {{ session() !== null }}
auth.user()?.email: {{ session() ? '"' + session()!.email + '"' : 'undefined' }}

localStorage['{{ storageKey }}']:
  {{ storedText() }}

o token, decodificado:
  {{ tokenText() }}</pre>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ events().at(-1) }}</p>
    </figure>
  `,
})
export class SessionSim {
  protected readonly storageKey = STORAGE_KEY;

  /** O relógio do simulador, em minutos. */
  private readonly clock = signal(0);
  /** O que o Supabase guardou no navegador: sobrevive ao "recarregar". */
  private readonly stored = signal<SimSession | null>(null);
  /** O que o service tem na memória: some ao recarregar, até o Supabase reler o navegador. */
  protected readonly session = signal<SimSession | null>(null);
  protected readonly events = signal<string[]>([]);

  protected readonly storedText = computed(() => {
    const stored = this.stored();
    return stored ? `{ access_token: "eyJhbGciOi…", refresh_token: "…", user: { email: "${stored.email}" } }` : 'null';
  });

  protected readonly tokenText = computed(() => {
    const session = this.session();
    return session ? `{ email: "${session.email}", role: "authenticated", vence: "minuto ${session.expiresAt}" }` : '(sem token)';
  });

  protected signIn(rightPassword: boolean): void {
    if (!rightPassword) {
      this.log('(nenhum aviso: o signIn devolveu error.code "invalid_credentials")');
      return;
    }
    const session = { email: EMAIL, expiresAt: this.clock() + TOKEN_MINUTES, refreshes: 0 };
    this.stored.set(session);
    this.session.set(session);
    this.log('SIGNED_IN');
  }

  protected reload(): void {
    // A memória do app recomeça do zero; o Supabase lê o navegador e avisa o que achou.
    this.session.set(null);
    this.log('— página recarregada —');
    this.session.set(this.stored());
    this.log(this.stored() ? 'INITIAL_SESSION (achou a sessão guardada)' : 'INITIAL_SESSION (sem sessão)');
  }

  protected passHour(): void {
    this.clock.update((minutes) => minutes + 60);
    const session = this.session();
    if (!session) {
      this.log('(uma hora passou; ninguém estava logado)');
      return;
    }
    const renewed = { ...session, expiresAt: this.clock() + TOKEN_MINUTES, refreshes: session.refreshes + 1 };
    this.stored.set(renewed);
    this.session.set(renewed);
    this.log('TOKEN_REFRESHED');
  }

  protected signOut(): void {
    this.stored.set(null);
    this.session.set(null);
    this.log('SIGNED_OUT');
  }

  private log(event: string): void {
    this.events.update((events) => [...events, event]);
  }
}
