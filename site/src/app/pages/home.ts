import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'vm-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1 class="px-4 py-10 text-4xl font-extrabold">Volta ao Mundo em Angular</h1>`,
})
export class Home {}
