import type { ChapterContent } from '../types';

export const CHAPTER_24: ChapterContent = {
  summary: [
    'Os dois-pontos marcam um parâmetro: `paises/:code` combina com `/paises/JP`, `/paises/PT` e qualquer outro código.',
    'Com `withComponentInputBinding()`, o parâmetro chega ao input de mesmo nome: `code = input.required<string>()`.',
    'Quando só o parâmetro muda, o componente é reaproveitado: derive os dados com `computed`, e não no `ngOnInit`.',
    'Link para lugares conhecidos; `inject(Router).navigate([...])` quando o destino depende de uma ação.',
  ],
  essentials: ['24/etapa/src/app/app.routes.ts', '24/etapa/src/app/pages/country-page/country-page.ts'],
  stage: '24-parametros-de-rota',
  questions: [
    {
      prompt: 'Com a rota `paises/:code`, o que o componente recebe em `/paises/JP`?',
      alternatives: [
        { text: "O input `code` com o valor `'JP'`, se o `withComponentInputBinding()` estiver ligado.", correct: true, explanation: 'Isso: o parâmetro chega ao input de mesmo nome.' },
        { text: "O input `paises` com o valor `'JP'`.", explanation: 'O nome do input é o do parâmetro, o que vem depois dos dois-pontos.' },
        { text: 'Nada: parâmetros só podem ser lidos no `app.routes.ts`.', explanation: 'O componente recebe o valor, e é para isso que serve o parâmetro.' },
      ],
    },
    {
      prompt: 'De `/paises/JP` para `/paises/PT`, o que acontece com o `CountryPage`?',
      alternatives: [
        { text: 'É destruído e criado de novo, e o `ngOnInit` roda outra vez.', explanation: 'A rota é a mesma: o Router reaproveita o componente.' },
        { text: 'O mesmo componente continua, e só o valor do input muda.', correct: true, explanation: 'Isso: por isso o país vem de um `computed`.' },
        { text: 'A página inteira recarrega.', explanation: 'Navegar com o Router nunca recarrega a página.' },
      ],
    },
    {
      prompt: 'Quando faz sentido navegar pelo código, com `router.navigate`, em vez de um link?',
      alternatives: [
        { text: 'Sempre: links são coisa do HTML antigo.', explanation: 'Links são o certo para lugares conhecidos: o leitor de tela e o "abrir em nova aba" dependem deles.' },
        { text: 'Só na página 404.', explanation: 'Na 404, o destino é conhecido: um link resolve.' },
        { text: 'Quando o destino depende de uma ação, como um sorteio ou um formulário salvo.', correct: true, explanation: 'Isso: o destino só existe depois do clique.' },
      ],
    },
  ],
  links: [
    { label: 'Ler o estado da rota', url: 'https://angular.dev/guide/routing/read-route-state' },
    { label: 'Navegar para rotas', url: 'https://angular.dev/guide/routing/navigate-to-routes' },
  ],
};
