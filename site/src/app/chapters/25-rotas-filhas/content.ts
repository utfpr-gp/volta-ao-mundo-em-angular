import type { ChapterContent } from '../types';

export const CHAPTER_25: ChapterContent = {
  summary: [
    'Rotas filhas ficam em `children`, e o endereço delas continua o da mãe: `paises/:code` + `clima` = `/paises/JP/clima`.',
    'A rota mãe precisa de um `<router-outlet>` no template para mostrar as filhas.',
    'Links sem barra são relativos à rota do componente; com barra, partem da raiz.',
    'No Angular 22, as filhas herdam os parâmetros da mãe, e o input recebe o `:code` sem configuração extra.',
  ],
  essentials: ['25/etapa/src/app/app.routes.ts', '25/etapa/src/app/pages/country-page/country-page.html'],
  stage: '25-rotas-filhas',
  questions: [
    {
      prompt: 'O que acontece com o `CountryPage` quando a pessoa troca da aba Visão geral para a aba Clima?',
      alternatives: [
        { text: 'É destruído e criado de novo, junto com a aba.', explanation: 'A rota mãe é a mesma: só a filha troca.' },
        { text: 'Continua de pé; só o componente da aba troca no outlet de dentro.', correct: true, explanation: 'Isso: o outlet do CountryPage troca a aba.' },
        { text: 'A página inteira recarrega.', explanation: 'Navegar com o Router nunca recarrega a página.' },
      ],
    },
    {
      prompt: 'Dentro da página de `/paises/JP`, para onde leva `routerLink="clima"`?',
      alternatives: [
        { text: 'Para `/clima`.', explanation: 'Seria assim com barra: `/clima`, a partir da raiz.' },
        { text: 'Para `/paises/clima`.', explanation: 'O link é relativo à rota do componente, que inclui o código do país.' },
        { text: 'Para `/paises/JP/clima`.', correct: true, explanation: 'Isso: sem barra, o link parte da rota do componente.' },
      ],
    },
    {
      prompt: 'A anotação escrita numa aba some quando a pessoa troca de aba e volta. Por quê?',
      alternatives: [
        { text: 'A aba é destruída ao sair, e o signal da anotação morava nela.', correct: true, explanation: 'Isso: o dado precisa morar fora da aba, num service.' },
        { text: 'O Router apaga os signals de propósito a cada navegação.', explanation: 'O Router não mexe nos signals: o componente inteiro é que é destruído.' },
        { text: 'Faltou o `withComponentInputBinding()`.', explanation: 'Ele entrega parâmetros aos inputs; não guarda dados das abas.' },
      ],
    },
  ],
  links: [
    { label: 'Rotas filhas (rotas aninhadas)', url: 'https://angular.dev/guide/routing/define-routes#nested-routes' },
    { label: 'Outlets do Router', url: 'https://angular.dev/guide/routing/show-routes-with-outlets' },
  ],
};
