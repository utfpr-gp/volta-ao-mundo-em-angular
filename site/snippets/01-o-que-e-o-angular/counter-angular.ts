import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <button (click)="increment()">
      Cliques: {{ total() }}
    </button>
  `,
})
export class Counter {
  total = signal(0); // [!code highlight]

  increment() {
    this.total.update((value) => value + 1);
  }
}
