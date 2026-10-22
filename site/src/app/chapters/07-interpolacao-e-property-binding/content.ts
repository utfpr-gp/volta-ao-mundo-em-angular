import type { ChapterContent } from '../types';

export const CHAPTER_07: ChapterContent = {
  summary: [
    'Binding liga um dado da classe a um lugar do template; aqui, o dado desce da classe para a tela.',
    'Interpolação, com `{{ }}`, mostra o resultado de uma expressão como texto.',
    'Property binding, com `[ ]`, dá valor a uma propriedade de um elemento: `[src]`, `[alt]`, `[disabled]`.',
    'Sem os colchetes, o valor vira texto literal, e não o dado da classe.',
    'O template é conferido com o TypeScript: nome errado vira erro antes de rodar.',
  ],
  essentials: ['07/etapa/src/app/featured-country/featured-country.html'],
  stage: '07-interpolacao-e-property-binding',
  questions: [
    {
      prompt: 'Qual linha mostra a bandeira cujo endereço está em `country.flagUrl`?',
      alternatives: [
        { text: '`<img src="country.flagUrl">`', explanation: 'Sem colchetes, o navegador procura um arquivo chamado literalmente "country.flagUrl".' },
        { text: '`<img [src]="country.flagUrl">`', correct: true, explanation: 'Isso: o property binding dá à propriedade `src` o valor que está na classe.' },
        { text: '`<img {{ src }}="country.flagUrl">`', explanation: 'A interpolação não pode ser usada como nome de atributo; ela vai no conteúdo ou no valor.' },
      ],
    },
    {
      prompt: 'Com `visited: true` na classe, o que faz `<button [disabled]="country.visited">`?',
      alternatives: [
        { text: 'Mostra o texto "true" dentro do botão.', explanation: 'Mostrar texto é trabalho da interpolação; aqui o valor vai para a propriedade `disabled`.' },
        { text: 'Dá erro, porque `disabled` só aceita texto.', explanation: '`disabled` é uma propriedade booleana; o binding passa `true` ou `false` direto.' },
        { text: 'Desabilita o botão.', correct: true, explanation: 'Isso: `disabled` recebe o valor booleano `true`.' },
      ],
    },
    {
      prompt: 'O que acontece se o template tiver `{{ country.nome }}`, mas a propriedade se chamar `name`?',
      alternatives: [
        { text: 'O Angular mostra o erro TS2339 ao compilar, antes de o app rodar.', correct: true, explanation: 'Isso: o template é conferido pelo TypeScript.' },
        { text: 'A tela mostra a palavra "nome".', explanation: 'A interpolação não mostra o texto da expressão; ela avalia a expressão, e aqui isso vira um erro.' },
        { text: 'A tela fica em branco naquele lugar, sem aviso nenhum.', explanation: 'Em JavaScript puro isso poderia acontecer; o Angular com TypeScript avisa antes.' },
      ],
    },
    {
      prompt: 'Onde deve ficar uma lógica mais complicada, como escolher qual país destacar?',
      alternatives: [
        { text: 'Dentro das chaves duplas, no template, para ficar perto de onde aparece.', explanation: 'O template pode ter expressões simples, mas lógica no template fica difícil de ler e de testar.' },
        { text: 'Na classe do componente; o template só mostra o resultado.', correct: true, explanation: 'Isso: template simples, lógica na classe.' },
        { text: 'No CSS do componente.', explanation: 'O CSS cuida da aparência, e não da lógica.' },
      ],
    },
  ],
  links: [
    { label: 'Binding dinâmico de texto, propriedades e atributos', url: 'https://angular.dev/guide/templates/binding' },
    { label: 'Expressões no template', url: 'https://angular.dev/guide/templates/expression-syntax' },
    { label: 'Erro NG8002', url: 'https://angular.dev/errors/NG8002' },
    { label: 'Atributos e propriedades no HTML (MDN)', url: 'https://developer.mozilla.org/pt-BR/docs/Web/HTML/Attributes' },
  ],
};
