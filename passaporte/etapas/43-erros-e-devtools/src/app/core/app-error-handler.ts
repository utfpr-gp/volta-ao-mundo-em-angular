import { ErrorHandler, inject, Injectable } from '@angular/core';
import { ErrorReport } from './error-report';

/**
 * O lugar por onde passa todo erro que ninguém tratou: de um componente, de um effect, de um guard, e, com o
 * provideBrowserGlobalErrorListeners(), também os do navegador. Este mantém o comportamento padrão e avisa a pessoa.
 */
@Injectable()
export class AppErrorHandler extends ErrorHandler {
  private readonly report = inject(ErrorReport);

  override handleError(error: unknown): void {
    super.handleError(error); // o padrão: o erro completo no console, para quem desenvolve // [!code highlight]
    this.report.show(); // e uma frase para quem usa o app // [!code highlight]
  }
}
