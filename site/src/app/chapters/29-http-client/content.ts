import type { ChapterContent } from '../types';

export const CHAPTER_29: ChapterContent = {
  summary: [
    'No Angular 22, o `HttpClient` já está disponível: basta `inject(HttpClient)`, sem configurar nada.',
    '`get` e `put` devolvem Observables; a requisição só sai com `subscribe`, que diz o que fazer no `next` e no `error`.',
    'Um signal de status (carregando, pronto, erro) deixa a tela mostrar cada situação, com um botão de tentar de novo.',
    'O json-server cria uma API de verdade a partir de um arquivo `db.json`, para guardar o que é seu.',
  ],
  essentials: ['29/etapa/src/app/core/passport.ts', '29/etapa/src/app/features/countries/country-list/country-list.html'],
  stage: '29-http-client',
  questions: [
    {
      prompt: 'O service chama `this.http.get(COUNTRIES_URL)`, mas a aba Network fica vazia. Por quê?',
      alternatives: [
        { text: 'Faltou o `provideHttpClient()` no `app.config.ts`.', explanation: 'No Angular 22, o HttpClient já está disponível sem ele.' },
        { text: 'Ninguém se inscreveu: sem `subscribe`, o Observable não faz a requisição.', correct: true, explanation: 'Isso: o Observable só age quando alguém se inscreve.' },
        { text: 'A API demorou para responder.', explanation: 'Se demorasse, a requisição apareceria na aba Network, pendente.' },
      ],
    },
    {
      prompt: 'A API caiu. O que a lista do Passaporte mostra?',
      alternatives: [
        { text: 'A tela fica em branco, e o erro só aparece no console.', explanation: 'Com o `error` tratado, a tela sabe que algo deu errado.' },
        { text: '"Carregando os países…" para sempre.', explanation: 'O `error` muda o status para `erro`, e a tela troca a mensagem.' },
        { text: 'A mensagem de erro, com um botão para tentar de novo.', correct: true, explanation: 'Isso: o `@switch` olha o status, e o botão chama `load()`.' },
      ],
    },
    {
      prompt: 'Para que serve o json-server no Passaporte?',
      alternatives: [
        { text: 'Para guardar os países visitados e as anotações, que a API do livro não aceita gravar.', correct: true, explanation: 'Isso: a API do livro só lê; o json-server aceita PUT.' },
        { text: 'Para publicar o app na internet.', explanation: 'Ele roda só no seu computador, para desenvolver e estudar.' },
        { text: 'Para substituir o HttpClient.', explanation: 'Ele é o servidor; o HttpClient continua sendo quem faz as requisições.' },
      ],
    },
  ],
  links: [
    { label: 'Fazer requisições com o HttpClient', url: 'https://angular.dev/guide/http/making-requests' },
    { label: 'json-server', url: 'https://github.com/typicode/json-server' },
    { label: 'CORS (MDN)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS' },
  ],
};
