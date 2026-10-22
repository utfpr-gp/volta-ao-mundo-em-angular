import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { REPOSITORY_URL } from '../seo/site';
import { BrandMark } from './brand-mark';

@Component({
  selector: 'vm-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BrandMark],
  host: { class: 'mt-20 block border-t border-line bg-surface-raised' },
  template: `
    <div class="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-10 text-sm text-ink-muted sm:px-8 md:flex-row md:items-start md:justify-between">
      <div class="flex max-w-2xl gap-4">
        <vm-brand-mark class="shrink-0" />
        <div>
          <p class="font-bold text-ink">
            Volta ao Mundo em Angular · Prof. Roni Fabio Banaszewski · Tecnologia em Sistemas para Internet · UTFPR Guarapuava
          </p>
          <p class="mt-2">
            Texto sob a licença
            <a href="https://creativecommons.org/licenses/by/4.0/deed.pt-br" rel="license noopener">CC BY 4.0</a>;
            código sob a licença <a [href]="repository + '/blob/main/LICENSE'" rel="noopener">MIT</a>.
            Sem rastreamento de visitantes.
          </p>
        </div>
      </div>
      <nav aria-label="Rodapé">
        <ul class="flex flex-wrap gap-x-5 gap-y-2 font-semibold">
          <li><a routerLink="/passaporte">Meu passaporte</a></li>
          <li><a routerLink="/glossario">Glossário</a></li>
          <li><a routerLink="/sobre">Sobre o livro</a></li>
          <li><a [href]="repository" rel="noopener">Código no GitHub</a></li>
        </ul>
      </nav>
    </div>
  `,
})
export class Footer {
  protected readonly repository = REPOSITORY_URL;
}
