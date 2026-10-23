import type { ChapterContent } from '../types';

export const CHAPTER_23: ChapterContent = {
  summary: [
    'Cada rota liga um endereço a um componente; o Router fica com a primeira que combina, de cima para baixo.',
    'O componente da rota aparece no `<router-outlet>`; o que é igual em toda tela fica fora dele.',
    '`routerLink` troca a tela sem recarregar; `routerLinkActive` e `ariaCurrentWhenActive` marcam o link atual.',
    '`redirectTo` com `pathMatch: \'full\'` para a página inicial; `**`, por último, para endereços que não existem.',
  ],
  essentials: ['23/etapa/src/app/app.routes.ts', '23/etapa/src/app/header/header.html'],
  stage: '23-router',
  questions: [
    {
      prompt: 'Por que a rota `**` vai por último na lista?',
      alternatives: [
        { text: 'Porque o Angular exige que ela seja a última, ou dá erro de compilação.', explanation: 'Não há erro: o app compila, e todo endereço cai na 404.' },
        { text: 'Porque ela combina com qualquer endereço, e o Router fica com a primeira que combina.', correct: true, explanation: 'Isso: lá em cima, ela engoliria todas as outras.' },
        { text: 'Porque as rotas são lidas de baixo para cima.', explanation: 'É o contrário: de cima para baixo.' },
      ],
    },
    {
      prompt: 'Qual a diferença entre `href="/sobre"` e `routerLink="/sobre"` num link interno?',
      alternatives: [
        { text: 'Nenhuma: os dois levam ao mesmo lugar do mesmo jeito.', explanation: 'Levam ao mesmo endereço, mas o `href` recarrega o app inteiro.' },
        { text: 'O `routerLink` só funciona em botões.', explanation: 'Funciona em links; é neles que ele preenche o `href`.' },
        { text: 'O `href` recarrega a página; o `routerLink` troca só a tela, e o app continua de pé.', correct: true, explanation: 'Isso: com `href`, o que estava na memória se perde.' },
      ],
    },
    {
      prompt: 'Onde aparece o componente da rota atual?',
      alternatives: [
        { text: 'Logo depois do `<router-outlet>`.', correct: true, explanation: 'Isso: o outlet é o portão onde as telas aparecem.' },
        { text: 'No lugar do `<app-header>`.', explanation: 'O cabeçalho fica fora do outlet e aparece em toda tela.' },
        { text: 'Numa nova aba do navegador.', explanation: 'A tela troca dentro da mesma página, sem abrir aba.' },
      ],
    },
  ],
  links: [
    { label: 'Roteamento no Angular', url: 'https://angular.dev/guide/routing' },
    { label: 'Definir rotas', url: 'https://angular.dev/guide/routing/define-routes' },
    { label: 'aria-current (MDN)', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current' },
  ],
};
