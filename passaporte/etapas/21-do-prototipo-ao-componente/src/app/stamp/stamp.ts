import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-stamp',
  templateUrl: './stamp.html',
})
export class Stamp {
  readonly code = input.required<string>();
  /** No Figma, a variante "Carimbado": sim ou não. */
  readonly stamped = input(false);
}
