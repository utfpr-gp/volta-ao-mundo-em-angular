import { Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  imports: [HlmCardImports, HlmButtonImports],
  selector: 'app-country-card',
  templateUrl: './country-card.html',
})
export class CountryCard {
  protected readonly visited = signal(false);
}
