import type { ChapterContent } from '../types';

export const CHAPTER_10: ChapterContent = {
  summary: [
    '`@if (condicao) { ... } @else { ... }` mostra um bloco ou outro conforme a condição.',
    '`@switch (valor)` com `@case` e `@default` escolhe um entre vários blocos.',
    'Signals na condição levam parênteses: `@if (visited())`.',
    'O bloco que não vale é removido da página, e não só escondido.',
    'A regra fica num computed na classe; o template só escolhe o que mostrar.',
  ],
  essentials: ['10/etapa/src/app/world-progress/world-progress.html'],
  stage: '10-if-e-switch',
  questions: [
    {
      prompt: 'Qual template mostra "Carimbado!" só quando o signal `visited` é verdadeiro?',
      alternatives: [
        { text: '`@if (visited) { <p>Carimbado!</p> }`', explanation: 'Sem parênteses, a condição é o signal, que sempre existe: o TypeScript avisa com TS2774.' },
        { text: '`@if (visited()) { <p>Carimbado!</p> }`', correct: true, explanation: 'Isso: o signal é lido com parênteses dentro da condição.' },
        { text: '`<p @if="visited()">Carimbado!</p>`', explanation: 'O `@if` é um bloco do template, e não um atributo.' },
      ],
    },
    {
      prompt: 'Com `@switch (level())` e casos para `airport`, `backpacker` e `traveler`, o que aparece se o nível for `explorer`?',
      alternatives: [
        { text: 'O bloco do `@default`, se houver; se não houver, nada.', correct: true, explanation: 'Isso: o `@default` vale quando nenhum `@case` bate.' },
        { text: 'O primeiro `@case`, porque ele é o padrão.', explanation: 'O primeiro caso só aparece se bater com o valor.' },
        { text: 'Um erro, porque todo valor precisa ter um `@case`.', explanation: 'Não há erro: sem `@default`, simplesmente nada aparece.' },
      ],
    },
    {
      prompt: 'Quando a condição de um `@if` passa a ser falsa, o que acontece com os elementos de dentro?',
      alternatives: [
        { text: 'Ficam invisíveis, com um `display: none` automático.', explanation: 'Esse seria o caminho do CSS; o `@if` vai além.' },
        { text: 'Continuam na tela até a página recarregar.', explanation: 'A tela acompanha o estado na hora.' },
        { text: 'São removidos da página e criados de novo se a condição voltar a ser verdadeira.', correct: true, explanation: 'Isso: o ramo que não vale não existe no HTML.' },
      ],
    },
    {
      prompt: 'Onde deve ficar a regra "com 10 países, a pessoa vira viajante"?',
      alternatives: [
        { text: 'Num `computed` na classe; o template só faz o `@switch` com o resultado.', correct: true, explanation: 'Isso: regra na classe, escolha no template.' },
        { text: 'Dentro de cada `@case`, com a conta completa escrita no template.', explanation: 'Funciona, mas espalha a regra pelo template e dificulta mudar e testar.' },
        { text: 'No CSS, com uma classe para cada nível.', explanation: 'O CSS cuida da aparência, e não da regra.' },
      ],
    },
  ],
  links: [
    { label: 'Controle de fluxo no template', url: 'https://angular.dev/guide/templates/control-flow' },
    { label: 'Erro NG5002', url: 'https://angular.dev/errors/NG5002' },
    { label: 'Aviso NG8103', url: 'https://angular.dev/extended-diagnostics/NG8103' },
  ],
};
