import type { ChapterContent } from '../types';

export const CHAPTER_39: ChapterContent = {
  summary: [
    'Um interceptor é uma função do tipo `HttpInterceptorFn`, `(req, next)`, por onde passa toda requisição do `HttpClient`.',
    'O que vem antes do `next(req)` acontece na ida; os operadores no `pipe` do resultado, na volta.',
    'Registre no `provideHttpClient`, com o `withInterceptors`: a ordem da lista é a da ida, e a volta é ao contrário.',
    'A requisição é imutável: para pôr o token, faça uma cópia com `req.clone` e `setHeaders`. E só nas requisições para a sua API.',
    'Para tratar um erro num lugar só, `catchError` que avisa e devolve o mesmo erro com `throwError`; para desfazer algo no fim, `finalize`.',
  ],
  essentials: ['39/etapa/src/app/core/http/auth-interceptor.ts', '39/etapa/src/app/app.config.ts'],
  stage: '39-interceptors',
  questions: [
    {
      prompt: 'A lista do `withInterceptors` tem, nesta ordem, o `loadingInterceptor`, o `authInterceptor` e o `errorInterceptor`. Em que ordem a resposta, na volta, passa por eles?',
      alternatives: [
        { text: 'loading, auth, error: a mesma da lista.', explanation: 'Essa é a ordem da ida. A volta desfaz o caminho.' },
        {
          text: 'error, auth, loading: a contrária da lista.',
          correct: true,
          explanation: 'Isso: como as mesas da expedição, a resposta atravessa o caminho de trás para a frente.',
        },
        { text: 'Só o último da lista vê a resposta.', explanation: 'Todos veem: cada um recebe a resposta pelo Observable que o next devolveu.' },
      ],
    },
    {
      prompt: 'Qual destas formas põe o token na requisição?',
      alternatives: [
        { text: 'Chamar `req.headers.set(…)` e depois devolver `next(req)`.', explanation: 'Compila, mas o set devolve cabeçalhos novos que ninguém usa: a requisição sai sem token.' },
        { text: 'Atribuir `req.headers = req.headers.set(…)` e depois devolver `next(req)`.', explanation: 'Não compila: TS2540, os headers são somente leitura.' },
        {
          text: 'Devolver `next(req.clone({ setHeaders: … }))`.',
          correct: true,
          explanation: 'Isso: a requisição é imutável, e o clone faz a cópia com o cabeçalho a mais.',
        },
      ],
    },
    {
      prompt: 'Por que o `authInterceptor` confere se o endereço é o da API do Passaporte antes de pôr o token?',
      alternatives: [
        { text: 'Para o app ficar mais rápido.', explanation: 'A velocidade não muda. O problema é para quem o token vai.' },
        {
          text: 'Porque o token é um segredo de quem entrou, e outros servidores podem recusar o cabeçalho ou ficar com ele.',
          correct: true,
          explanation: 'Isso: a API de países bloqueia a requisição no preflight, e o Open-Meteo aceitaria o seu token calado.',
        },
        { text: 'Porque o HttpClient dá erro com cabeçalhos em outros endereços.', explanation: 'O HttpClient manda o que você pedir. Quem recusa é o navegador, depois do preflight.' },
      ],
    },
    {
      prompt: 'No `catchError` do `errorInterceptor`, o que devolver depois de acender o aviso?',
      alternatives: [
        { text: '`EMPTY`, para o erro não chegar a ninguém.', explanation: 'Quem pediu recebe só o fim e acha que deu certo; o httpResource mostra NG0991 no lugar do erro real.' },
        {
          text: '`throwError(() => error)`, o mesmo erro.',
          correct: true,
          explanation: 'Isso: o interceptor avisa o app, e quem fez a requisição continua sabendo que ela falhou.',
        },
        { text: '`of(null)`, uma resposta vazia.', explanation: 'Seria fingir uma resposta que o servidor nunca deu, e quem pediu trataria null como dado.' },
      ],
    },
    {
      prompt: 'Por que o `loadingInterceptor` usa `finalize`, e não um `tap` que para a contagem quando chega a resposta?',
      alternatives: [
        {
          text: 'Porque o finalize roda também quando a requisição dá erro ou é cancelada.',
          correct: true,
          explanation: 'Isso: com o tap, uma requisição que falha nunca desconta, e a barra fica correndo para sempre.',
        },
        { text: 'Porque o tap não funciona dentro de interceptors.', explanation: 'Funciona: o errorInterceptor usa um. O problema é que ele só vê o que chega.' },
        { text: 'Porque o finalize roda antes da requisição sair.', explanation: 'É o contrário: ele roda no fim, de qualquer fim.' },
      ],
    },
  ],
  links: [
    { label: 'Interceptors', url: 'https://angular.dev/guide/http/interceptors' },
    { label: 'HttpInterceptorFn', url: 'https://angular.dev/api/common/http/HttpInterceptorFn' },
    { label: 'withInterceptors', url: 'https://angular.dev/api/common/http/withInterceptors' },
    { label: 'NG0991: Resource completed before producing a value', url: 'https://angular.dev/errors/NG0991' },
    { label: 'Requisição de preflight (MDN)', url: 'https://developer.mozilla.org/pt-BR/docs/Glossary/Preflight_request' },
  ],
};
