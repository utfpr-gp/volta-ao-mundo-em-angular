export const SITE_URL = 'https://utfpr-gp.github.io/volta-ao-mundo-em-angular';
export const SITE_NAME = 'Volta ao Mundo em Angular';
export const SITE_DESCRIPTION =
  'Um livro aberto e interativo que ensina Angular moderno, do zero ao deploy, construindo um app de verdade, com simuladores, desafios e carimbos.';
export const REPOSITORY_URL = 'https://github.com/utfpr-gp/volta-ao-mundo-em-angular';

export type PageKind = 'chapter' | 'coming-soon' | 'page' | 'not-found';

/** O que cada rota declara em `data`, e que o SEO e a moldura do site leem. */
export interface PageData {
  kind: PageKind;
  description: string;
  slug?: string;
}
