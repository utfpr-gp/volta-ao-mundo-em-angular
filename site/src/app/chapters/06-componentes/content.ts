import type { ChapterContent } from '../types';

export const CHAPTER_06: ChapterContent = {
  summary: [
    'Um componente junta template (HTML), estilo (CSS) e classe (TypeScript) numa pasta.',
    'Atomic Design: átomos, moléculas, organismos, template e página.',
    '`ng generate component nome` cria o componente com os quatro arquivos.',
    'Para usar um componente: põe a classe no `imports` e escreve a tag do `selector` no template.',
    'O CSS de cada componente só vale para ele; o global fica em `src/styles.css`.',
  ],
  essentials: ['06/etapa/src/app/app.ts', '06/etapa/src/app/app.html'],
  stage: '06-componentes',
  questions: [
    {
      prompt: 'No Atomic Design, o cartão de um país (bandeira, nome e capital juntos) é…',
      alternatives: [
        { text: 'um átomo, porque é uma peça pequena da tela.', explanation: 'Átomos não se dividem; o cartão é feito de três átomos.' },
        { text: 'uma molécula: átomos juntos com um propósito.', correct: true, explanation: 'Isso: bandeira, nome e capital formam o cartão.' },
        { text: 'um organismo, porque aparece várias vezes na tela.', explanation: 'Repetir não faz de algo um organismo; a lista inteira de cartões é que é o organismo.' },
      ],
    },
    {
      prompt: 'Você escreveu `<app-header />` no template do App e apareceu o erro NG8001. Qual é a causa mais provável?',
      alternatives: [
        { text: 'O `Header` não está no `imports` do App.', correct: true, explanation: 'Isso: sem importar, o Angular não conhece a tag.' },
        { text: 'O `header.css` está vazio, então o componente não pode ser desenhado.', explanation: 'Um CSS vazio é permitido; o componente aparece sem estilo próprio.' },
        { text: 'A tag precisa ser fechada como `<app-header></app-header>`, e não com `/>`.', explanation: 'As duas formas funcionam no Angular; o problema é o import.' },
      ],
    },
    {
      prompt: 'O que o `selector` de um componente define?',
      alternatives: [
        { text: 'Qual arquivo CSS o componente usa.', explanation: 'Isso é o `styleUrl`.' },
        { text: 'Quais componentes ele pode usar dentro do template.', explanation: 'Isso é o `imports`.' },
        { text: 'O nome da tag que representa o componente no HTML.', correct: true, explanation: 'Isso: com `selector: \'app-header\'`, o componente aparece onde estiver `<app-header />`.' },
      ],
    },
    {
      prompt: 'A `CountryList` e o `Header` têm, cada um, uma classe CSS chamada `.card`. O que acontece?',
      alternatives: [
        { text: 'Cada `.card` vale só dentro do seu componente; não há conflito.', correct: true, explanation: 'Isso: o Angular isola o CSS de cada componente.' },
        { text: 'A regra do último componente carregado vence e estraga o outro.', explanation: 'Esse seria o comportamento do CSS global; o CSS do componente é isolado.' },
        { text: 'O Angular mostra um erro de nome duplicado ao compilar.', explanation: 'Não há erro: nomes iguais em componentes diferentes são permitidos.' },
      ],
    },
    {
      prompt: 'Por que a `CountryList` ainda tem três cartões escritos à mão, em vez de um componente `CountryCard` usado três vezes?',
      alternatives: [
        { text: 'Porque o Angular não deixa usar o mesmo componente mais de uma vez na tela.', explanation: 'Deixa, sim: o mesmo componente pode aparecer quantas vezes quiser.' },
        { text: 'Porque o `CountryCard` precisaria receber o país de fora, e isso é o `input()`, de um capítulo mais adiante.', correct: true, explanation: 'Isso: sem receber dados, os três cartões seriam iguais.' },
        { text: 'Porque componentes pequenos deixam o app mais lento.', explanation: 'Dividir em componentes pequenos não deixa o app lento; é o jeito recomendado.' },
      ],
    },
  ],
  links: [
    { label: 'Anatomia de um componente', url: 'https://angular.dev/guide/components' },
    { label: 'Seletores de componentes', url: 'https://angular.dev/guide/components/selectors' },
    { label: 'Estilos de componentes', url: 'https://angular.dev/guide/components/styling' },
    { label: 'Referência do ng generate component', url: 'https://angular.dev/cli/generate/component' },
    { label: 'Atomic Design, de Brad Frost', url: 'https://atomicdesign.bradfrost.com/chapter-2/' },
  ],
};
