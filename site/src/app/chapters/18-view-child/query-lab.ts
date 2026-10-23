import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';

/** Simulador do capítulo 18: viewChild de verdade encontrando elementos do template para agir sobre eles. */
@Component({
  selector: 'vm-query-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Encontre e aja</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Cada campo tem uma variável de template. Os botões usam viewChild para achar o campo e agir sobre ele.
        </span>
      </figcaption>

      <div class="grid gap-4 lg:grid-cols-2">
        <div class="flex flex-col gap-3 rounded-2xl bg-surface-raised p-4 text-ink">
          <label class="font-semibold">País <span class="font-mono text-xs text-ink-muted">#country</span>
            <input #country id="query-country" class="mt-1 block w-full rounded-lg border border-line bg-surface px-2 py-1" value="Japão" />
          </label>
          <label class="font-semibold">Anotação <span class="font-mono text-xs text-ink-muted">#note</span>
            <input #note class="mt-1 block w-full rounded-lg border border-line bg-surface px-2 py-1" value="Comer ramen em Tóquio" />
          </label>
        </div>
        <div class="flex flex-col gap-3">
          <pre class="overflow-x-auto rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">country = viewChild.required&lt;ElementRef&lt;HTMLInputElement&gt;&gt;('country');
note = viewChild.required&lt;ElementRef&lt;HTMLInputElement&gt;&gt;('note');</pre>
          <div data-actions class="flex flex-col gap-2">
            <button type="button" class="rounded-xl border border-line bg-surface-raised px-3 py-2 text-left font-mono text-sm text-ink hover:border-challenge" (click)="focusCountry()">country().nativeElement.focus()</button>
            <button type="button" class="rounded-xl border border-line bg-surface-raised px-3 py-2 text-left font-mono text-sm text-ink hover:border-challenge" (click)="selectNote()">note().nativeElement.select()</button>
            <button type="button" class="rounded-xl border border-line bg-surface-raised px-3 py-2 text-left font-mono text-sm text-ink hover:border-challenge" (click)="readNote()">note().nativeElement.value</button>
          </div>
          <p data-result class="min-h-6 rounded-xl bg-surface-raised px-3 py-2 font-mono text-sm text-ink">{{ result() }}</p>
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ result() }}</p>
    </figure>
  `,
})
export class QueryLab {
  private readonly country = viewChild.required<ElementRef<HTMLInputElement>>('country');
  private readonly note = viewChild.required<ElementRef<HTMLInputElement>>('note');
  protected readonly result = signal('');

  protected focusCountry(): void {
    this.country().nativeElement.focus();
    this.result.set('O cursor foi para o campo País.');
  }

  protected selectNote(): void {
    this.note().nativeElement.select();
    this.result.set('O texto da anotação foi selecionado.');
  }

  protected readNote(): void {
    this.result.set(`Valor lido: "${this.note().nativeElement.value}"`);
  }
}
