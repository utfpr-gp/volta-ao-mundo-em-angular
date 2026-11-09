import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { DEFAULT_DESCRIPTION, SITE_URL } from './site';

/**
 * A cada navegação, o roteador chama o updateTitle. Esta estratégia faz o que a padrão faz (o <title>) e, de quebra,
 * escreve a descrição e as tags de compartilhamento (Open Graph) da página. No build, isso vai para o HTML de cada página.
 */
@Injectable()
export class SeoTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot) ?? 'Passaporte';
    const description = deepest(snapshot.root).data['description'] ?? DEFAULT_DESCRIPTION; // [!code highlight]
    const url = SITE_URL + snapshot.url.split(/[?#]/)[0];

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description }); // [!code highlight]
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: `${SITE_URL}/og.png` });
  }
}

/** A rota mais funda da navegação: é ela que diz em que página a pessoa está. */
function deepest(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
  return route.firstChild ? deepest(route.firstChild) : route;
}
