import type { ChapterContent } from '../types';

export const CHAPTER_26: ChapterContent = {
  summary: [
    '`loadComponent: () => import(...).then((m) => m.Page)` separa a tela num chunk, baixado só quando a rota é aberta.',
    '`loadChildren` carrega um grupo de rotas de uma vez, como a página do país com as abas.',
    'Um `import` comum da página no topo do arquivo de rotas a põe de volta no `main`.',
    'A saída do `ng build` mostra o ganho: o `main` menor e a lista de `Lazy chunk files`.',
  ],
  essentials: ['26/etapa/src/app/app.routes.ts', '26/etapa/src/app/pages/country-page/country.routes.ts'],
  stage: '26-lazy-loading',
  questions: [
    {
      prompt: 'Com `loadComponent`, quando o navegador baixa o código da página Sobre?',
      alternatives: [
        { text: 'Junto com o `main`, quando o app abre.', explanation: 'Esse é o comportamento sem lazy loading.' },
        { text: 'Quando alguém navega para `/sobre` pela primeira vez.', correct: true, explanation: 'Isso: e, depois de baixado, fica na memória.' },
        { text: 'Toda vez que alguém navega para `/sobre`.', explanation: 'O chunk é baixado uma vez só; as próximas visitas usam o que já chegou.' },
      ],
    },
    {
      prompt: 'Num app pequeno, com a primeira tela também sob demanda, por que o total baixado ao abrir quase não muda?',
      alternatives: [
        { text: 'Porque o lazy loading não funciona em apps pequenos.', explanation: 'Funciona: os chunks aparecem na saída do build.' },
        { text: 'Porque o navegador ignora os chunks na primeira visita.', explanation: 'Os chunks da primeira tela são baixados logo de cara.' },
        { text: 'Porque a primeira tela é baixada de qualquer jeito, e o Angular é a maior parte do `main`.', correct: true, explanation: 'Isso: o ganho vem das telas que a pessoa não abre.' },
      ],
    },
    {
      prompt: 'Depois de uma publicação, quem estava com o app aberto vê "Failed to fetch dynamically imported module". Por quê?',
      alternatives: [
        { text: 'O `main` antigo pede um chunk com nome antigo, que a publicação apagou.', correct: true, explanation: 'Isso: recarregar a página traz a versão nova.' },
        { text: 'O lazy loading não funciona depois de publicar.', explanation: 'Funciona: quem abre o app depois da publicação não vê o erro.' },
        { text: 'A internet caiu bem na hora.', explanation: 'Poderia ser, mas aqui o arquivo realmente não existe mais.' },
      ],
    },
  ],
  links: [
    { label: 'Estratégias de carregamento de rotas', url: 'https://angular.dev/guide/routing/loading-strategies' },
    { label: 'import() dinâmico (MDN)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import' },
  ],
};
