import { Component, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Country } from '../../core/country';
import { Passport } from '../../core/passport';
import { FlagPipe } from '../../shared/flag-pipe';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, FlagPipe],
  selector: 'app-country-page',
  templateUrl: './country-page.html',
})
export class CountryPage {
  private readonly router = inject(Router);
  protected readonly passport = inject(Passport);

  /** O país que o countryResolver entregou: quando a tela abre, ele já está aqui. undefined só se a API falhou. */
  readonly country = input<Country>(); // [!code highlight]

  /** Endereços relativos: a partir de /paises/JP, 'clima' leva a /paises/JP/clima. */
  protected readonly tabs = [
    { path: 'visao-geral', label: 'Visão geral' },
    { path: 'clima', label: 'Clima' },
    { path: 'anotacoes', label: 'Anotações' },
  ];

  protected drawAnother(): void {
    const others = this.passport.countries().filter((country) => country.code !== this.country()?.code);
    const next = others[Math.floor(Math.random() * others.length)];
    this.router.navigate(['/paises', next.code]);
  }
}
