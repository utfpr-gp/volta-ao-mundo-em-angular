import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-countries',
  template: `
    <ul>
      @for (country of countries(); track country) { <!-- [!code highlight] -->
        <li>{{ country }}</li>
      }
    </ul>
  `,
})
export class Countries {
  countries = signal(['Brasil', 'Japão', 'Portugal']);
}
