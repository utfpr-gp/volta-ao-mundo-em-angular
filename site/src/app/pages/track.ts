import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TRACKS, chaptersOfTrack, trackById } from '../catalog/catalog';
import { CONTENT } from '../chapters/content';
import { ProgressService } from '../progress/progress';
import { InlineCode } from '../shared/inline-code';
import { Stamp } from '../shared/stamp';
import { Code } from '../views/code';
import { NotFound } from './not-found';

@Component({
  selector: 'vm-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NotFound, Stamp, InlineCode, Code],
  template: `
    @if (track(); as track) {
      <div class="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        <header class="relative overflow-hidden rounded-[22px] bg-primary px-6 py-10 text-on-primary sm:px-10">
          <span aria-hidden="true" class="pointer-events-none absolute right-10 top-1/2 hidden -translate-y-1/2 -rotate-12 text-[8rem] leading-none opacity-20 md:block">{{ track.emoji }}</span>
          <p class="text-sm font-extrabold uppercase tracking-[0.2em] text-highlight">Trilha {{ position() }} de {{ totalTracks }}</p>
          <h1 class="mt-2 text-4xl font-extrabold sm:text-5xl"><span aria-hidden="true">{{ track.emoji }}</span> {{ track.name }}</h1>
          <p class="mt-3 max-w-2xl text-lg text-on-primary-muted">{{ track.summary }}</p>
          <p class="mt-5 font-bold">
            {{ stamped() }} de {{ chapters().length }} carimbos ·
            <a routerLink="/passaporte" class="text-highlight">ver o passaporte</a>
          </p>
        </header>

        <div data-pagefind-body>
          <span data-pagefind-meta="title" hidden>Trilha {{ track.name }}</span>

          <section class="mt-12" aria-labelledby="capitulos">
            <h2 id="capitulos" class="text-2xl font-extrabold">Os capítulos</h2>
            <ol class="mt-5 flex flex-col gap-3">
              @for (chapter of chapters(); track chapter.slug) {
                <li data-chapter-item>
                  <a
                    [routerLink]="['/capitulos', chapter.slug]"
                    class="group flex items-center gap-5 rounded-card border border-line bg-surface-raised p-4 no-underline hover:border-link sm:p-5"
                  >
                    <vm-stamp
                      class="hidden shrink-0 sm:block"
                      size="xs"
                      [chapter]="chapter"
                      [date]="progress.stamps()[chapter.slug] ?? null"
                      [state]="chapter.published ? 'open' : 'coming-soon'"
                    />
                    <span class="min-w-0 flex-1">
                      <span class="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink-muted">
                        Capítulo {{ chapter.number }} · {{ chapter.minutes }} min
                        @if (!chapter.published) {
                          <span class="rounded-full bg-line px-2 py-0.5 normal-case tracking-normal">Em breve</span>
                        }
                      </span>
                      <span class="mt-1 block text-lg font-extrabold text-ink group-hover:text-link [&_code]:font-mono [&_code]:text-[0.92em]">
                        <vm-inline-code [text]="chapter.question" />
                      </span>
                      <span class="mt-1 block text-ink-muted">{{ chapter.description }}</span>
                    </span>
                  </a>
                </li>
              }
            </ol>
          </section>

          <section class="mt-14" aria-labelledby="referencia-rapida">
            <h2 id="referencia-rapida" class="text-2xl font-extrabold">Referência rápida</h2>
            <p class="mt-2 text-ink-muted">Os resumos e os trechos de código essenciais da trilha, num lugar só, para consultar depois.</p>
            @if (reference().length) {
              <div class="mt-6 flex flex-col gap-8">
                @for (item of reference(); track item.chapter.slug) {
                  <article class="rounded-card border border-line bg-surface-raised p-6">
                    <h3 class="text-lg font-extrabold [&_code]:font-mono">
                      <a [routerLink]="['/capitulos', item.chapter.slug]">
                        {{ item.chapter.number }}. <vm-inline-code [text]="item.chapter.question" />
                      </a>
                    </h3>
                    <ul class="mt-3 flex flex-col gap-1.5">
                      @for (line of item.content.summary; track $index) {
                        <li class="flex gap-2 [&_code]:font-mono">
                          <span aria-hidden="true" class="font-extrabold text-idea">✓</span>
                          <span><vm-inline-code [text]="line" /></span>
                        </li>
                      }
                    </ul>
                    @for (snippet of item.content.essentials; track snippet) {
                      <vm-code [snippet]="snippet" />
                    }
                  </article>
                }
              </div>
            } @else {
              <p class="mt-6 rounded-card border-2 border-dashed border-line p-6 text-ink-muted">
                A referência rápida desta trilha cresce a cada capítulo publicado.
              </p>
            }
          </section>
        </div>

        <nav aria-label="Outras trilhas" class="mt-14 grid gap-4 sm:grid-cols-2">
          @if (previous(); as previous) {
            <a [routerLink]="['/trilhas', previous.id]" class="rounded-card border border-line bg-surface-raised p-5 no-underline hover:border-link">
              <span class="text-sm font-bold text-ink-muted">← Trilha anterior</span>
              <span class="mt-1 block text-lg font-extrabold text-ink">{{ previous.emoji }} {{ previous.name }}</span>
            </a>
          } @else {
            <span aria-hidden="true"></span>
          }
          @if (next(); as next) {
            <a [routerLink]="['/trilhas', next.id]" class="rounded-card border border-line bg-surface-raised p-5 text-right no-underline hover:border-link">
              <span class="text-sm font-bold text-ink-muted">Próxima trilha →</span>
              <span class="mt-1 block text-lg font-extrabold text-ink">{{ next.emoji }} {{ next.name }}</span>
            </a>
          }
        </nav>
      </div>
    } @else {
      <vm-not-found />
    }
  `,
})
export class Track {
  protected readonly progress = inject(ProgressService);

  readonly trilha = input.required<string>();

  protected readonly totalTracks = TRACKS.length;
  protected readonly track = computed(() => trackById(this.trilha()));
  protected readonly position = computed(() => TRACKS.findIndex((track) => track.id === this.trilha()) + 1);
  protected readonly previous = computed(() => TRACKS[this.position() - 2]);
  protected readonly next = computed(() => TRACKS[this.position()]);
  protected readonly chapters = computed(() => {
    const track = this.track();
    return track ? chaptersOfTrack(track.id) : [];
  });
  protected readonly stamped = computed(() => {
    const stamps = this.progress.stamps();
    return this.chapters().filter((chapter) => chapter.slug in stamps).length;
  });
  protected readonly reference = computed(() =>
    this.chapters()
      .filter((chapter) => chapter.published && CONTENT[chapter.slug])
      .map((chapter) => ({ chapter, content: CONTENT[chapter.slug]! })),
  );
}
