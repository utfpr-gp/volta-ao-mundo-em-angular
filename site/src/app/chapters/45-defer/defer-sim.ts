import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Trigger = 'idle' | 'viewport' | 'interaction' | 'immediate';
type Action = 'open' | 'scroll' | 'click';
type State = 'placeholder' | 'loading' | 'complete';

const TRIGGERS: { value: Trigger; label: string }[] = [
  { value: 'idle', label: 'on idle (o padrão)' },
  { value: 'viewport', label: 'on viewport' },
  { value: 'interaction', label: 'on interaction' },
  { value: 'immediate', label: 'on immediate' },
];

/** Simulador do capítulo 45: quando cada gatilho do @defer baixa o código do gráfico, e quando o mostra. */
@Component({
  selector: 'vm-defer-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Quando o gráfico chega</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Escolha o gatilho do <code>&#64;defer</code> e se há <code>prefetch on idle</code>. Depois, faça o que uma pessoa faria
          na página do passaporte, na ordem que quiser, e veja quando o código do gráfico (153,73 kB) é baixado e quando ele
          aparece.
        </span>
      </figcaption>

      <div class="grid gap-4 text-ink sm:grid-cols-2">
        <fieldset class="flex flex-col gap-1">
          <legend class="mb-1 text-sm font-bold">O gatilho</legend>
          @for (option of triggers; track option.value) {
            <label class="flex items-center gap-2 font-mono text-sm">
              <input type="radio" name="sim-trigger" [value]="option.value" [checked]="trigger() === option.value" (change)="choose(option.value)" />
              {{ option.label }}
            </label>
          }
        </fieldset>
        <div class="flex flex-col gap-2">
          <label class="flex items-center gap-2 font-mono text-sm">
            <input id="sim-prefetch" type="checkbox" [checked]="prefetch()" (change)="togglePrefetch()" />
            prefetch on idle
          </label>
          <div class="flex flex-wrap gap-2">
            <button type="button" class="rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-on-primary" [disabled]="opened()" (click)="act('open')">Abrir a página</button>
            <button type="button" class="rounded-full border border-line px-3 py-1.5 text-sm font-bold text-ink disabled:opacity-50" [disabled]="!opened()" (click)="act('scroll')">Rolar até o gráfico</button>
            <button type="button" class="rounded-full border border-line px-3 py-1.5 text-sm font-bold text-ink disabled:opacity-50" [disabled]="!opened()" (click)="act('click')">Clicar no espaço do gráfico</button>
          </div>
        </div>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
        <div data-state class="flex h-28 items-center justify-center rounded-2xl border border-line bg-surface-raised p-3 text-center text-sm font-bold text-ink">
          @switch (state()) {
            @case ('placeholder') { &#64;placeholder: o espaço vazio }
            @case ('loading') { &#64;loading: "Carregando o gráfico…" }
            @case ('complete') { 📊 o gráfico }
          }
        </div>
        <ol data-log class="flex flex-col gap-1 rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">
          @for (line of log(); track $index) {
            <li>{{ line }}</li>
          } @empty {
            <li>(abra a página)</li>
          }
        </ol>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ log().at(-1) }}</p>
    </figure>
  `,
})
export class DeferSim {
  protected readonly triggers = TRIGGERS;
  protected readonly trigger = signal<Trigger>('viewport');
  protected readonly prefetch = signal(false);
  protected readonly opened = signal(false);
  protected readonly downloaded = signal(false);
  protected readonly state = signal<State>('placeholder');
  protected readonly log = signal<string[]>([]);
  protected readonly done = computed(() => this.state() === 'complete');

  protected choose(trigger: Trigger): void {
    this.trigger.set(trigger);
    this.reset();
  }

  protected togglePrefetch(): void {
    this.prefetch.update((on) => !on);
    this.reset();
  }

  protected act(event: Action): void {
    const lines: string[] = [];
    if (event === 'open') {
      this.opened.set(true);
      lines.push('a página abre: 14,33 kB, e o @placeholder no lugar do gráfico');
      if (this.trigger() === 'immediate') this.show(lines, 'o gatilho é imediato');
      else {
        lines.push('o navegador termina o que tinha para fazer e fica ocioso (idle)');
        if (this.trigger() === 'idle') this.show(lines, 'o navegador ficou ocioso');
        else if (this.prefetch()) this.download(lines, 'prefetch on idle: baixa já, mas ainda não mostra');
      }
    } else if (this.done()) {
      lines.push(event === 'scroll' ? 'rolou até o gráfico: ele já está lá' : 'clicou no gráfico: ele já está lá');
    } else if (event === 'scroll') {
      lines.push('o espaço do gráfico entra na tela');
      if (this.trigger() === 'viewport') this.show(lines, 'on viewport');
    } else {
      lines.push('clicou no espaço do gráfico');
      if (this.trigger() === 'interaction') this.show(lines, 'on interaction');
    }
    this.log.update((log) => [...log, ...lines]);
  }

  private download(lines: string[], why: string): void {
    if (this.downloaded()) return;
    this.downloaded.set(true);
    lines.push(`${why}: baixa o trip-chart, 153,73 kB`);
  }

  private show(lines: string[], why: string): void {
    if (this.downloaded()) {
      lines.push(`${why}: o código já estava aqui, e o gráfico aparece na hora`);
    } else {
      this.download(lines, why);
      lines.push('@loading enquanto baixa; depois, o gráfico');
    }
    this.state.set('complete');
  }

  private reset(): void {
    this.opened.set(false);
    this.downloaded.set(false);
    this.state.set('placeholder');
    this.log.set([]);
  }
}
