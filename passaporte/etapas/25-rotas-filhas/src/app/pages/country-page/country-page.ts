import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { COUNTRIES, findCountry } from '../../countries';
import { FlagPipe } from '../../flag-pipe';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, FlagPipe],
  selector: 'app-country-page',
  templateUrl: './country-page.html',
})
export class CountryPage {
  private readonly router = inject(Router);

  readonly code = input.required<string>();
  protected readonly country = computed(() => findCountry(this.code()));

  /** Endereços relativos: a partir de /paises/JP, 'clima' leva a /paises/JP/clima. */
  protected readonly tabs = [
    { path: 'visao-geral', label: 'Visão geral' },
    { path: 'clima', label: 'Clima' },
    { path: 'anotacoes', label: 'Anotações' },
  ];

  protected drawAnother(): void {
    const others = COUNTRIES.filter((country) => country.code !== this.country()?.code);
    const next = others[Math.floor(Math.random() * others.length)];
    this.router.navigate(['/paises', next.code]);
  }
}
