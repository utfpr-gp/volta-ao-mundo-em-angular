import type { ChapterContent } from '../types';

export const CHAPTER_46: ChapterContent = {
  summary: [
    'Uma SPA entrega o mesmo `index.html` para todo endereço, com o `<app-root>` vazio: quem não roda JavaScript não vê nada.',
    'Pré-renderizar (SSG) gera no build o HTML de cada página: `RenderMode.Prerender`, e `getPrerenderParams` para rotas com parâmetro.',
    'Rotas de quem entrou ficam `RenderMode.Client`; a hidratação aproveita o HTML pronto no navegador.',
    'Um `TitleStrategy` próprio escreve título, descrição e Open Graph de cada página com os services `Title` e `Meta`.',
    '`sitemap.xml` lista as páginas, `robots.txt` diz o que os robôs visitam; a auditoria de SEO do Lighthouse confere.',
  ],
  essentials: ['46/etapa/src/app/app.routes.server.ts', '46/etapa/src/app/core/seo-title-strategy.ts'],
  stage: '46-seo',
  questions: [
    {
      prompt: 'O que um robô que não roda JavaScript recebe ao pedir /paises/JP de uma SPA comum?',
      alternatives: [
        { text: 'A página do Japão, como uma pessoa veria.', explanation: 'Isso só acontece com o JavaScript rodando, ou com a página pré-renderizada.' },
        {
          text: 'O mesmo `index.html` de qualquer página: o título do app e um `<app-root>` vazio.',
          correct: true,
          explanation: 'Isso: o conteúdo só aparece depois que o JavaScript roda no navegador.',
        },
        { text: 'Um erro 404.', explanation: 'O servidor de uma SPA devolve o index.html para todo endereço; o problema é que ele vem vazio.' },
      ],
    },
    {
      prompt: 'A rota `paises/:code/visao-geral` é `RenderMode.Prerender`. O que mais ela precisa?',
      alternatives: [
        {
          text: 'Um `getPrerenderParams` que diga quais códigos gerar.',
          correct: true,
          explanation: 'Isso: sem ele, o build não sabe quais países existem, e recusa.',
        },
        { text: 'Nada: o Angular descobre os países sozinho.', explanation: 'O build não tem como adivinhar os valores de :code.' },
        { text: 'Um servidor Node no ar.', explanation: 'A pré-renderização acontece no build; o resultado são arquivos estáticos.' },
      ],
    },
    {
      prompt: 'Por que /passaporte e /entrar ficam como `RenderMode.Client`?',
      alternatives: [
        { text: 'Porque elas são lentas demais para pré-renderizar.', explanation: 'O tempo não é o motivo.' },
        {
          text: 'Porque dependem de quem entrou, e não interessam a um buscador.',
          correct: true,
          explanation: 'Isso: no build não há ninguém logado, e o Google não deve listar a tela de alguém.',
        },
        { text: 'Porque rotas com guard não podem ser pré-renderizadas.', explanation: 'O motivo é o conteúdo: é de cada pessoa, e não do site.' },
      ],
    },
    {
      prompt: 'Um componente de uma página pré-renderizada lê o `localStorage` ao ser criado. O que acontece no build?',
      alternatives: [
        { text: 'O build ignora a linha.', explanation: 'O build roda o app de verdade, e a linha roda também.' },
        {
          text: '`ReferenceError: localStorage is not defined`, e a página não é gerada.',
          correct: true,
          explanation: 'Isso: no build, o app roda no Node.js, onde não há localStorage.',
        },
        { text: 'O localStorage vem vazio.', explanation: 'Ele nem existe no Node.js: a referência é que falha.' },
      ],
    },
  ],
  links: [
    { label: 'Renderização no servidor e pré-renderização', url: 'https://angular.dev/guide/ssr' },
    { label: 'Hidratação', url: 'https://angular.dev/guide/hydration' },
    { label: 'Os services Title e Meta', url: 'https://angular.dev/api/platform-browser/Meta' },
    { label: 'O protocolo Open Graph', url: 'https://ogp.me/' },
    { label: 'Sitemaps (Google)', url: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview' },
  ],
};
