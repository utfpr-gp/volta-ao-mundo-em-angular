import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

const COUNTRIES: Record<string, { name: string; flag: string }> = {
  BR: { name: 'Brasil', flag: '🇧🇷' },
  JP: { name: 'Japão', flag: '🇯🇵' },
  PT: { name: 'Portugal', flag: '🇵🇹' },
  IT: { name: 'Itália', flag: '🇮🇹' },
};

/** Simulador do capítulo 24: o :code da rota casa com o endereço e chega ao input; o componente é reaproveitado. */
@Component({
  selector: 'vm-param-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Do endereço para o input</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Troque o código no endereço e acompanhe o valor: do endereço para a rota, da rota para o input, do input para a tela.
        </span>
      </figcaption>

      <form class="flex flex-wrap gap-2" (submit)="$event.preventDefault(); go(draft())">
        <label class="sr-only" for="vm-param-sim-url">Endereço</label>
        <input
          id="vm-param-sim-url"
          type="text"
          class="min-w-0 flex-1 rounded-full border border-line bg-surface-raised px-4 py-1.5 font-mono text-ink"
          [value]="draft()"
          (input)="draft.set($any($event.target).value)"
        />
        <button type="submit" class="rounded-full bg-primary px-4 py-1.5 font-bold text-on-primary">Ir</button>
      </form>
      <div class="mt-2 flex flex-wrap gap-2 text-sm">
        @for (shortcut of shortcuts; track shortcut) {
          <button type="button" class="rounded-full border border-line bg-surface-raised px-3 py-1 font-mono text-ink" (click)="go(shortcut)">{{ shortcut }}</button>
        }
      </div>

      <div class="mt-5 grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-line bg-surface-raised p-4 text-ink">
          <p class="text-xs font-extrabold uppercase tracking-wider text-ink-muted">1. A rota</p>
          <p class="mt-2 font-mono text-sm">path: 'paises/:code'</p>
          <div data-segments class="mt-3 flex flex-col gap-1 font-mono text-sm">
            @if (code(); as value) {
              <span>'paises' = 'paises' ✓</span>
              <span class="font-bold text-challenge">:code ← '{{ value }}'</span>
            } @else {
              <span class="text-ink-muted">{{ path() }} não combina com esta rota</span>
            }
          </div>
        </div>
        <div class="rounded-2xl border border-line bg-surface-raised p-4 text-ink">
          <p class="text-xs font-extrabold uppercase tracking-wider text-ink-muted">2. O componente</p>
          <p class="mt-2 font-mono text-sm">code = input.required&lt;string&gt;()</p>
          <p data-input class="mt-3 font-mono text-sm font-bold">
            {{ code() && binding() ? "code() → '" + code() + "'" : 'code() → (nada)' }}
          </p>
          <p data-created class="mt-3 text-sm">CountryPage criado {{ created() }} {{ created() === 1 ? 'vez' : 'vezes' }}</p>
        </div>
        <div data-screen class="rounded-2xl border-2 bg-surface-raised p-4 text-ink" [class]="error() ? 'border-pitfall' : 'border-line'">
          <p class="text-xs font-extrabold uppercase tracking-wider text-ink-muted">3. A tela</p>
          @if (error()) {
            <p class="mt-2 font-mono text-sm font-bold text-pitfall">{{ error() }}</p>
          } @else if (shown(); as country) {
            <p class="mt-2 text-4xl" aria-hidden="true">{{ country.flag }}</p>
            <p class="text-xl font-extrabold">{{ country.name }}</p>
          } @else if (code()) {
            <p class="mt-2 font-bold">Não encontramos o país {{ code() }}</p>
          } @else {
            <p class="mt-2 text-ink-muted">Outra tela: o CountryPage foi destruído.</p>
          }
        </div>
      </div>

      <div class="mt-4 flex flex-col gap-2 text-sm text-ink">
        <label class="flex cursor-pointer items-center gap-2">
          <input type="checkbox" class="size-4 accent-challenge" [checked]="!binding()" (change)="binding.set(!binding())" />
          Esquecer o <code class="font-mono">withComponentInputBinding()</code>
        </label>
        <label class="flex cursor-pointer items-center gap-2">
          <input type="checkbox" class="size-4 accent-challenge" [checked]="copyOnce()" (change)="copyOnce.set(!copyOnce())" />
          Copiar o código uma vez só, no <code class="font-mono">ngOnInit</code>
        </label>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class ParamSim {
  protected readonly shortcuts = ['/paises/JP', '/paises/PT', '/paises/XX', '/sobre'];
  protected readonly draft = signal('/paises/BR');
  protected readonly path = signal('/paises/BR');
  protected readonly created = signal(1);
  protected readonly binding = signal(true);
  protected readonly copyOnce = signal(false);
  /** O código que um ngOnInit teria copiado quando o componente nasceu. */
  private readonly codeAtCreation = signal('BR');

  protected readonly code = computed(() => /^\/paises\/([^/]+)$/.exec(this.path())?.[1].toUpperCase() ?? null);

  protected readonly error = computed(() =>
    this.code() && !this.binding() ? 'NG0950: Input "code" is required but no value is available yet.' : null,
  );

  protected readonly shown = computed(() => {
    const code = this.copyOnce() ? this.codeAtCreation() : this.code();
    return this.code() && code ? COUNTRIES[code] : undefined;
  });

  protected readonly announcement = computed(() => {
    const country = this.shown();
    return `${this.path()}. ${this.error() ?? (country ? `A tela mostra ${country.name}.` : '')}`;
  });

  protected go(target: string): void {
    const wasCountryPage = this.code() !== null;
    this.path.set(target.trim());
    this.draft.set(target.trim());
    const code = this.code();
    if (code && !wasCountryPage) {
      this.created.update((n) => n + 1);
      this.codeAtCreation.set(code);
    }
  }
}
