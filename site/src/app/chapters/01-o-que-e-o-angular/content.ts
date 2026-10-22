import type { ChapterContent } from '../types';

export const CHAPTER_01: ChapterContent = {
  summary: [
    'Uma SPA carrega a página uma vez e, depois, troca só o miolo da tela, pedindo ao servidor apenas os dados.',
    'Um framework chama o seu código: você escreve as peças, ele monta e faz funcionar.',
    'O Angular é completo, opinativo e escrito em TypeScript: rotas, formulários, HTTP e testes vêm de fábrica.',
    'Ao pesquisar, fuja do AngularJS (`$scope`, `ng-controller`) e prefira exemplos com `@if`, `@for` e `signal()`.',
  ],
  essentials: ['01/counter-angular', '01/angular-today'],
  questions: [
    {
      prompt: 'Numa SPA, o que o navegador costuma pedir ao servidor depois do primeiro acesso?',
      alternatives: [
        {
          text: 'A página HTML inteira, de novo, a cada clique.',
          explanation: 'Esse é o site tradicional. A SPA já tem a página na tela e não precisa baixá-la outra vez.',
        },
        {
          text: 'Só os dados que faltam, geralmente em `JSON`.',
          correct: true,
          explanation: 'Isso: cabeçalho e rodapé já estão na tela, então o servidor manda só a informação nova, e só o miolo é redesenhado.',
        },
        {
          text: 'Nada: depois do primeiro acesso, a SPA nunca mais conversa com o servidor.',
          explanation: 'Ela conversa, sim: os dados novos (países, mensagens, e-mails) continuam vindo do servidor. O que muda é que vêm só os dados.',
        },
      ],
    },
    {
      prompt: 'Qual frase resume a diferença entre uma biblioteca e um framework?',
      alternatives: [
        {
          text: 'A biblioteca é pequena e o framework é grande.',
          explanation: 'Tamanho não define: há bibliotecas enormes e frameworks enxutos. O que muda é quem chama quem.',
        },
        {
          text: 'A biblioteca serve para o servidor e o framework, para o navegador.',
          explanation: 'Os dois existem nos dois lugares. A diferença está em quem controla o fluxo do programa.',
        },
        {
          text: 'Você chama a biblioteca; o framework chama você.',
          correct: true,
          explanation: 'Exato: a diferença está em quem chama quem. Caixa de ferramentas de um lado, linha de montagem do outro.',
        },
      ],
    },
    {
      prompt: 'Você achou este trecho num tutorial. De qual Angular ele é?',
      snippet: '01/quiz-ngrepeat',
      alternatives: [
        {
          text: 'AngularJS, a primeira versão, de 2010.',
          correct: true,
          explanation: 'Isso: `ng-repeat` é uma pista certeira de AngularJS. É outro produto, sem suporte desde o fim de 2021. Feche o tutorial.',
        },
        {
          text: 'Angular de hoje, com um componente novo chamado `ng-repeat`.',
          explanation: 'Não existe `ng-repeat` no Angular de hoje. Atributos como `ng-repeat` e `ng-if` são a marca do AngularJS.',
        },
        {
          text: 'Não é Angular: é React.',
          explanation: 'O React escreve o HTML dentro do JavaScript, em JSX; `ng-repeat` num atributo é a marca do AngularJS.',
        },
      ],
    },
    {
      prompt: 'Por que o Angular é chamado de opinativo?',
      alternatives: [
        {
          text: 'Porque, sendo de código aberto, qualquer pessoa pode opinar e mudar o código dele.',
          explanation: 'Código aberto permite contribuir, mas "opinativo" fala das decisões que o framework já toma por você.',
        },
        {
          text: 'Porque cada equipe escolhe livremente as bibliotecas de rotas e formulários.',
          explanation: 'É o contrário: isso descreve o React. No Angular, rotas e formulários já vêm de fábrica.',
        },
        {
          text: 'Porque já decide muita coisa por você: linguagem, pastas, rotas, formulários e testes.',
          correct: true,
          explanation: 'Isso: menos escolhas para pesquisar e projetos parecidos entre si, em troca de mais conceitos no começo.',
        },
      ],
    },
    {
      prompt: 'O que o Angular tem que uma página feita só com JavaScript, atualizada à mão, não tem?',
      alternatives: [
        {
          text: 'Ele deixa o primeiro acesso ao site mais leve.',
          explanation: 'É o contrário: no simulador, a SPA baixa mais no primeiro acesso, porque traz o código do app junto.',
        },
        {
          text: 'Ele atualiza sozinho cada lugar da tela que mostra um valor, quando esse valor muda.',
          correct: true,
          explanation: 'Isso: a tela declara o que mostra, como uma fórmula de planilha, e o framework mantém tudo em dia.',
        },
        {
          text: 'Ele faz o site funcionar sem nenhum servidor.',
          explanation: 'Os dados continuam vindo de um servidor. O que o Angular resolve é manter a tela em dia com esses dados.',
        },
      ],
    },
  ],
  links: [
    { label: 'O que é o Angular?', url: 'https://angular.dev/overview' },
    { label: 'Playground: Angular no navegador, sem instalar nada', url: 'https://angular.dev/playground' },
    { label: 'Versões e suporte do Angular', url: 'https://angular.dev/reference/releases' },
    { label: 'Novidades do Angular 22', url: 'https://angular.dev/events/v22' },
    { label: 'Aprenda Angular: tutorial interativo no navegador', url: 'https://angular.dev/tutorials/learn-angular' },
    { label: 'SPA, no glossário da MDN', url: 'https://developer.mozilla.org/pt-BR/docs/Glossary/SPA' },
  ],
};
