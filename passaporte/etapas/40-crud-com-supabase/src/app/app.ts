import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './core/layout/footer/footer';
import { ApiStatus } from './core/http/api-status';
import { Loading } from './core/http/loading';
import { Header } from './core/layout/header/header';
import { Passport } from './core/passport';

@Component({
  imports: [RouterOutlet, Header, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  /** Pedido logo ao abrir: os dados do passaporte começam a vir antes de qualquer tela precisar deles. */
  protected readonly passport = inject(Passport);
  protected readonly loading = inject(Loading);
  protected readonly apiStatus = inject(ApiStatus);
}
