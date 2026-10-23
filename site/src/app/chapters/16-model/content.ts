import type { ChapterContent } from '../types';

export const CHAPTER_16: ChapterContent = {
  summary: [
    '`model()` é um input que o próprio filho pode mudar com `set`; cada mudança avisa o pai.',
    'No pai, `[(rating)]="rating"` liga nos dois sentidos, com o signal sem parênteses.',
    '`[(x)]` é atalho para `[x]="valor"` mais `(xChange)="..."`.',
    'Use `model()` em componentes de controle; no resto, prefira `input()` e `output()`.',
  ],
  essentials: ['16/etapa/src/app/star-rating/star-rating.ts', '16/two-way'],
  stage: '16-model',
  questions: [
    {
      prompt: 'Qual linha liga a nota do pai às estrelas nos dois sentidos?',
      alternatives: [
        { text: '`<app-star-rating [(rating)]="rating()" />`', explanation: 'Com parênteses, o Angular não tem onde gravar o valor novo: erro NG5002.' },
        { text: '`<app-star-rating ([rating])="rating" />`', explanation: 'A ordem é colchetes por fora: "banana na caixa", `[( )]`.' },
        { text: '`<app-star-rating [(rating)]="rating" />`', correct: true, explanation: 'Isso: o signal sem chamar, dentro da banana na caixa.' },
      ],
    },
    {
      prompt: 'No filho, o que permite fazer `rating.set(4)`?',
      alternatives: [
        { text: 'Declarar `rating = model(0)`.', correct: true, explanation: 'Isso: o model é um input que o filho também pode mudar.' },
        { text: 'Declarar `rating = input(0)`.', explanation: 'Input só é lido pelo filho; `set` não existe nele.' },
        { text: 'Declarar `rating = output<number>()`.', explanation: 'Output dispara avisos com `emit`; não guarda um valor.' },
      ],
    },
    {
      prompt: '`[(rating)]="rating"` é um atalho para qual par de bindings?',
      alternatives: [
        { text: '`[rating]="rating()"` e `(ratingChange)="rating.set($event)"`', correct: true, explanation: 'Isso: o valor desce, e a mudança sobe pelo evento `ratingChange`.' },
        { text: '`[rating]="rating()"` e `(click)="rating.set($event)"`', explanation: 'O evento do model se chama `ratingChange`, e não `click`.' },
        { text: '`(rating)="rating"` e `[ratingChange]="rating()"`', explanation: 'Os papéis estão trocados: o valor desce com colchetes e a mudança sobe com parênteses.' },
      ],
    },
    {
      prompt: 'Num cartão de país que só mostra dados e avisa cliques, o que usar?',
      alternatives: [
        { text: '`model()` em tudo, para o cartão poder mudar o país do pai.', explanation: 'O cartão não edita o país; deixar o pai como dono dos dados é mais claro.' },
        { text: '`input()` para o país e `output()` para os avisos.', correct: true, explanation: 'Isso: o model fica para componentes de controle, que editam um valor.' },
        { text: 'Nenhum dos dois: o cartão lê o país direto do pai.', explanation: 'O filho não enxerga as propriedades do pai; elas chegam por input.' },
      ],
    },
  ],
  links: [
    { label: 'Two-way binding com model', url: 'https://angular.dev/guide/components/inputs#model-inputs' },
    { label: 'Two-way binding no template', url: 'https://angular.dev/guide/templates/two-way-binding' },
  ],
};
