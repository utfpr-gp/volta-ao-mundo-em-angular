import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'vm-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-8">
      <div
        aria-hidden="true"
        class="grid size-40 rotate-[-8deg] place-items-center rounded-full border-[5px] border-double border-stamp text-stamp"
      >
        <span class="text-5xl font-extrabold leading-none">404</span>
      </div>
      <h1 class="mt-10 text-4xl font-extrabold">Este destino não está no mapa</h1>
      <p class="mt-4 max-w-xl text-lg text-ink-muted">
        O endereço que você abriu não existe no livro. Pode ser um erro de digitação ou um link antigo.
        Escolha uma rota abaixo e siga viagem.
      </p>
      <ul class="mt-8 flex flex-wrap justify-center gap-3 font-bold">
        <li><a routerLink="/" class="block rounded-full bg-primary px-5 py-2.5 text-on-primary no-underline">Página inicial</a></li>
        <li><a routerLink="/capitulos/01-o-que-e-o-angular" class="block rounded-full border border-line bg-surface-raised px-5 py-2.5 no-underline">Começar pelo capítulo 1</a></li>
        <li><a routerLink="/busca" class="block rounded-full border border-line bg-surface-raised px-5 py-2.5 no-underline">Buscar no livro</a></li>
      </ul>
    </div>
  `,
})
export class NotFound {}
