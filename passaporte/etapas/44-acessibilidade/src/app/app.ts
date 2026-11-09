import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Footer } from './core/layout/footer/footer';
import { ErrorReport } from './core/error-report';
import { ApiStatus } from './core/http/api-status';
import { Loading } from './core/http/loading';
import { Header } from './core/layout/header/header';
import { PageFocus, pageOf } from './core/page-focus';
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
  protected readonly errorReport = inject(ErrorReport);
  private readonly pageFocus = inject(PageFocus);

  constructor() {
    // Depois de cada troca de página, o foco vai para o título da página nova: o leitor de tela o lê, e o Tab segue dali.
    // Na primeira página, o foco fica onde o navegador o pôs; entre as abas de um país, fica na aba.
    let lastPage: string | null = null;
    inject(Router)
      .events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        const page = pageOf(event.urlAfterRedirects);
        if (lastPage !== null && page !== lastPage) this.pageFocus.focusPage(); // [!code highlight]
        lastPage = page;
      });
  }

  protected skipToContent(): void {
    this.pageFocus.focusPage();
  }

  protected reload(): void {
    location.reload();
  }
}
