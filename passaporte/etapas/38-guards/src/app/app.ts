import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './core/layout/footer/footer';
import { Header } from './core/layout/header/header';
import { Passport } from './core/passport';

@Component({
  imports: [RouterOutlet, Header, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly passport = inject(Passport);
}
