import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

// O simulador mexe em tokens de um Passaporte em miniatura; as cores abaixo são os valores possíveis desses tokens.
const PRIMARIES = [
  { value: '#12263A', label: 'Azul-marinho' },
  { value: '#1E5A3C', label: 'Verde-floresta' },
  { value: '#6D1A36', label: 'Vinho' },
  { value: '#3B2A7A', label: 'Roxo' },
];

const FONTS = [
  { value: 'system-ui, sans-serif', label: 'Sem serifa' },
  { value: 'Georgia, serif', label: 'Com serifa' },
  { value: 'ui-monospace, monospace', label: 'Monoespaçada' },
];

const LIGHT = { surface: '#FBF8F1', card: '#FFFFFF', ink: '#1E2430', muted: '#5B6474', line: '#E7E1D3', highlight: '#D99A1E' };
const DARK = { surface: '#0F1C2B', card: '#16283B', ink: '#E8EEF5', muted: '#A7B6C6', line: '#2A3F55', highlight: '#F2B544' };

/** Simulador do capítulo 14: mude um token e veja o Passaporte inteiro mudar junto, inclusive no modo escuro. */
@Component({
  selector: 'vm-token-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Editor de tokens</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Mude um token e veja todos os lugares que o usam mudarem juntos. Nenhum componente do Passaporte em miniatura foi tocado.
        </span>
      </figcaption>

      <div class="grid gap-5 lg:grid-cols-[18rem_1fr]">
        <div class="flex flex-col gap-4 text-ink">
          <fieldset>
            <legend class="font-extrabold">--color-primary</legend>
            <div class="mt-2 grid grid-cols-2 gap-2">
              @for (option of primaries; track option.value) {
                <label class="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="radio" name="primaria" class="size-4 accent-challenge" [value]="option.value" [checked]="primary() === option.value" (change)="primary.set(option.value)" />
                  <span aria-hidden="true" class="size-4 rounded-full border border-line" [style.background]="option.value"></span>
                  {{ option.label }}
                </label>
              }
            </div>
          </fieldset>
          <label class="block">
            <span class="font-extrabold">--radius-card: {{ radius() }}px</span>
            <input type="range" min="0" max="24" class="mt-1 block w-full accent-challenge" [value]="radius()" (input)="radius.set(+$any($event.target).value)" />
          </label>
          <label class="block">
            <span class="font-extrabold">--font-sans</span>
            <select class="mt-1 block w-full rounded-lg border border-line bg-surface-raised px-2 py-1.5" (change)="font.set($any($event.target).value)">
              @for (option of fonts; track option.value) {
                <option [value]="option.value" [selected]="font() === option.value">{{ option.label }}</option>
              }
            </select>
          </label>
          <label class="flex cursor-pointer items-center gap-2 font-extrabold">
            <input type="checkbox" class="size-4 accent-challenge" [checked]="dark()" (change)="dark.set($any($event.target).checked)" />
            Modo escuro
          </label>
        </div>

        <div class="grid gap-4">
          <div data-preview class="rounded-2xl p-4" [style]="vars()" style="background: var(--sim-surface); color: var(--sim-ink); font-family: var(--sim-font)">
            <div class="flex items-center justify-between px-3 py-2" style="background: var(--sim-primary); color: #fff; border-radius: var(--sim-radius)">
              <strong>🌐 Passaporte</strong><span class="text-sm opacity-80">Países</span>
            </div>
            <div class="mt-3 p-3" style="background: var(--sim-primary); color: #fff; border-radius: var(--sim-radius)">
              <p class="text-lg font-extrabold">12 de 195 países</p>
              <p class="text-sm" style="color: var(--sim-highlight)">🧳 Nível: viajante</p>
            </div>
            <ul class="mt-3 grid gap-2 sm:grid-cols-2">
              @for (country of countries; track country) {
                <li class="flex items-center gap-2 px-3 py-2" style="background: var(--sim-card); border: 1px solid var(--sim-line); border-radius: var(--sim-radius)">
                  {{ country }}
                </li>
              }
            </ul>
            <button type="button" tabindex="-1" class="mt-3 px-4 py-1.5 font-bold" style="background: var(--sim-highlight); color: var(--sim-primary); border-radius: 999px">
              Marcar como visitado
            </button>
          </div>
          <pre data-tokens class="overflow-x-auto rounded-2xl bg-terminal p-4 font-mono text-sm leading-relaxed text-terminal-ink">{{ tokens() }}</pre>
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class TokenEditor {
  protected readonly primaries = PRIMARIES;
  protected readonly fonts = FONTS;
  protected readonly countries = ['🇧🇷 Brasil', '🇯🇵 Japão', '🇵🇹 Portugal', '🇦🇷 Argentina'];
  protected readonly primary = signal(PRIMARIES[0].value);
  protected readonly radius = signal(12);
  protected readonly font = signal(FONTS[0].value);
  protected readonly dark = signal(false);

  private readonly palette = computed(() => (this.dark() ? DARK : LIGHT));

  protected readonly vars = computed(() => {
    const palette = this.palette();
    return {
      '--sim-primary': this.primary(),
      '--sim-radius': `${this.radius()}px`,
      '--sim-font': this.font(),
      '--sim-surface': palette.surface,
      '--sim-card': palette.card,
      '--sim-ink': palette.ink,
      '--sim-line': palette.line,
      '--sim-highlight': palette.highlight,
    };
  });

  protected readonly tokens = computed(() => {
    const palette = this.palette();
    return [
      this.dark() ? '/* modo escuro: mesmos nomes, outros valores */' : '@theme {',
      `  --color-primary: ${this.primary()};`,
      `  --color-surface: ${palette.surface};`,
      `  --color-card: ${palette.card};`,
      `  --color-ink: ${palette.ink};`,
      `  --color-highlight: ${palette.highlight};`,
      `  --radius-card: ${this.radius()}px;`,
      `  --font-sans: ${this.font()};`,
      this.dark() ? '' : '}',
    ]
      .filter(Boolean)
      .join('\n');
  });

  protected readonly announcement = computed(
    () =>
      `Modo ${this.dark() ? 'escuro' : 'claro'}, cor principal ${PRIMARIES.find((p) => p.value === this.primary())?.label}, cantos de ${this.radius()} pixels.`,
  );
}
