import { afterNextRender } from '@angular/core';

constructor() {
  afterNextRender(() => {
    // Roda uma vez, depois que o componente aparece na tela, e só no navegador.
    console.log('largura do cartão:', this.card().nativeElement.offsetWidth);
  });
}
