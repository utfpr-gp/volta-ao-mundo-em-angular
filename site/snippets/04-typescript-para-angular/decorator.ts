import { Component, signal } from '@angular/core';

@Component({ // [!code highlight]
  selector: 'app-passport', // [!code highlight]
  template: `<h1>Países visitados: {{ visited() }}</h1>`, // [!code highlight]
}) // [!code highlight]
export class Passport {
  protected readonly visited = signal<number>(0);
}
