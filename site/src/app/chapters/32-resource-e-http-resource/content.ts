import type { ChapterContent } from '../types';

export const CHAPTER_32: ChapterContent = {
  summary: [
    '`httpResource(() => url)` faz o GET, guarda a resposta e informa `status()`, `isLoading()`, `error()` e `hasValue()`.',
    'Quando um signal lido na função muda, o resource busca de novo e cancela a requisição anterior; `undefined` deixa o resource parado.',
    'Confira `hasValue()` antes de ler `value()`: ele é undefined enquanto carrega e lança um erro no status `error`.',
    'Resources são para buscar; para salvar, o `HttpClient` com um PUT ou POST, quando a pessoa age.',
  ],
  essentials: ['32/etapa/src/app/core/passport.ts', '32/etapa/src/app/features/country-detail/country-weather/country-weather.ts'],
  stage: '32-resource-e-http-resource',
  questions: [
    {
      prompt: 'Na aba Clima, a pessoa troca de °C para °F enquanto a primeira resposta ainda não chegou. O que o httpResource faz?',
      alternatives: [
        { text: 'Espera a primeira resposta e só depois faz a segunda.', explanation: 'Esperar não adianta: a primeira já não interessa.' },
        { text: 'Cancela a requisição em °C e faz uma nova em °F.', correct: true, explanation: 'Isso: como o switchMap, só a mais nova importa.' },
        { text: 'Nada: é preciso chamar reload() à mão.', explanation: 'A unidade é um signal lido na função; mudar o signal basta.' },
      ],
    },
    {
      prompt: 'O que acontece ao ler `value()` de um resource no status `error`?',
      alternatives: [
        { text: 'Devolve undefined.', explanation: 'Isso é antes de a resposta chegar; no erro, ele lança.' },
        { text: 'Devolve o último valor que deu certo.', explanation: 'No erro não; é por isso que se confere hasValue() antes.' },
        { text: 'Lança um erro.', correct: true, explanation: 'Isso: "Resource is currently in an error state".' },
      ],
    },
    {
      prompt: 'Por que o PUT do passaporte não é um httpResource?',
      alternatives: [
        { text: 'Porque o resource refaz a requisição sempre que um signal lido muda: salvar deve acontecer quando a pessoa age.', correct: true, explanation: 'Isso: resource para buscar; HttpClient para salvar.' },
        { text: 'Porque o httpResource só aceita URLs da API do livro.', explanation: 'Ele aceita qualquer URL; o problema é o momento da requisição.' },
        { text: 'Porque o json-server não aceita httpResource.', explanation: 'O servidor nem sabe quem fez a requisição; o problema está no app.' },
      ],
    },
  ],
  links: [
    { label: 'httpResource', url: 'https://angular.dev/guide/http/http-resource' },
    { label: 'Resources assíncronos com signals', url: 'https://angular.dev/guide/signals/resource' },
    { label: 'Open-Meteo', url: 'https://open-meteo.com' },
  ],
};
