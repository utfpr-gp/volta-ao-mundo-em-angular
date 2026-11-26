import { Service, signal } from '@angular/core';

/** Se a última requisição para a API do Passaporte falhou. Quem escreve é o errorInterceptor; quem lê é o aviso do app. */
@Service()
export class ApiStatus {
  readonly failed = signal(false);
}
