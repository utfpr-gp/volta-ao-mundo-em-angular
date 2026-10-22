import type { ChapterContent } from '../types';

export const CHAPTER_11: ChapterContent = {
  summary: [
    '`@for (item of lista(); track item.id) { ... }` repete o bloco para cada item.',
    'O `track` é obrigatório e deve usar um identificador único do item.',
    '`@empty` aparece quando a lista está vazia; `$index`, `$count`, `$first` e `$last` dão a posição.',
    'Guarde o array num signal e mude-o com um array novo (`update` com `filter` ou `...`).',
    'Lista derivada, como a filtrada, é um `computed`.',
  ],
  essentials: ['11/new-for', '11/etapa/src/app/country-list/country-list.ts'],
  stage: '11-for-e-track',
  questions: [
    {
      prompt: 'Qual `track` é o melhor para uma lista de países com um código único cada?',
      alternatives: [
        { text: '`track $index`, porque a posição de cada item é sempre única.', explanation: 'Funciona, mas a posição muda quando a lista muda, e o Angular reescreve elementos à toa.' },
        { text: '`track country.name`, porque o nome é o que aparece na tela.', explanation: 'Funciona se os nomes forem únicos, mas o código é o identificador feito para isso.' },
        { text: '`track country.code`', correct: true, explanation: 'Isso: uma identidade estável deixa o Angular mexer só no que mudou.' },
      ],
    },
    {
      prompt: 'O que aparece quando o array do `@for` está vazio e há um bloco `@empty`?',
      alternatives: [
        { text: 'O conteúdo do `@empty`.', correct: true, explanation: 'Isso: é o lugar da mensagem de lista vazia.' },
        { text: 'Um erro, porque o `@for` não aceita array vazio.', explanation: 'Array vazio é normal; por isso existe o `@empty`.' },
        { text: 'Um item em branco, porque o `@for` sempre repete pelo menos uma vez.', explanation: 'O `@for` não repete nenhuma vez com array vazio.' },
      ],
    },
    {
      prompt: 'Qual código remove o Brasil do signal `countries`?',
      alternatives: [
        { text: "`countries().splice(0, 1)`", explanation: 'Isso mexe no array por dentro, sem avisar o signal; a tela pode não acompanhar.' },
        { text: "`countries.update((list) => list.filter((c) => c.code !== 'BR'))`", correct: true, explanation: 'Isso: um array novo, sem o Brasil, entregue ao signal.' },
        { text: "`delete countries.BR`", explanation: 'O signal não guarda os países por código; ele guarda um array.' },
      ],
    },
    {
      prompt: 'No simulador, por que o `track $index` reescreveu todos os cartões ao adicionar um país no começo?',
      alternatives: [
        { text: 'Porque o simulador recarregou a página.', explanation: 'Nada recarregou; o Angular só comparou as chaves.' },
        { text: 'Porque `$index` só funciona em listas de texto.', explanation: '`$index` funciona em qualquer lista; o problema é o que ele identifica.' },
        { text: 'Porque cada posição passou a ter outro país, e o Angular reescreveu o conteúdo de cada uma.', correct: true, explanation: 'Isso: a chave era a posição, e as posições mudaram de dono.' },
      ],
    },
  ],
  links: [
    { label: 'Controle de fluxo: @for', url: 'https://angular.dev/guide/templates/control-flow#repeat-content-with-the-for-block' },
    { label: 'Por que o track importa', url: 'https://angular.dev/guide/templates/control-flow#why-is-track-in-for-blocks-important' },
    { label: 'Migração do *ngFor para @for', url: 'https://angular.dev/reference/migrations/control-flow' },
  ],
};
