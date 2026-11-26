import { Service, signal } from '@angular/core';

/** Se aconteceu um erro que ninguém tratou. Quem escreve é o AppErrorHandler; quem lê é o aviso do app. */
@Service()
export class ErrorReport {
  readonly visible = signal(false, { debugName: 'aviso de erro' });

  show(): void {
    this.visible.set(true);
  }

  dismiss(): void {
    this.visible.set(false);
  }
}
