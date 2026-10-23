import { Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  protected readonly appName = 'Passaporte';
  protected readonly menuOpen = signal(false);
}
