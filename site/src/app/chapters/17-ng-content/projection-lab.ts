import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

/** A moldura do simulador: um componente com três encaixes de ng-content, de verdade. */
@Component({
  selector: 'vm-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section data-frame class="rounded-2xl border-2 border-dashed border-challenge/60 bg-surface-raised p-4">
      <header data-slot="title" class="mb-3 min-h-7 border-b border-line pb-2 text-lg font-extrabold text-ink">
        <ng-content select="[panel-title]" />
      </header>
      <div data-slot="body"><ng-content /></div>
      <footer data-slot="footer" class="mt-3 text-sm text-ink-muted"><ng-content select="[panel-footer]" /></footer>
    </section>
  `,
})
export class Frame {}

type ContentId = 'countries' | 'note' | 'photo';

const CODE: Record<ContentId, string> = {
  countries: '<ul>\n    <li>🇧🇷 Brasil</li>\n    <li>🇯🇵 Japão</li>\n  </ul>',
  note: '<textarea>Comer ramen em Tóquio</textarea>',
  photo: '<p class="foto">🗻</p>',
};

/** Simulador do capítulo 17: a mesma moldura recebendo conteúdos diferentes. */
@Component({
  selector: 'vm-projection-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Frame],
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Uma moldura, qualquer conteúdo</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          A moldura tracejada é um componente com ng-content. Troque o conteúdo que o pai coloca dentro dela.
        </span>
      </figcaption>

      <div class="flex flex-wrap gap-4 text-ink">
        <fieldset class="flex flex-wrap gap-3">
          <legend class="sr-only">Conteúdo</legend>
          @for (option of options; track option.id) {
            <label class="flex items-center gap-2 font-semibold">
              <input type="radio" name="conteudo" class="size-4 accent-challenge" [value]="option.id" [checked]="content() === option.id" (change)="content.set(option.id)" />
              {{ option.label }}
            </label>
          }
        </fieldset>
        <label class="flex items-center gap-2 font-semibold">
          <input type="checkbox" class="size-4 accent-challenge" [checked]="withTitle()" (change)="withTitle.set($any($event.target).checked)" />
          com título
        </label>
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <vm-frame>
          @if (withTitle()) {
            <span panel-title>{{ titleText() }}</span>
          }
          @switch (content()) {
            @case ('countries') {
              <ul class="text-ink"><li>🇧🇷 Brasil</li><li>🇯🇵 Japão</li></ul>
            }
            @case ('note') {
              <textarea class="w-full rounded-lg border border-line bg-surface p-2 text-ink" rows="2" aria-label="Anotação">Comer ramen em Tóquio</textarea>
            }
            @case ('photo') {
              <p class="text-center text-6xl" role="img" aria-label="Monte Fuji">🗻</p>
            }
          }
          <span panel-footer>projetado pelo pai</span>
        </vm-frame>
        <pre data-code class="overflow-x-auto rounded-2xl bg-terminal p-4 font-mono text-sm leading-relaxed text-terminal-ink">{{ code() }}</pre>
      </div>
    </figure>
  `,
})
export class ProjectionLab {
  protected readonly options: { id: ContentId; label: string }[] = [
    { id: 'countries', label: 'Lista de países' },
    { id: 'note', label: 'Anotação' },
    { id: 'photo', label: 'Foto' },
  ];
  protected readonly content = signal<ContentId>('countries');
  protected readonly withTitle = signal(true);
  protected readonly titleText = computed(() => ({ countries: '🌍 Países', note: '📝 Anotação', photo: '📷 Foto' })[this.content()]);
  protected readonly code = computed(() =>
    [
      '<app-panel>',
      this.withTitle() ? `  <span panel-title>${this.titleText()}</span>` : '',
      `  ${CODE[this.content()]}`,
      '  <span panel-footer>projetado pelo pai</span>',
      '</app-panel>',
    ]
      .filter(Boolean)
      .join('\n'),
  );
}
