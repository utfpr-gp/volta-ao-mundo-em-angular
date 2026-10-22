import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { chapterBySlug, trackById } from '../catalog/catalog';
import { ChapterNav } from '../views/chapter-nav';
import { ChapterHeader } from '../views/chapter-header';

/** A página de um capítulo que ainda não foi escrito. */
@Component({
  selector: 'vm-coming-soon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ChapterHeader, ChapterNav],
  template: `
    @if (chapter(); as chapter) {
      <div data-coming-soon class="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        <vm-chapter-header [chapter]="chapter">
          <div
            stamp
            class="grid size-36 -rotate-6 place-items-center rounded-full border-4 border-dashed border-on-primary-muted/50 text-center text-sm font-extrabold uppercase tracking-widest text-on-primary-muted/80"
          >
            <span>Em<br />breve</span>
          </div>
        </vm-chapter-header>

        <section class="mt-10 rounded-card border border-line bg-surface-raised p-6 sm:p-8">
          <h2 class="text-2xl font-extrabold">Este capítulo ainda está sendo escrito.</h2>
          <p class="mt-3 max-w-2xl text-ink-muted">
            Ele vai ganhar a missão, a analogia, um simulador, a prática guiada, as armadilhas mais comuns e um desafio que vale
            um carimbo no seu passaporte. Enquanto isso, siga pelos capítulos que já estão prontos na trilha
            <a [routerLink]="['/trilhas', chapter.track]">{{ track()?.name }}</a>.
          </p>
        </section>

        <vm-chapter-nav class="mt-10" [slug]="chapter.slug" />
      </div>
    }
  `,
})
export class ComingSoon {
  private readonly slug: string = inject(ActivatedRoute).snapshot.data['slug'];

  protected readonly chapter = computed(() => chapterBySlug(this.slug));
  protected readonly track = computed(() => trackById(this.chapter()?.track ?? ''));
}
