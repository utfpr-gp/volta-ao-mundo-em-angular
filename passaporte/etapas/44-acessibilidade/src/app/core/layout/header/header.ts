import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../auth';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  protected readonly auth = inject(Auth);
  private readonly router = inject(Router);
  protected readonly appName = 'Passaporte';
  protected readonly menuOpen = signal(false);
  protected readonly links = [
    { path: '/paises', label: 'Países' },
    { path: '/passaporte', label: 'Meu passaporte' },
    { path: '/sobre', label: 'Sobre' },
  ];

  protected async signOut(): Promise<void> {
    this.menuOpen.set(false);
    await this.auth.signOut();
    await this.router.navigateByUrl('/paises');
  }
}
