import { ChangeDetectionStrategy, Component, DOCUMENT, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CHAPTERS, TRACKS, TrackId, chaptersOfTrack } from '../catalog/catalog';
import { ProgressService } from '../progress/progress';
import { Stamp } from '../shared/stamp';

@Component({
  selector: 'vm-passport',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Stamp],
  template: `
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <section class="grid gap-8 rounded-[22px] bg-primary p-6 text-on-primary sm:p-10 md:grid-cols-[auto_1fr] md:items-center">
        <div
          aria-hidden="true"
          class="relative mx-auto flex h-60 w-44 flex-col items-center justify-between rounded-xl border-2 border-highlight/40 bg-passport px-4 py-6 text-center shadow-2xl shadow-black/30"
        >
          <span class="text-[11px] font-extrabold tracking-[0.3em] text-highlight">PASSAPORTE</span>
          <svg viewBox="0 0 64 64" class="size-20 text-highlight">
            <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="2.5" />
            <ellipse cx="32" cy="32" rx="11" ry="26" fill="none" stroke="currentColor" stroke-width="2" />
            <path d="M6 32h52M10 19h44M10 45h44" stroke="currentColor" stroke-width="2" />
          </svg>
          <span class="text-[11px] font-extrabold leading-snug tracking-[0.2em] text-highlight">VOLTA AO MUNDO<br />EM ANGULAR</span>
        </div>

        <div>
          <h1 class="text-4xl font-extrabold sm:text-5xl">Meu passaporte</h1>
          <p class="mt-3 max-w-2xl text-lg text-on-primary-muted">
            Cada capítulo termina com um desafio. Acertou todas as perguntas, ganhou o carimbo. Pode tentar quantas vezes
            quiser: o que vale é aprender.
          </p>
          <p class="mt-6 text-2xl font-extrabold">
            {{ progress.count() }} de {{ total }} carimbos
            <span class="ml-2 inline-block rounded-full bg-highlight px-3 py-1 align-middle text-base text-primary">{{ percent() }}% do mundo</span>
          </p>
          <div
            class="mt-4 h-3 max-w-xl overflow-hidden rounded-full bg-primary-soft"
            role="progressbar"
            aria-label="Progresso no livro"
            aria-valuemin="0"
            [attr.aria-valuemax]="total"
            [attr.aria-valuenow]="progress.count()"
          >
            <div class="h-full rounded-full bg-highlight motion-safe:transition-[width] motion-safe:duration-700" [style.width.%]="percent()"></div>
          </div>
        </div>
      </section>

      @for (track of tracks; track track.id) {
        <section class="mt-12" [attr.data-track]="track.id" [attr.aria-labelledby]="'trilha-' + track.id">
          <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
            <h2 [id]="'trilha-' + track.id" class="text-2xl font-extrabold">
              <span aria-hidden="true">{{ track.emoji }}</span> {{ track.name }}
            </h2>
            <p class="text-sm font-bold text-ink-muted">
              {{ stampedIn(track.id) }} de {{ chaptersOf(track.id).length }} carimbos ·
              <a [routerLink]="['/trilhas', track.id]">ver a trilha</a>
            </p>
          </div>
          <ul class="mt-6 grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-x-4 gap-y-6">
            @for (chapter of chaptersOf(track.id); track chapter.slug) {
              <li class="text-center">
                <a [routerLink]="['/capitulos', chapter.slug]" class="inline-block rounded-full no-underline">
                  <vm-stamp
                    [chapter]="chapter"
                    [date]="progress.stamps()[chapter.slug] ?? null"
                    [state]="chapter.published ? 'open' : 'coming-soon'"
                  />
                </a>
              </li>
            }
          </ul>
        </section>
      }

      <section class="mt-16 rounded-card border border-line bg-surface-raised p-6 sm:p-8" aria-labelledby="copia">
        <h2 id="copia" class="text-2xl font-extrabold">Cópia de segurança</h2>
        <p class="mt-2 max-w-3xl text-ink-muted">
          Os carimbos ficam guardados só neste navegador. Para levá-los a outro computador, exporte o passaporte e importe o
          arquivo lá. Importar junta os carimbos: nenhum carimbo que você já tem é apagado.
        </p>
        <div class="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            class="rounded-full bg-primary px-5 py-2.5 font-bold text-on-primary hover:bg-primary-soft"
            (click)="export()"
          >
            Exportar passaporte
          </button>
          <label
            class="cursor-pointer rounded-full border border-line px-5 py-2.5 font-bold focus-within:outline-3 focus-within:outline-highlight hover:border-link"
          >
            Importar passaporte
            <input type="file" accept="application/json,.json" class="sr-only" (change)="import($event)" />
          </label>
        </div>
        <p aria-live="polite" class="mt-4 min-h-6 font-semibold" [class.text-pitfall]="messageIsError()">{{ message() }}</p>
      </section>
    </div>
  `,
})
export class Passport {
  private readonly document = inject(DOCUMENT);
  protected readonly progress = inject(ProgressService);
  protected readonly tracks = TRACKS;
  protected readonly total = CHAPTERS.length;
  protected readonly percent = computed(() => Math.round((this.progress.count() / this.total) * 100));
  protected readonly chaptersOf = chaptersOfTrack;

  protected readonly message = signal('');
  protected readonly messageIsError = signal(false);

  protected stampedIn(trackId: TrackId): number {
    const stamps = this.progress.stamps();
    return chaptersOfTrack(trackId).filter((chapter) => chapter.slug in stamps).length;
  }

  protected export(): void {
    const blob = new Blob([this.progress.exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = this.document.createElement('a');
    link.href = url;
    link.download = 'meu-passaporte-angular.json';
    link.click();
    URL.revokeObjectURL(url);
    this.messageIsError.set(false);
    this.message.set('Passaporte exportado: procure o arquivo meu-passaporte-angular.json nos seus downloads.');
  }

  protected async import(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const result = this.progress.importJson(await file.text());
    this.messageIsError.set(!result.ok);
    if (!result.ok) {
      this.message.set(result.error);
    } else if (result.added === 0) {
      this.message.set('Passaporte importado. Você já tinha todos esses carimbos.');
    } else {
      const noun = result.added === 1 ? 'carimbo novo' : 'carimbos novos';
      this.message.set(`Passaporte importado: ${result.added} ${noun}.`);
    }
  }
}
