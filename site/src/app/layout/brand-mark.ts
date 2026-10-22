import { ChangeDetectionStrategy, Component } from '@angular/core';

/** O símbolo do livro: um passaporte com o globo na capa. */
@Component({
  selector: 'vm-brand-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-grid place-items-center' },
  template: `
    <svg aria-hidden="true" viewBox="0 0 32 40" class="h-9 w-7">
      <rect x="1" y="1" width="30" height="38" rx="4" class="fill-stamp" />
      <rect x="4" y="1" width="2" height="38" class="fill-primary opacity-25" />
      <circle cx="17.5" cy="17" r="7.5" fill="none" stroke="white" stroke-width="1.6" />
      <ellipse cx="17.5" cy="17" rx="3.2" ry="7.5" fill="none" stroke="white" stroke-width="1.3" />
      <path d="M10 17h15" stroke="white" stroke-width="1.3" />
      <path d="M12 31h11" stroke="white" stroke-width="1.6" stroke-linecap="round" />
    </svg>
  `,
})
export class BrandMark {}
