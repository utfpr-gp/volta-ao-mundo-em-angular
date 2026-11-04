import type { ChapterContent } from '../types';

export const CHAPTER_38: ChapterContent = {
  summary: [
    'Um guard é uma função que o roteador chama antes de abrir a rota: ela devolve `true` para deixar passar, ou outro endereço.',
    'O guard funcional é uma constante do tipo `CanActivateFn`, ligada à rota com `canActivate: [authGuard]`.',
    'Para desviar, devolva `router.createUrlTree([...])`, nunca `false`: com `false`, a navegação só é cancelada.',
    'O guard espera o Supabase terminar de ler a sessão (`await auth.whenReady()`) antes de decidir. E os `inject()` vêm antes do `await`.',
    'O endereço de volta vai em `?voltar=`, e a tela de entrar o recebe como `input()`, graças ao `withComponentInputBinding()`.',
  ],
  essentials: ['38/etapa/src/app/core/auth-guards.ts', '38/etapa/src/app/app.routes.ts'],
  stage: '38-guards',
  questions: [
    {
      prompt: 'Quem não entrou tenta abrir /passaporte. O que o `authGuard` deve devolver?',
      alternatives: [
        { text: '`false`.', explanation: 'Com false, a navegação só é cancelada: o link não faz nada, ou a pessoa cai numa tela vazia.' },
        {
          text: 'Um `UrlTree` para `/entrar`, montado com `router.createUrlTree`, levando o caminho de volta.',
          correct: true,
          explanation: 'Isso: o roteador troca a navegação pela da tela de entrar, levando o caminho de volta.',
        },
        { text: 'Uma exceção.', explanation: 'Uma exceção vira erro no console, e a pessoa fica sem saber o que aconteceu.' },
      ],
    },
    {
      prompt: 'Por que o `authGuard` faz `await auth.whenReady()` antes de olhar o `signedIn()`?',
      alternatives: [
        { text: 'Porque o `signedIn()` só funciona dentro de um `await`.', explanation: 'Um signal se lê a qualquer momento; o problema é o valor dele.' },
        {
          text: 'Porque, ao abrir o app, a sessão guardada pode ainda não ter sido lida, e "ninguém logado" seria só pressa.',
          correct: true,
          explanation: 'Isso: com o token vencido, por exemplo, o Supabase renova pela rede antes de anunciar a sessão.',
        },
        { text: 'Para o app carregar mais rápido.', explanation: 'Esperar não acelera nada: só garante que a decisão é com a informação certa.' },
      ],
    },
    {
      prompt: 'O guard faz `const auth = inject(Auth)`, depois `await auth.whenReady()`, e só então `inject(Router)`. O que acontece?',
      alternatives: [
        { text: 'Funciona igual.', explanation: 'Depois do await, o Angular já não está criando nada.' },
        { text: 'O erro NG0203, e a navegação não acontece.', correct: true, explanation: 'Isso: o inject() só vale antes do primeiro await.' },
        { text: 'O Router vem como `undefined`.', explanation: 'O inject() não devolve undefined: ele lança o erro NG0203.' },
      ],
    },
    {
      prompt: 'A URL é `/entrar?voltar=%2Fpaises%2FJP`. Qual input recebe esse valor?',
      alternatives: [
        { text: '`returnUrl = input<string>()`', explanation: 'O nome não bate com o parâmetro: ele nunca recebe nada, e nenhum erro aparece.' },
        {
          text: '`returnUrl = input<string>(undefined, { alias: \'voltar\' })`',
          correct: true,
          explanation: 'Isso: o alias é o nome que o withComponentInputBinding() procura na URL.',
        },
        { text: 'Nenhum: parâmetro depois do `?` não chega ao componente.', explanation: 'Chega: o withComponentInputBinding() liga também os parâmetros de consulta.' },
      ],
    },
  ],
  links: [
    { label: 'Controlar o acesso às rotas com guards', url: 'https://angular.dev/guide/routing/route-guards' },
    { label: 'CanActivateFn', url: 'https://angular.dev/api/router/CanActivateFn' },
    { label: 'Router.createUrlTree', url: 'https://angular.dev/api/router/Router#createUrlTree' },
    { label: 'O contexto de injeção', url: 'https://angular.dev/guide/di/dependency-injection-context' },
  ],
};
