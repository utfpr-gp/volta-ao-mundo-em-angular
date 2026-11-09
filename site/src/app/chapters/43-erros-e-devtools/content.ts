import type { ChapterContent } from '../types';

export const CHAPTER_43: ChapterContent = {
  summary: [
    'Erros com `TS` e `NG8` aparecem no terminal, antes de o app rodar; os com `NG0`, no console do navegador, com o app rodando.',
    'Uma mensagem tem código, problema, dica, lugar (arquivo, linha e coluna) e, nos do Angular, um link para angular.dev/errors.',
    'Na pilha de chamadas, a primeira linha com um nome seu é onde procurar.',
    'No `ng serve`, o objeto `ng` do console e a extensão Angular DevTools mostram componentes e signals do app rodando.',
    'Um `ErrorHandler` próprio recebe os erros sem dono: chame o `super.handleError` e avise a pessoa.',
  ],
  essentials: ['43/etapa/src/app/core/app-error-handler.ts', '43/ts2551'],
  stage: '43-erros-e-devtools',
  questions: [
    {
      prompt: 'Um erro começa com `TS2551`. Onde ele apareceu, e quando?',
      alternatives: [
        { text: 'No console do navegador, com o app rodando.', explanation: 'Esses começam com NG0. Os TS são do TypeScript, que lê o código antes.' },
        {
          text: 'No terminal do ng serve, antes de o app rodar: o TypeScript achou o problema lendo o código.',
          correct: true,
          explanation: 'Isso: e, enquanto ele existir, o app nem abre.',
        },
        { text: 'Só nos testes.', explanation: 'O ng test também compila, mas o ng serve mostra o mesmo erro.' },
      ],
    },
    {
      prompt: 'A pilha de um erro tem linhas de dentro do Angular e uma com `authGuard`. Por onde começar?',
      alternatives: [
        { text: 'Pela última linha, que é onde tudo começou.', explanation: 'A última costuma ser o começo da cadeia, longe do problema.' },
        {
          text: 'Pela primeira linha com um nome seu, o `authGuard`.',
          correct: true,
          explanation: 'Isso: o seu código é o que você pode mudar; as linhas do Angular raramente são o problema.',
        },
        { text: 'Pela primeira linha, mesmo que seja do Angular.', explanation: 'É onde o erro foi lançado, mas quase sempre por causa do que o seu código pediu.' },
      ],
    },
    {
      prompt: 'O NG8001 diz que `app-trip-form` não é um elemento conhecido. Qual é a correção?',
      alternatives: [
        { text: 'Pôr `CUSTOM_ELEMENTS_SCHEMA` no componente.', explanation: 'Isso é para Web Components: cala a mensagem, e o formulário some da tela.' },
        {
          text: 'Pôr o `TripForm` no `imports` do componente que usa a tag.',
          correct: true,
          explanation: 'Isso: é a primeira hipótese da mensagem, a que vale para componentes Angular.',
        },
        { text: 'Trocar o seletor para `trip-form`.', explanation: 'O nome não é o problema: o componente só não foi importado.' },
      ],
    },
    {
      prompt: 'Num build de produção, o console mostra só `ERROR C: NG0203`. O que fazer?',
      alternatives: [
        {
          text: 'Procurar o NG0203 em angular.dev/errors e reproduzir o erro no ng serve, onde a mensagem vem completa.',
          correct: true,
          explanation: 'Isso: o código sobrevive ao build de produção, e o modo de desenvolvimento mostra o resto.',
        },
        { text: 'Abrir o Angular DevTools no site publicado.', explanation: 'Ele só funciona em builds de desenvolvimento.' },
        { text: 'Procurar a função `C` no seu código.', explanation: 'C é o nome encurtado pelo build: não existe no seu código.' },
      ],
    },
  ],
  links: [
    { label: 'A lista de erros do Angular', url: 'https://angular.dev/errors' },
    { label: 'Erros sem tratamento no Angular', url: 'https://angular.dev/best-practices/error-handling' },
    { label: 'Angular DevTools', url: 'https://angular.dev/tools/devtools' },
    { label: 'O grafo de signals no DevTools', url: 'https://angular.dev/tools/devtools/signals' },
    { label: 'As funções do objeto ng', url: 'https://angular.dev/api/core/global' },
  ],
};
