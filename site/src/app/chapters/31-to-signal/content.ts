import type { ChapterContent } from '../types';

export const CHAPTER_31: ChapterContent = {
  summary: [
    '`toSignal(observable, { initialValue })` se inscreve, guarda o último valor num signal e cancela sozinho quando o componente some.',
    '`toObservable(signal)` leva um signal para a esteira do RxJS; ele entrega só o último valor de cada ciclo.',
    'Os dois precisam de um contexto de injeção: crie-os num campo da classe, e nunca dentro de um `computed`.',
    'Para valores que vão para a tela, a ponte; para ações, como um PUT, o `subscribe` continua sendo o caminho.',
  ],
  essentials: ['31/etapa/src/app/shared/local-clock/local-clock.ts', '31/etapa/src/app/features/countries/country-list/country-list.ts'],
  stage: '31-to-signal',
  questions: [
    {
      prompt: 'O que o `toSignal` faz quando o componente que o criou é destruído?',
      alternatives: [
        { text: 'Nada: é preciso um `takeUntilDestroyed` antes dele.', explanation: 'Não é preciso: o toSignal cancela a inscrição sozinho.' },
        { text: 'Cancela a inscrição no Observable.', correct: true, explanation: 'Isso: por isso o relógio perdeu o DestroyRef.' },
        { text: 'Reinicia o Observable do começo.', explanation: 'Ele encerra a inscrição; não começa outra.' },
      ],
    },
    {
      prompt: 'Sem `initialValue`, quanto vale o signal do `toSignal` antes da primeira emissão?',
      alternatives: [
        { text: 'Uma string vazia.', explanation: 'O Angular não tem como adivinhar o tipo do valor.' },
        { text: 'Ele lança um erro ao ser lido.', explanation: 'Isso só acontece com a opção requireSync, quando não há valor síncrono.' },
        { text: '`undefined`.', correct: true, explanation: 'Isso: e o TypeScript inclui o undefined no tipo.' },
      ],
    },
    {
      prompt: 'O signal muda para "j", "ja" e "jap" no mesmo instante. O que o `toObservable` entrega?',
      alternatives: [
        { text: 'Só "jap".', correct: true, explanation: 'Isso: ele entrega o valor quando o Angular olha o signal, no próximo ciclo.' },
        { text: '"j", "ja" e "jap", nessa ordem.', explanation: 'As duas primeiras mudanças acontecem antes de o Angular olhar o signal.' },
        { text: 'Nada, porque foi rápido demais.', explanation: 'O último valor sempre chega.' },
      ],
    },
  ],
  links: [
    { label: 'RxJS interop: toSignal', url: 'https://angular.dev/ecosystem/rxjs-interop' },
    { label: 'RxJS: interval', url: 'https://rxjs.dev/api/index/function/interval' },
  ],
};
