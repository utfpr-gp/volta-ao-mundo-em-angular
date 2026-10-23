import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { COUNTRIES, findCountry } from '../../countries';
import { FlagPipe } from '../../flag-pipe';

@Component({
  imports: [RouterLink, FlagPipe],
  selector: 'app-country-page',
  templateUrl: './country-page.html',
})
export class CountryPage {
  private readonly router = inject(Router);

  /** Vem do endereço: em /paises/JP, o :code da rota chega aqui como 'JP'. */
  readonly code = input.required<string>();
  protected readonly country = computed(() => findCountry(this.code()));

  protected drawAnother(): void {
    const others = COUNTRIES.filter((country) => country.code !== this.country()?.code);
    const next = others[Math.floor(Math.random() * others.length)];
    this.router.navigate(['/paises', next.code]);
  }
}
