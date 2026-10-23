import type { ChapterContent } from '../types';

export const CHAPTER_15: ChapterContent = {
  summary: [
    '`input()` declara o que o filho recebe; `input.required<T>()` quando não pode faltar.',
    'Um input é um signal só de leitura: o filho lê com `country()` e nunca muda.',
    '`output<T>()` declara um aviso; o filho dispara com `.emit(valor)`.',
    'No pai: `[country]="..."` passa o dado; `(toggled)="metodo($event)"` recebe o aviso.',
    'Quem muda os dados é o dono deles: o filho avisa, o pai muda.',
  ],
  essentials: ['15/etapa/src/app/country-card/country-card.ts', '15/usage'],
  stage: '15-input-e-output',
  questions: [
    {
      prompt: 'Como o pai passa um país para o `CountryCard`?',
      alternatives: [
        { text: '`<app-country-card (country)="country" />`', explanation: 'Parênteses são para eventos; para passar dados, use colchetes.' },
        { text: '`<app-country-card [country]="country" />`', correct: true, explanation: 'Isso: property binding no input do filho.' },
        { text: '`<app-country-card country="{{ country }}" />`', explanation: 'A interpolação viraria texto; o input espera o objeto do país.' },
      ],
    },
    {
      prompt: 'O cartão quer avisar o pai que o país foi removido. O que ele faz?',
      alternatives: [
        { text: 'Tira o país do array do pai diretamente.', explanation: 'O filho não mexe nos dados do pai; ele avisa.' },
        { text: '`this.country.set(null)`, para o país sumir da tela.', explanation: 'Input não tem `set`: o filho só lê.' },
        { text: 'Dispara um output: `removed.emit(country().code)`.', correct: true, explanation: 'Isso: o pai recebe o aviso e decide o que fazer.' },
      ],
    },
    {
      prompt: 'No pai, `(toggled)="toggleVisited($event)"`. O que é o `$event` aqui?',
      alternatives: [
        { text: 'O valor que o filho mandou no `emit`, aqui o código do país.', correct: true, explanation: 'Isso: o `$event` de um output é o dado emitido.' },
        { text: 'O evento de clique do navegador, com a posição do mouse.', explanation: 'Isso seria num `(click)`; num output, é o que o filho emitiu.' },
        { text: 'O componente filho inteiro, para o pai mexer nele.', explanation: 'O pai recebe só o dado emitido, e não o componente.' },
      ],
    },
    {
      prompt: 'O que acontece se o pai usar `<app-country-card />` sem passar o `country` obrigatório?',
      alternatives: [
        { text: 'O cartão aparece vazio, sem nenhum aviso de erro.', explanation: 'Com `input.required`, o Angular não deixa compilar.' },
        { text: 'O Angular mostra o erro NG8008 ao compilar.', correct: true, explanation: 'Isso: o input obrigatório precisa ser passado.' },
        { text: 'O cartão usa o primeiro país da lista como valor padrão.', explanation: 'Não há valor padrão num input obrigatório.' },
      ],
    },
  ],
  links: [
    { label: 'Aceitando dados com inputs', url: 'https://angular.dev/guide/components/inputs' },
    { label: 'Eventos customizados com outputs', url: 'https://angular.dev/guide/components/outputs' },
    { label: 'Migração de @Input para input()', url: 'https://angular.dev/reference/migrations/signal-inputs' },
  ],
};
