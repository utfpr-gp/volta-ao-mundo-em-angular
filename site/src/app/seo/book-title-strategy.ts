import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SeoService } from './seo';
import { PageData, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './site';

const AUTHOR = {
  '@type': 'Person',
  name: 'Roni Fabio Banaszewski',
  jobTitle: 'Professor',
  affiliation: { '@type': 'CollegeOrUniversity', name: 'UTFPR Guarapuava' },
};

const COURSE = {
  '@type': 'Course',
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: `${SITE_URL}/`,
  inLanguage: 'pt-BR',
  isAccessibleForFree: true,
  license: 'https://creativecommons.org/licenses/by/4.0/',
  author: AUTHOR,
  provider: {
    '@type': 'CollegeOrUniversity',
    name: 'UTFPR Guarapuava',
    sameAs: 'https://www.utfpr.edu.br/campus/guarapuava',
  },
};

/** Monta o título de cada página e aproveita a navegação para atualizar as tags de SEO. */
@Injectable({ providedIn: 'root' })
export class BookTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot) ?? SITE_NAME;
    const data = this.deepest(snapshot.root).data as Partial<PageData>;
    const path = snapshot.url.split(/[?#]/)[0].replace(/^\/+|\/+$/g, '');
    const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} · ${SITE_NAME}`;
    const description = data.description ?? SITE_DESCRIPTION;

    this.seo.apply({
      title: fullTitle,
      description,
      path,
      noindex: data.kind === 'coming-soon' || data.kind === 'not-found',
      jsonLd: this.jsonLd(path, data.kind, title, description),
    });
  }

  private jsonLd(path: string, kind: PageData['kind'] | undefined, title: string, description: string): object {
    if (!path) return COURSE;
    const common = { name: title, description, url: `${SITE_URL}/${path}/`, inLanguage: 'pt-BR' };
    if (kind === 'chapter') {
      return {
        '@type': 'LearningResource',
        ...common,
        learningResourceType: 'Capítulo de livro',
        educationalLevel: 'Graduação',
        isAccessibleForFree: true,
        author: AUTHOR,
        isPartOf: { '@type': 'Course', name: SITE_NAME, url: `${SITE_URL}/` },
      };
    }
    return { '@type': 'WebPage', ...common, isPartOf: { '@type': 'Course', name: SITE_NAME, url: `${SITE_URL}/` } };
  }

  private deepest(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    return route.firstChild ? this.deepest(route.firstChild) : route;
  }
}
