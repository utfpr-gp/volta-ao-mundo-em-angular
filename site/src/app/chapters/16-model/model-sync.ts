import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';

/** O filho do simulador: as estrelas, com um model() de verdade. */
@Component({
  selector: 'vm-model-stars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex gap-1" role="group" aria-label="Nota da viagem">
      @for (star of stars; track star) {
        <button
          type="button"
          class="text-3xl leading-none"
          [class]="star <= rating() ? 'text-highlight' : 'text-ink-muted/40'"
          [attr.aria-label]="star + (star === 1 ? ' estrela' : ' estrelas')"
          [attr.aria-pressed]="star <= rating()"
          (click)="rating.set(star)"
        >
          ★
        </button>
      }
    </div>
  `,
})
export class ModelStars {
  readonly rating = model(0);
  protected readonly stars = [1, 2, 3, 4, 5];
}

/** Simulador do capítulo 16: o mesmo valor, mudado pelo pai e pelo filho, sempre sincronizado. */
@Component({
  selector: 'vm-model-sync',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModelStars],
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Um valor, dois donos</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Mude a nota pelos botões do pai ou clicando nas estrelas do filho. Os dois lados ficam sempre iguais.
        </span>
      </figcaption>

      <div class="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div data-parent class="rounded-2xl bg-terminal p-4 font-mono text-sm text-terminal-ink">
          <p class="text-xs text-terminal-ink/70">pai: FeaturedCountry</p>
          <p data-parent-value class="mt-1 text-lg" [class.text-terminal-prompt]="direction() === 'up'">rating = {{ rating() }}</p>
          <div class="mt-3 flex gap-2 font-sans">
            <button type="button" data-less class="rounded-full border border-terminal-ink/40 px-3 py-1 text-sm font-bold" (click)="change(-1)">− nota</button>
            <button type="button" data-more class="rounded-full border border-terminal-ink/40 px-3 py-1 text-sm font-bold" (click)="change(1)">+ nota</button>
          </div>
        </div>
        <p class="text-center font-mono text-sm font-bold text-challenge">
          [(rating)]<br />
          <span aria-hidden="true">{{ direction() === 'up' ? '⬅ filho → pai' : direction() === 'down' ? 'pai → filho ➡' : '⇄' }}</span>
        </p>
        <div data-child class="rounded-2xl border-2 bg-surface-raised p-4" [class]="direction() === 'down' ? 'border-highlight' : 'border-line'">
          <p class="font-mono text-xs text-ink-muted">filho: &lt;app-star-rating&gt;</p>
          <vm-model-stars class="mt-2 block" [(rating)]="rating" (ratingChange)="fromChild()" />
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class ModelSync {
  protected readonly rating = signal(2);
  protected readonly direction = signal<'up' | 'down' | null>(null);
  protected readonly announcement = signal('');

  protected change(delta: number): void {
    this.rating.update((value) => Math.min(5, Math.max(0, value + delta)));
    this.direction.set('down');
    this.announcement.set(`pai → filho: o pai mudou a nota para ${this.rating()}, e as estrelas acompanharam.`);
  }

  protected fromChild(): void {
    this.direction.set('up');
    this.announcement.set(`filho → pai: o filho mudou a nota para ${this.rating()}, e o signal do pai acompanhou.`);
  }
}
