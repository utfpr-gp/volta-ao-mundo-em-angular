import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'vm-passport',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1 class="px-4 py-10 text-4xl font-extrabold">Meu passaporte</h1>`,
})
export class Passport {}
