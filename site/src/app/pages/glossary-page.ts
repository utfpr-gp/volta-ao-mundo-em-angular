import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'vm-glossary-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1 class="px-4 py-10 text-4xl font-extrabold">Glossário</h1>`,
})
export class GlossaryPage {}
