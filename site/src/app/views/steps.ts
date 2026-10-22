import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, TemplateRef, computed, contentChildren, inject, input, linkedSignal } from '@angular/core';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';

/** Um passo da prática guiada: `<ng-template vmStep="Título do passo">…</ng-template>`. */
@Directive({ selector: 'ng-template[vmStep]' })
export class StepDirective {
  readonly title = input.required<string>({ alias: 'vmStep' });
  readonly template = inject(TemplateRef);
}

/**
 * A prática guiada em abas, um passo por aba. O Angular Aria cuida das setas do teclado,
 * do foco e dos papéis de acessibilidade; o estilo é nosso.
 */
@Component({
  selector: 'vm-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, Tabs, TabList, Tab, TabPanel, TabContent],
  host: { class: 'not-prose my-6 block' },
  styles: `
    [ngTabPanel][inert] {
      display: none;
    }
  `,
  template: `
    <div ngTabs class="rounded-2xl border border-line bg-surface-raised">
      <div
        ngTabList
        selectionMode="explicit"
        [(selectedTab)]="selected"
        [attr.aria-label]="label()"
        class="flex gap-1 overflow-x-auto border-b border-line px-2 pt-2"
      >
        @for (step of steps(); track $index) {
          <button
            ngTab
            type="button"
            [value]="'passo-' + $index"
            class="flex shrink-0 items-center gap-2 rounded-t-xl border-b-[3px] border-transparent px-4 py-2.5 font-bold text-ink-muted hover:text-ink aria-selected:border-code aria-selected:text-ink"
          >
            <span class="grid size-6 place-items-center rounded-full bg-code/12 text-xs font-extrabold text-code">{{ $index + 1 }}</span>
            {{ step.title() }}
          </button>
        }
      </div>
      @for (step of steps(); track $index) {
        <div ngTabPanel [value]="'passo-' + $index" [preserveContent]="true" class="px-5 py-5 outline-offset-[-3px]">
          <ng-template ngTabContent>
            <div class="prose prose-lg max-w-none">
              <ng-container [ngTemplateOutlet]="step.template" />
            </div>
          </ng-template>
        </div>
      }
    </div>
  `,
})
export class Steps {
  readonly label = input('Passos');
  protected readonly steps = contentChildren(StepDirective);
  protected readonly selected = linkedSignal<string | undefined>(() => (this.steps().length ? 'passo-0' : undefined));
}
