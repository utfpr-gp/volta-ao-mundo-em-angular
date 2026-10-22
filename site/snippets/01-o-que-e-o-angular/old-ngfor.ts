import { Component } from '@angular/core';

@Component({
  selector: 'app-countries',
  template: `
    <ul>
      <li *ngFor="let country of countries">{{ country }}</li> <!-- [!code highlight] -->
    </ul>
  `,
})
export class Countries {
  countries = ['Brasil', 'Japão', 'Portugal'];
}
