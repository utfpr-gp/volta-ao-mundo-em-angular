import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { chapterBySlug, chaptersOfTrack, trackById } from '../catalog/catalog';
import { CONTENT } from '../chapters/content';
import { ProgressService } from '../progress/progress';
import { InlineCode } from '../shared/inline-code';
import { Stamp } from '../shared/stamp';
import { ChapterHeader } from './chapter-header';
import { ChapterNav } from './chapter-nav';
import { VIEWS } from './view';

/**
 * A moldura de todo capítulo: cabeçalho, sumário das visões à esquerda, o texto no meio,
 * e à direita o resumo de 1 minuto e o passaporte da trilha.
 */
@Component({
  selector: 'vm-chapter-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterLink, ChapterHeader, ChapterNav, Stamp, InlineCode],
  host: { class: 'block' },
  template: `
    @if (chapter(); as chapter) {
      <div class="mx-auto max-w-[1400px] px-4 py-8 sm:px-8 sm:py-10">
        <vm-chapter-header [chapter]="chapter">
          <vm-stamp
            stamp
            size="lg"
            tone="dark"
            [chapter]="chapter"
            [date]="progress.stamps()[chapter.slug] ?? null"
            [animate]="true"
          />
        </vm-chapter-header>

        <div class="mt-8 grid gap-10 min-[1100px]:grid-cols-[220px_minmax(0,1fr)] min-[1280px]:grid-cols-[220px_minmax(0,780px)_260px]">
          <div class="min-[1100px]:sticky min-[1100px]:top-36 min-[1100px]:self-start 2xl:top-24">
            <details class="group rounded-2xl border border-line bg-surface-raised min-[1100px]:hidden">
              <summary class="cursor-pointer list-none px-5 py-3 font-bold [&::-webkit-details-marker]:hidden">
                Neste capítulo <span aria-hidden="true" class="text-ink-muted">▾</span>
              </summary>
              <div class="px-3 pb-3"><ng-container *ngTemplateOutlet="toc" /></div>
            </details>
            <div class="hidden min-[1100px]:block"><ng-container *ngTemplateOutlet="toc" /></div>
          </div>

          <div class="min-w-0">
            <article
              data-pagefind-body
              [attr.data-chapter]="chapter.slug"
              class="prose prose-lg max-w-none"
            >
              <span data-pagefind-meta="title" hidden>{{ plainQuestion() }}</span>
              <ng-content />
            </article>
            <vm-chapter-nav class="mt-16" [slug]="chapter.slug" />
          </div>

          <aside
            aria-label="Resumo e passaporte da trilha"
            class="flex flex-col gap-6 min-[1100px]:col-start-2 min-[1280px]:sticky min-[1280px]:top-24 min-[1280px]:col-start-3 min-[1280px]:row-start-1 min-[1280px]:self-start"
          >
            @if (summary().length) {
              <section class="rounded-2xl border border-highlight/40 bg-highlight/10 p-5" aria-labelledby="resumo">
                <h2 id="resumo" class="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.15em] text-idea">
                  <span aria-hidden="true">⏱️</span> Resumo de 1 minuto
                </h2>
                <ul class="mt-3 flex flex-col gap-2.5 text-[0.95rem] leading-snug">
                  @for (item of summary(); track $index) {
                    <li class="flex gap-2 [&_code]:font-mono [&_code]:text-[0.88em]">
                      <span aria-hidden="true" class="font-extrabold text-idea">✓</span>
                      <span><vm-inline-code [text]="item" /></span>
                    </li>
                  }
                </ul>
              </section>
            }
            <section class="rounded-2xl border border-line bg-surface-raised p-5" aria-labelledby="passaporte-trilha">
              <h2 id="passaporte-trilha" class="text-sm font-extrabold uppercase tracking-[0.15em] text-ink-muted">
                Passaporte · {{ track()?.name }}
              </h2>
              <p class="mt-1 text-sm text-ink-muted">{{ stampedInTrack() }} de {{ trackChapters().length }} carimbos</p>
              <ul class="mt-3 grid grid-cols-4 gap-1">
                @for (item of trackChapters(); track item.slug) {
                  <li>
                    <a [routerLink]="['/capitulos', item.slug]" class="block rounded-full no-underline" [attr.aria-current]="item.slug === chapter.slug ? 'page' : null">
                      <vm-stamp
                        size="xs"
                        [chapter]="item"
                        [date]="progress.stamps()[item.slug] ?? null"
                        [state]="item.published ? 'open' : 'coming-soon'"
                        [class.ring-2]="item.slug === chapter.slug"
                        class="rounded-full ring-highlight"
                      />
                    </a>
                  </li>
                }
              </ul>
              <a routerLink="/passaporte" class="mt-3 inline-block text-sm font-bold">Ver o passaporte inteiro →</a>
            </section>
          </aside>
        </div>
      </div>

      <ng-template #toc>
        <nav aria-label="Neste capítulo">
          <p class="mb-2 px-2.5 text-xs font-extrabold uppercase tracking-[0.18em] text-ink-muted">Neste capítulo</p>
          <ul class="flex flex-col gap-0.5">
            @for (view of views; track view.id) {
              <li>
                <a
                  [routerLink]="[]"
                  [fragment]="view.id"
                  class="flex items-center gap-3 rounded-xl px-2.5 py-2 text-[0.95rem] font-semibold no-underline"
                  [class]="active() === view.id ? 'bg-surface-raised text-ink shadow-sm' : 'text-ink-muted hover:bg-surface-raised hover:text-ink'"
                  [attr.aria-current]="active() === view.id ? 'location' : null"
                >
                  <span aria-hidden="true" class="grid size-7 shrink-0 place-items-center rounded-full text-sm" [class]="view.bubble">{{ view.icon }}</span>
                  {{ view.label }}
                </a>
              </li>
            }
          </ul>
        </nav>
      </ng-template>
    }
  `,
})
export class ChapterPage {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly progress = inject(ProgressService);

  readonly slug = input.required<string>();

  protected readonly views = VIEWS;
  protected readonly chapter = computed(() => chapterBySlug(this.slug()));
  protected readonly plainQuestion = computed(() => this.chapter()?.question.replaceAll('`', '') ?? '');
  protected readonly track = computed(() => trackById(this.chapter()?.track ?? ''));
  protected readonly trackChapters = computed(() => {
    const chapter = this.chapter();
    return chapter ? chaptersOfTrack(chapter.track) : [];
  });
  protected readonly stampedInTrack = computed(() => {
    const stamps = this.progress.stamps();
    return this.trackChapters().filter((chapter) => chapter.slug in stamps).length;
  });
  protected readonly summary = computed(() => CONTENT[this.slug()]?.summary ?? []);
  protected readonly active = signal<string | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    // Destaca no sumário a visão que está na tela; só no navegador, depois da renderização.
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target.id);
          if (visible.length) this.active.set(visible[0]);
        },
        { rootMargin: '-20% 0px -70% 0px' },
      );
      this.host.nativeElement.querySelectorAll('section[data-view]').forEach((section: Element) => observer.observe(section));
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
