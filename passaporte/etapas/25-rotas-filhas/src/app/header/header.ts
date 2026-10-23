import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  protected readonly appName = 'Passaporte';
  protected readonly menuOpen = signal(false);
  protected readonly links = [
    { path: '/paises', label: 'Países' },
    { path: '/sobre', label: 'Sobre' },
  ];
}
