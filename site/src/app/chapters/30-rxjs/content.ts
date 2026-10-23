import type { ChapterContent } from '../types';

export const CHAPTER_30: ChapterContent = {
  summary: [
    'Um Observable é uma esteira de valores ao longo do tempo; o `pipe` monta as estações, e o `subscribe` liga tudo.',
    'Na busca: `map` simplifica, `filter` barra, `debounceTime` espera a pausa, `distinctUntilChanged` ignora repetidos.',
    '`switchMap` troca cada valor por uma requisição e cancela a anterior; o `catchError` dentro dele impede que um erro desligue a esteira.',
    'Num componente, `takeUntilDestroyed()` no constructor desliga a esteira quando o componente some.',
  ],
  essentials: ['30/etapa/src/app/features/countries/country-list/country-list.ts', '30/etapa/src/app/core/passport.ts'],
  stage: '30-rxjs',
  questions: [
    {
      prompt: 'A pessoa digita "japao" rapidinho. Com `debounceTime(300)`, quantos valores passam?',
      alternatives: [
        { text: 'Cinco, um por letra.', explanation: 'Isso seria sem o debounceTime.' },
        { text: 'Um só, "japao", 300 ms depois da última letra.', correct: true, explanation: 'Isso: ele espera uma pausa antes de deixar passar.' },
        { text: 'Nenhum: o debounceTime descarta textos longos.', explanation: 'Ele não olha o tamanho, só o tempo entre os valores.' },
      ],
    },
    {
      prompt: 'Um PUT ainda está a caminho quando a pessoa digita mais e outro começa. O que o `switchMap` faz?',
      alternatives: [
        { text: 'Espera o primeiro terminar para enviar o segundo.', explanation: 'Esse é o concatMap.' },
        { text: 'Deixa os dois correrem juntos.', explanation: 'Esse é o mergeMap.' },
        { text: 'Cancela o primeiro e fica só com o mais novo.', correct: true, explanation: 'Isso: só a versão mais nova importa.' },
      ],
    },
    {
      prompt: 'Por que o `catchError` fica dentro do `switchMap`, e não no fim da esteira?',
      alternatives: [
        { text: 'Para o erro morrer ali, e a esteira de fora continuar recebendo as próximas anotações.', correct: true, explanation: 'Isso: um erro que chega ao subscribe encerra a inscrição.' },
        { text: 'Porque o TypeScript não aceita catchError no fim.', explanation: 'Aceita; o problema é que a esteira terminaria no primeiro erro.' },
        { text: 'Para o erro aparecer no console.', explanation: 'É o contrário: ele segura o erro e devolve EMPTY.' },
      ],
    },
  ],
  links: [
    { label: 'RxJS: guia de operadores', url: 'https://rxjs.dev/guide/operators' },
    { label: 'RxJS interop do Angular (takeUntilDestroyed)', url: 'https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed' },
  ],
};
