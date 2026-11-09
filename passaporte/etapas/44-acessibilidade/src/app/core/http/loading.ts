import { computed, Service, signal } from '@angular/core';

/** Quantas requisições estão a caminho agora. Enquanto houver alguma, o app mostra a barra de carregamento. */
@Service()
export class Loading {
  private readonly pending = signal(0);
  readonly busy = computed(() => this.pending() > 0);

  start(): void {
    this.pending.update((count) => count + 1);
  }

  stop(): void {
    this.pending.update((count) => count - 1);
  }
}
