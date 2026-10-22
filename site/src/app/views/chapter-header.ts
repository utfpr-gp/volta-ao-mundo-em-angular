import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chapter, chapterByNumber, trackById } from '../catalog/catalog';
import { InlineCode } from '../shared/inline-code';

/** O cabeçalho de um capítulo: trilha, número, tempo, pré-requisitos, a pergunta e o espaço do carimbo. */
@Component({
  selector: 'vm-chapter-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, InlineCode],
  host: { class: 'block' },
  template: `
    <header class="relative overflow-hidden rounded-[22px] bg-primary px-6 py-8 text-on-primary sm:px-10 sm:py-10">
      <svg aria-hidden="true" viewBox="0 0 400 400" class="pointer-events-none absolute -bottom-40 -left-24 size-96 opacity-[0.07]">
        <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" stroke-width="3" />
        <ellipse cx="200" cy="200" rx="80" ry="190" fill="none" stroke="currentColor" stroke-width="3" />
        <path d="M10 200h380M40 110h320M40 290h320" stroke="currentColor" stroke-width="3" />
      </svg>

      <div class="relative flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div class="max-w-2xl">
          <ul class="mb-4 flex flex-wrap gap-2 text-[13px] font-bold">
            <li>
              <a [routerLink]="['/trilhas', chapter().track]" class="block rounded-full bg-highlight px-3 py-1 text-primary no-underline">
                {{ track()?.emoji }} {{ track()?.name }}
              </a>
            </li>
            <li class="rounded-full bg-primary-soft px-3 py-1 text-on-primary-muted">Capítulo {{ chapter().number }}</li>
            <li class="rounded-full bg-primary-soft px-3 py-1 text-on-primary-muted">⏱ cerca de {{ chapter().minutes }} min</li>
            @for (prerequisite of prerequisites(); track prerequisite.number) {
              <li>
                <a
                  [routerLink]="['/capitulos', prerequisite.slug]"
                  class="block rounded-full bg-primary-soft px-3 py-1 text-on-primary-muted no-underline hover:text-on-primary"
                >
                  Antes, leia o cap. {{ prerequisite.number }}
                </a>
              </li>
            }
          </ul>
          <h1 class="text-[1.9rem] font-extrabold leading-tight sm:text-[2.4rem] [&_code]:rounded-lg [&_code]:bg-primary-soft [&_code]:px-2 [&_code]:py-0.5 [&_code]:text-[0.9em]">
            <vm-inline-code [text]="chapter().question" />
          </h1>
          <p class="mt-3 text-lg text-on-primary-muted">{{ chapter().description }}</p>
        </div>
        <div class="shrink-0 self-center md:self-start">
          <ng-content select="[stamp]" />
        </div>
      </div>
    </header>
  `,
})
export class ChapterHeader {
  readonly chapter = input.required<Chapter>();

  protected readonly track = computed(() => trackById(this.chapter().track));
  protected readonly prerequisites = computed(() =>
    this.chapter()
      .prerequisites.map((number) => chapterByNumber(number))
      .filter((chapter) => chapter !== undefined),
  );
}
