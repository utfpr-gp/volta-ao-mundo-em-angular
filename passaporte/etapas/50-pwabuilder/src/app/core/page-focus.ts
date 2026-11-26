import { DOCUMENT } from '@angular/common';
import { afterNextRender, inject, Injector, Service } from '@angular/core';

/** Leva o foco ao título da página: depois de cada troca de página, e no atalho "Pular para o conteúdo". */
@Service()
export class PageFocus {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  /** Põe o foco no h1 do <main> (ou no próprio <main>), depois que a tela nova for desenhada. */
  focusPage(): void {
    afterNextRender(
      () => {
        const main = this.document.querySelector('main');
        const target = main?.querySelector('h1') ?? main;
        if (!target) return;
        // Um título não recebe foco sozinho. Com tabindex -1, o código pode focá-lo, e o Tab continua passando reto.
        target.setAttribute('tabindex', '-1');
        target.focus();
      },
      { injector: this.injector },
    );
  }
}

/** A "página" de um endereço: /paises/JP/clima e /paises/JP/anotacoes são a mesma página, com abas diferentes. */
export function pageOf(url: string): string {
  return url.split(/[?#]/)[0].split('/').slice(0, 3).join('/');
}
