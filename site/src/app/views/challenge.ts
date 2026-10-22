import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { Listbox, Option } from '@angular/aria/listbox';
import { chapterBySlug } from '../catalog/catalog';
import { Question } from '../chapters/types';
import { ProgressService } from '../progress/progress';
import { InlineCode } from '../shared/inline-code';
import { Stamp, formatStampDate } from '../shared/stamp';
import { Code } from './code';
import { Grading, grade } from './grade';

const LETTERS = 'ABCDEFGH';

/**
 * O desafio do fim do capítulo. Acertar todas as perguntas dá o carimbo.
 * Fica fora do índice da busca, para as respostas não aparecerem nos resultados.
 */
@Component({
  selector: 'vm-challenge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Listbox, Option, InlineCode, Stamp, Code],
  host: { class: 'not-prose block' },
  template: `
    <form data-pagefind-ignore class="rounded-[22px] border border-challenge/30 bg-challenge/6 p-5 sm:p-7" (submit)="check($event)">
      @if (stampDate(); as date) {
        <p class="mb-5 flex items-center gap-3 rounded-2xl bg-surface-raised px-4 py-3 font-bold text-ink">
          <span aria-hidden="true" class="text-2xl">🛂</span>
          Carimbo conquistado em {{ formatDate(date) }}. Pode refazer o desafio quando quiser.
        </p>
      } @else {
        <p class="mb-5 text-ink-muted">
          Responda às {{ questions().length }} perguntas e confira. Acertou todas, ganhou o carimbo deste capítulo no seu passaporte.
        </p>
      }

      <ol class="flex flex-col gap-6">
        @for (question of questions(); track $index; let q = $index) {
          <li class="rounded-2xl border border-line bg-surface-raised p-5">
            <p [id]="idFor(q)" class="text-lg font-extrabold text-ink [&_code]:font-mono [&_code]:text-[0.9em]">
              <span class="mr-2 text-challenge">{{ q + 1 }}.</span><vm-inline-code [text]="question.prompt" />
            </p>
            @if (question.snippet) {
              <vm-code [snippet]="question.snippet" />
            }
            <ul
              ngListbox
              selectionMode="explicit"
              [attr.aria-labelledby]="idFor(q)"
              [value]="selectedValue(q)"
              (valueChange)="choose(q, $event)"
              class="mt-4 flex flex-col gap-2"
            >
              @for (alternative of question.alternatives; track $index; let a = $index) {
                <li
                  ngOption
                  [value]="a"
                  [label]="alternative.text"
                  class="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-line px-4 py-3 text-ink outline-offset-2 hover:border-challenge/60 aria-selected:border-challenge aria-selected:bg-challenge/8 [&_code]:font-mono [&_code]:text-[0.9em]"
                >
                  <span
                    aria-hidden="true"
                    class="grid size-7 shrink-0 place-items-center rounded-full border-2 text-sm font-extrabold"
                    [class]="answers()[q] === a ? 'border-challenge bg-challenge text-on-primary' : 'border-line text-ink-muted'"
                  >{{ letter(a) }}</span>
                  <span class="pt-0.5"><vm-inline-code [text]="alternative.text" /></span>
                </li>
              }
            </ul>
            @if (grading()?.items?.[q]; as item) {
              <p
                class="mt-3 flex gap-2 rounded-xl px-4 py-3 font-semibold"
                [class]="item.correct ? 'bg-code/10 text-code' : 'bg-pitfall/10 text-pitfall'"
              >
                <span aria-hidden="true">{{ item.correct ? '✓' : '✗' }}</span>
                <span><span class="sr-only">{{ item.correct ? 'Certo.' : 'Ainda não.' }} </span><vm-inline-code [text]="item.feedback" /></span>
              </p>
            }
          </li>
        }
      </ol>

      <div class="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" class="rounded-full bg-challenge px-6 py-3 font-extrabold text-on-primary shadow-lg shadow-challenge/25 hover:brightness-110">
          Conferir respostas
        </button>
        <p aria-live="polite" class="font-bold text-ink">{{ announcement() }}</p>
      </div>

      @if (justStamped() && chapter(); as chapter) {
        <div class="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-surface-raised p-6 text-center">
          <vm-stamp size="lg" [chapter]="chapter" [date]="stampDate()" [animate]="true" />
          <p class="text-xl font-extrabold text-ink">Carimbo no passaporte!</p>
          <p class="text-ink-muted">Siga para o próximo destino quando quiser.</p>
        </div>
      }
    </form>
  `,
})
export class Challenge {
  private readonly progress = inject(ProgressService);

  readonly slug = input.required<string>();
  readonly questions = input.required<Question[]>();

  protected readonly chapter = computed(() => chapterBySlug(this.slug()));
  protected readonly stampDate = computed(() => this.progress.stamps()[this.slug()] ?? null);
  protected readonly answers = linkedSignal<(number | null)[]>(() => this.questions().map(() => null));
  protected readonly grading = signal<Grading | null>(null);
  protected readonly justStamped = signal(false);
  protected readonly announcement = signal('');
  protected readonly formatDate = formatStampDate;

  private readonly uid = `desafio-${Math.random().toString(36).slice(2, 8)}`;

  protected idFor(question: number): string {
    return `${this.uid}-${question}`;
  }

  protected letter(index: number): string {
    return LETTERS[index];
  }

  protected selectedValue(question: number): number[] {
    const answer = this.answers()[question];
    return answer === null || answer === undefined ? [] : [answer];
  }

  protected choose(question: number, value: number[]): void {
    const answer = value[0] ?? null;
    if (this.answers()[question] === answer) return;
    this.answers.update((answers) => answers.map((current, index) => (index === question ? answer : current)));
    this.grading.set(null);
    this.announcement.set('');
  }

  protected check(event: Event): void {
    event.preventDefault();
    const result = grade(this.questions(), this.answers());
    this.grading.set(result);
    if (result.allCorrect) {
      const first = !this.progress.hasStamp(this.slug());
      this.progress.stamp(this.slug());
      this.justStamped.set(first);
      this.announcement.set(
        first ? 'Tudo certo! Carimbo conquistado.' : 'Tudo certo de novo! Carimbo conquistado, e a data do primeiro acerto continua valendo.',
      );
    } else {
      this.announcement.set(`Você acertou ${result.correctCount} de ${this.questions().length}. Leia as explicações e tente de novo.`);
    }
  }
}
