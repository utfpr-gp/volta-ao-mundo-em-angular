import type { ChapterContent } from '../types';

export const CHAPTER_03: ChapterContent = {
  summary: [
    'Use `const` por padrão e `let` só para o que muda; template strings usam crase e `${}`.',
    'Arrow functions são funções curtas: `(c) => c.name`.',
    'Desestruturação tira valores de objetos e arrays; `...` copia para um novo, sem mudar o original.',
    '`filter` escolhe quem passa, `map` transforma cada item, `find` acha o primeiro.',
    '`?.` e `??` evitam o erro de ler propriedade de `undefined`.',
    'Uma Promise é um valor que chega depois; `await` espera por ele dentro de uma função `async`.',
  ],
  essentials: ['03/map-filter', '03/spread', '03/async-await'],
  questions: [
    {
      prompt: 'O que este código mostra? `[1, 2, 3, 4].filter((n) => n > 2).map((n) => n * 10)`',
      alternatives: [
        { text: '`[30, 40]`', correct: true, explanation: 'Isso: o filter deixa passar 3 e 4, e o map multiplica cada um por 10.' },
        { text: '`[10, 20, 30, 40]`', explanation: 'Aqui faltou o filter: só 3 e 4 passam no teste `n > 2`.' },
        { text: '`[3, 4]`', explanation: 'Esse é o resultado do filter; depois dele, o map ainda multiplica cada um por 10.' },
      ],
    },
    {
      prompt: 'Depois de `const updated = [...visited, \'Chile\']`, o que acontece com o array `visited`?',
      alternatives: [
        { text: 'Ganha o Chile no fim.', explanation: 'O espalhamento cria um array novo; o original não muda.' },
        { text: 'Continua igual; o Chile está só em `updated`.', correct: true, explanation: 'Isso: os três pontos copiam para um array novo.' },
        { text: 'Fica vazio, porque os itens foram movidos.', explanation: 'Nada é movido: os itens são copiados.' },
      ],
    },
    {
      prompt: 'Qual destas linhas devolve o nome do país, ou `undefined` se o país não existir, sem dar erro?',
      alternatives: [
        { text: '`country.name`', explanation: 'Se `country` for `undefined`, isso dá o erro Cannot read properties of undefined.' },
        { text: '`country ?? name`', explanation: 'O `??` escolhe um valor reserva; não lê a propriedade `name`.' },
        { text: '`country?.name`', correct: true, explanation: 'Isso: o `?.` só continua se `country` existir.' },
      ],
    },
    {
      prompt: 'Você esqueceu o `await` e o `console.log` mostrou `Promise { <pending> }`. O que isso quer dizer?',
      alternatives: [
        {
          text: 'Que você imprimiu a promessa do valor, e não o valor, que ainda não tinha chegado.',
          correct: true,
          explanation: 'Isso: é a senha da lanchonete. Com `await`, você espera o valor chegar.',
        },
        { text: 'Que o servidor recusou o pedido.', explanation: 'Uma recusa apareceria como erro. `pending` quer dizer "ainda esperando".' },
        { text: 'Que a função tem um erro de digitação.', explanation: 'O código rodou; só faltou esperar a Promise.' },
      ],
    },
    {
      prompt: 'Por que `(name) => { title: name }` devolve `undefined`?',
      alternatives: [
        { text: 'Porque arrow functions não podem devolver objetos.', explanation: 'Podem, sim: basta envolver o objeto em parênteses.' },
        {
          text: 'Porque as chaves viram o corpo da função, e não há `return` dentro dele.',
          correct: true,
          explanation: 'Isso: para devolver um objeto direto, escreva `(name) => ({ title: name })`.',
        },
        { text: 'Porque falta declarar `title` com `const`.', explanation: 'Dentro de um objeto, `title` é uma propriedade, e não uma variável.' },
      ],
    },
  ],
  links: [
    { label: 'Guia de JavaScript da MDN, em português', url: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide' },
    { label: 'Arrow functions (MDN)', url: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions/Arrow_functions' },
    { label: 'Atribuição via desestruturação (MDN)', url: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Destructuring' },
    { label: 'Array.prototype.map (MDN)', url: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/map' },
    { label: 'async function (MDN)', url: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/async_function' },
    { label: 'O Angular e o TypeScript', url: 'https://angular.dev/overview' },
  ],
};
