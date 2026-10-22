import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { chapterByNumber } from '../catalog/catalog';
import { plainText } from '../shared/inline-code';

/** Liga um capítulo a outro que ele usa: "você viu isso no capítulo N". */
@Component({
  selector: 'vm-see-chapter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    @if (chapter(); as chapter) {
      <a [routerLink]="['/capitulos', chapter.slug]" [attr.title]="question()" class="font-semibold">
        <ng-content>capítulo {{ chapter.number }}</ng-content>
      </a>
    }
  `,
})
export class SeeChapter {
  readonly number = input.required<number>();
  protected readonly chapter = computed(() => chapterByNumber(this.number()));
  protected readonly question = computed(() => plainText(this.chapter()?.question ?? ''));
}
