import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Mode = 'um' | 'copias';
type ScreenId = 'lista' | 'pais' | 'passaporte';

/** Um "passaporte" em miniatura: só o Japão muda, os outros três já estão visitados. */
interface MiniPassport {
  japanVisited: boolean;
}

/** Simulador do capítulo 28: três telas lendo o mesmo service, ou cada uma com a sua cópia. */
@Component({
  selector: 'vm-service-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Um passaporte para todas as telas</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Marque o Japão como visitado em qualquer tela. Com um service só, todas acompanham; com uma cópia por tela, cada uma vive no seu mundo.
        </span>
      </figcaption>

      <div class="flex flex-wrap gap-2" role="group" aria-label="Como as telas recebem o passaporte">
        @for (option of modes; track option.value) {
          <button
            type="button"
            class="rounded-full border px-3 py-1 text-sm font-bold"
            [class]="mode() === option.value ? 'border-challenge bg-challenge text-on-primary' : 'border-line bg-surface-raised text-ink'"
            [attr.aria-pressed]="mode() === option.value"
            (click)="switchTo(option.value)"
          >{{ option.label }}</button>
        }
      </div>

      <div class="mt-4 grid gap-3 md:grid-cols-3">
        @for (screen of screens; track screen.id) {
          <div [attr.data-screen]="screen.id" class="flex flex-col gap-2 rounded-2xl border border-line bg-surface-raised p-3 text-ink">
            <p class="font-mono text-xs text-ink-muted">{{ screen.component }}</p>
            @switch (screen.id) {
              @case ('lista') {
                <p class="text-sm">🇧🇷 Brasil ✓ · 🇵🇹 Portugal ✓ · 🇦🇷 Argentina ✓</p>
                <p class="text-sm font-bold">🇯🇵 Japão{{ japanVisited('lista') ? ' ✓' : '' }}</p>
              }
              @case ('pais') {
                <p class="text-lg font-extrabold">🇯🇵 Japão</p>
                <p class="text-sm">{{ japanVisited('pais') ? 'Visitado' : 'Ainda não visitado' }}</p>
              }
              @default {
                <p class="text-lg font-extrabold">🛂 {{ japanVisited('passaporte') ? 4 : 3 }} carimbos</p>
              }
            }
            <button type="button" class="mt-auto rounded-full border border-line px-3 py-1 text-sm font-bold" (click)="toggle(screen.id)">
              {{ japanVisited(screen.id) ? 'Desmarcar o Japão' : 'Visitar o Japão' }}
            </button>
            <p class="font-mono text-xs" [class]="mode() === 'um' ? 'text-challenge' : 'text-pitfall'">
              {{ mode() === 'um' ? 'inject(Passport) → objeto #1' : 'new Passport() → objeto #' + (screen.index + 1) }}
            </p>
          </div>
        }
      </div>
      <p data-instances class="mt-3 text-sm font-bold text-ink">
        {{ mode() === 'um' ? 'Na memória: 1 objeto Passport, o mesmo para as três telas.' : 'Na memória: 3 objetos Passport, um para cada tela.' }}
      </p>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class ServiceSim {
  protected readonly modes: { value: Mode; label: string }[] = [
    { value: 'um', label: 'Um service, com inject()' },
    { value: 'copias', label: 'Uma cópia por tela' },
  ];
  protected readonly screens: { id: ScreenId; component: string; index: number }[] = [
    { id: 'lista', component: 'CountryList', index: 0 },
    { id: 'pais', component: 'CountryOverview', index: 1 },
    { id: 'passaporte', component: 'PassportPage', index: 2 },
  ];

  protected readonly mode = signal<Mode>('um');
  /** No modo "um", só o primeiro objeto é usado; no modo "cópias", cada tela tem o seu. */
  private readonly passports = signal<MiniPassport[]>(this.fresh());

  protected readonly announcement = computed(() => {
    const visited = this.screens.filter((screen) => this.japanVisited(screen.id)).length;
    return `${visited} de 3 telas mostram o Japão como visitado.`;
  });

  protected japanVisited(screen: ScreenId): boolean {
    return this.passports()[this.instanceOf(screen)].japanVisited;
  }

  protected toggle(screen: ScreenId): void {
    const index = this.instanceOf(screen);
    this.passports.update((all) => all.map((passport, i) => (i === index ? { japanVisited: !passport.japanVisited } : passport)));
  }

  protected switchTo(mode: Mode): void {
    this.mode.set(mode);
    this.passports.set(this.fresh());
  }

  private instanceOf(screen: ScreenId): number {
    return this.mode() === 'um' ? 0 : this.screens.findIndex((s) => s.id === screen);
  }

  private fresh(): MiniPassport[] {
    return [{ japanVisited: false }, { japanVisited: false }, { japanVisited: false }];
  }
}
