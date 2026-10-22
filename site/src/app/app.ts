import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer';
import { TopBar } from './layout/top-bar';

@Component({
  selector: 'vm-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, TopBar, Footer],
  host: { class: 'flex min-h-dvh flex-col' },
  template: `
    <a
      href="#conteudo"
      class="sr-only z-50 rounded-lg bg-highlight px-4 py-2 font-bold text-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Pular para o conteúdo
    </a>
    <vm-top-bar />
    <main id="conteudo" tabindex="-1" class="flex-1 outline-none">
      <router-outlet />
    </main>
    <vm-footer />
  `,
})
export class App {}
