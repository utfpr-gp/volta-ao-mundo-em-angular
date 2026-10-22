import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_NAME, SITE_URL, canonicalUrl } from './site';

export interface SeoPage {
  title: string;
  description: string;
  /** Caminho da página sem o baseHref, por exemplo 'capitulos/09-signals'. */
  path: string;
  noindex: boolean;
  jsonLd: object;
}

/** Escreve no <head> tudo o que buscadores e redes sociais leem de uma página. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  apply(page: SeoPage): void {
    const url = canonicalUrl(page.path);

    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: `${SITE_URL}/og.png` });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:type', content: page.path.replace(/\//g, '') ? 'article' : 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'pt_BR' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    if (page.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex' });
    } else {
      this.meta.removeTag('name="robots"');
    }

    this.headElement('link[rel="canonical"]', () => {
      const link = this.document.createElement('link');
      link.rel = 'canonical';
      return link;
    }).setAttribute('href', url);

    const script = this.headElement('script#jsonld', () => {
      const element = this.document.createElement('script');
      element.id = 'jsonld';
      element.type = 'application/ld+json';
      return element;
    });
    // "<" escapado para que nenhum texto do conteúdo feche a tag <script> antes da hora.
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', ...page.jsonLd }).replace(/</g, '\\u003c');
  }

  private headElement(selector: string, create: () => HTMLElement): HTMLElement {
    const existing = this.document.head.querySelector<HTMLElement>(selector);
    if (existing) return existing;
    const element = create();
    this.document.head.appendChild(element);
    return element;
  }
}
