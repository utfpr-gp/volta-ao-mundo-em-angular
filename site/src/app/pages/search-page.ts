import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'vm-search-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1 class="px-4 py-10 text-4xl font-extrabold">Busca</h1>`,
})
export class SearchPage {}
