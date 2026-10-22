import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { chapterByNumber } from '../catalog/catalog';
import { sortedGlossary } from '../glossary/glossary';

interface LetterGroup {
  letter: string;
  entries: ReturnType<typeof sortedGlossary>;
}

function groupByLetter(): LetterGroup[] {
  const groups = new Map<string, LetterGroup>();
  for (const entry of sortedGlossary()) {
    const letter = entry.term.normalize('NFD')[0].toUpperCase();
    if (!groups.has(letter)) groups.set(letter, { letter, entries: [] });
    groups.get(letter)!.entries.push(entry);
  }
  return [...groups.values()];
}

@Component({
  selector: 'vm-glossary-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-12 sm:px-8">
      <h1 class="text-4xl font-extrabold sm:text-5xl">Glossário</h1>
      <p class="mt-3 max-w-2xl text-lg text-ink-muted">
        Os termos técnicos do livro em poucas palavras. Cada um leva ao capítulo onde é explicado com calma, com analogia e
        exemplo.
      </p>

      <nav aria-label="Letras" class="sticky top-[7.5rem] z-10 mt-8 -mx-1 overflow-x-auto bg-surface/95 py-2 backdrop-blur 2xl:top-[4.5rem]">
        <ul class="flex gap-1">
          @for (group of groups; track group.letter) {
            <li>
              <a [routerLink]="[]" [fragment]="'letra-' + group.letter" class="grid size-9 place-items-center rounded-full font-extrabold no-underline hover:bg-surface-raised">
                {{ group.letter }}
              </a>
            </li>
          }
        </ul>
      </nav>

      <div data-pagefind-body>
        @for (group of groups; track group.letter) {
          <section class="mt-10" [attr.aria-labelledby]="'letra-' + group.letter">
            <h2 [id]="'letra-' + group.letter" class="scroll-mt-48 border-b border-line pb-2 text-3xl font-extrabold text-idea">{{ group.letter }}</h2>
            <dl class="mt-4 flex flex-col gap-4">
              @for (entry of group.entries; track entry.name) {
                <div class="rounded-2xl border border-line bg-surface-raised p-5">
                  <dt [id]="entry.name" class="scroll-mt-48 text-xl font-extrabold">{{ entry.term }}</dt>
                  <dd class="mt-2 text-ink">
                    {{ entry.definition }}
                    @if (chapterOf(entry.chapter); as chapter) {
                      <a [routerLink]="['/capitulos', chapter.slug]" class="mt-2 block text-sm font-bold">
                        Explicado no capítulo {{ chapter.number }}: {{ chapter.shortTitle }} →
                      </a>
                    }
                  </dd>
                </div>
              }
            </dl>
          </section>
        }
      </div>
    </div>
  `,
})
export class GlossaryPage {
  protected readonly groups = groupByLetter();
  protected readonly chapterOf = chapterByNumber;
}
