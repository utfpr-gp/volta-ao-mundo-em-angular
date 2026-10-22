import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Os links da documentação oficial e de outras fontes, no fim do capítulo. */
@Component({
  selector: 'vm-further-links',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose block' },
  template: `
    <ul class="grid gap-3 sm:grid-cols-2">
      @for (link of links(); track link.url) {
        <li>
          <a
            [href]="link.url"
            rel="noopener"
            class="group flex h-full items-start gap-3 rounded-2xl border border-line bg-surface-raised p-4 no-underline hover:border-link"
          >
            <span aria-hidden="true" class="mt-0.5 text-link">↗</span>
            <span>
              <span class="block font-bold text-ink group-hover:text-link">{{ link.label }}</span>
              <span class="block text-sm text-ink-muted">{{ host(link.url) }}</span>
            </span>
          </a>
        </li>
      }
    </ul>
  `,
})
export class FurtherLinks {
  readonly links = input.required<{ label: string; url: string }[]>();

  protected host(url: string): string {
    return new URL(url).host.replace(/^www\./, '');
  }
}
