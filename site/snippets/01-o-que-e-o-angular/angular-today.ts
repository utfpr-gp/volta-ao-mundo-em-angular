import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-greeting',
  template: `
    @if (visible()) {
      <p>Olá, {{ name() }}</p>
    }
  `,
})
export class Greeting {
  name = signal('Ana');
  visible = signal(true);
}
