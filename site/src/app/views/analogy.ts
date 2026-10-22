import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** O cartão da analogia do cotidiano. */
@Component({
  selector: 'vm-analogy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-6 block' },
  template: `
    <aside class="flex gap-5 rounded-2xl border border-idea/25 bg-idea/8 p-6" [attr.aria-label]="'Analogia: ' + title()">
      <span aria-hidden="true" class="text-5xl leading-none">{{ emoji() }}</span>
      <div>
        <p class="text-[13px] font-extrabold uppercase tracking-[0.18em] text-idea">Analogia</p>
        <p class="mt-1 text-xl font-extrabold text-ink">{{ title() }}</p>
        <div class="prose prose-lg mt-2 max-w-none"><ng-content /></div>
      </div>
    </aside>
  `,
})
export class Analogy {
  readonly emoji = input.required<string>();
  readonly title = input.required<string>();
}
