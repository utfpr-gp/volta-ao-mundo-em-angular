import { ActivatedRouteSnapshot, Route, Routes } from '@angular/router';
import { CHAPTERS, trackById } from './catalog/catalog';
import { LOADERS } from './chapters/loaders';
import { PageData, SITE_DESCRIPTION, SITE_NAME } from './seo/site';
import { plainText } from './shared/inline-code';

const loadComingSoon = () => import('./chapters/coming-soon').then((m) => m.ComingSoon);
const loadNotFound = () => import('./pages/not-found').then((m) => m.NotFound);

const chapterRoutes: Routes = CHAPTERS.map((chapter): Route => {
  const loader = chapter.published ? LOADERS[chapter.slug] : undefined;
  const data: PageData = {
    kind: loader ? 'chapter' : 'coming-soon',
    slug: chapter.slug,
    description: chapter.description,
  };
  return {
    path: `capitulos/${chapter.slug}`,
    title: plainText(chapter.question),
    loadComponent: loader ?? loadComingSoon,
    data,
  };
});

const trackFrom = (route: ActivatedRouteSnapshot) => trackById(route.paramMap.get('trilha') ?? '');

const page = (description: string): PageData => ({ kind: 'page', description });
const notFound: PageData = { kind: 'not-found', description: 'Este endereço não existe no livro.' };

export const routes: Routes = [
  {
    path: '',
    title: SITE_NAME,
    loadComponent: () => import('./pages/home').then((m) => m.Home),
    data: page(SITE_DESCRIPTION),
  },
  {
    path: 'passaporte',
    title: 'Meu passaporte',
    loadComponent: () => import('./pages/passport').then((m) => m.Passport),
    data: page('Os carimbos que você conquistou em cada trilha do livro, o seu progresso pelo mundo do Angular e a cópia de segurança do passaporte.'),
  },
  {
    path: 'trilhas/:trilha',
    title: (route) => {
      const track = trackFrom(route);
      return track ? `Trilha ${track.name}` : 'Trilha não encontrada';
    },
    loadComponent: () => import('./pages/track').then((m) => m.Track),
    data: page('Os capítulos de uma trilha do livro e a sua referência rápida.'),
    resolve: {
      description: (route: ActivatedRouteSnapshot) => trackFrom(route)?.summary ?? notFound.description,
      kind: (route: ActivatedRouteSnapshot) => (trackFrom(route) ? 'page' : 'not-found'),
    },
  },
  ...chapterRoutes,
  {
    path: 'glossario',
    title: 'Glossário',
    loadComponent: () => import('./pages/glossary-page').then((m) => m.GlossaryPage),
    data: page('Os termos técnicos do Angular e do desenvolvimento web explicados em poucas palavras, cada um ligado ao capítulo onde aparece.'),
  },
  {
    path: 'busca',
    title: 'Busca',
    loadComponent: () => import('./pages/search-page').then((m) => m.SearchPage),
    data: page('Procure qualquer assunto em todos os capítulos, no glossário e nas referências rápidas do livro.'),
  },
  {
    path: 'sobre',
    title: 'Sobre o livro',
    loadComponent: () => import('./pages/about').then((m) => m.About),
    data: page('Quem escreveu o Volta ao Mundo em Angular, como citar, as licenças do texto e do código e a política de privacidade do site.'),
  },
  { path: '404', title: 'Destino não encontrado', loadComponent: loadNotFound, data: notFound },
  { path: '**', title: 'Destino não encontrado', loadComponent: loadNotFound, data: notFound },
];
