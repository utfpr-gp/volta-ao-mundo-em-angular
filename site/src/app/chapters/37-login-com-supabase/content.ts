import type { ChapterContent } from '../types';

export const CHAPTER_37: ChapterContent = {
  summary: [
    'O Supabase é um back-end pronto: banco, login e API. O app fala com ele pelo cliente do `@supabase/supabase-js`.',
    'O endereço do projeto e a chave publicável moram no `environment.ts`. A chave publicável pode ir para o navegador; a secreta, nunca.',
    'Um service `Auth` guarda a sessão num signal, alimentado pelo `onAuthStateChange`: o Supabase avisa cada login, logout e renovação.',
    '`signInWithPassword`, `signUp` e `signOut` devolvem `{ data, error }`. Traduza o erro pelo `error.code`, não pela mensagem em inglês.',
    'A sessão fica guardada no navegador e sobrevive ao recarregar a página; o token vence em uma hora e é renovado sozinho.',
  ],
  essentials: ['37/etapa/src/app/core/supabase.ts', '37/etapa/src/app/core/auth.ts'],
  stage: '37-login-com-supabase',
  questions: [
    {
      prompt: 'Qual das chaves do Supabase pode ir no `environment.ts` do app Angular?',
      alternatives: [
        { text: 'A publicável, `sb_publishable_…`.', correct: true, explanation: 'Isso: ela foi feita para o navegador. Quem protege os dados é o banco.' },
        { text: 'A secreta, `sb_secret_…`.', explanation: 'Nunca: ela passa por cima de toda a proteção do banco, e quem abre o app consegue lê-la.' },
        { text: 'Nenhuma: o app entra só com e-mail e senha.', explanation: 'O cliente precisa da chave publicável para falar com o projeto.' },
      ],
    },
    {
      prompt: 'Com a confirmação de e-mail ligada, o `signUp` dá certo. O que vem em `data.session`?',
      alternatives: [
        { text: 'A sessão: a pessoa já entra.', explanation: 'Só com a confirmação desligada. Ligada, a pessoa entra depois de clicar no link.' },
        { text: '`null`: a conta existe, mas ainda não tem sessão.', correct: true, explanation: 'Isso: é o sinal para a tela pedir que a pessoa confira o e-mail.' },
        { text: 'Um erro `email_not_confirmed`.', explanation: 'Esse erro vem ao tentar entrar antes de confirmar, não ao criar a conta.' },
      ],
    },
    {
      prompt: 'Por que o service escuta o `onAuthStateChange`, em vez de chamar `getSession()` uma vez no construtor?',
      alternatives: [
        { text: 'Porque o `getSession()` não existe mais.', explanation: 'Existe, mas lê a sessão uma vez só.' },
        {
          text: 'Porque a sessão muda depois que o app abre: no login, no logout e na renovação do token.',
          correct: true,
          explanation: 'Isso: lida uma vez só, a sessão no signal ficaria velha, e o cabeçalho não mudaria depois do login.',
        },
        { text: 'Porque o `onAuthStateChange` é mais rápido.', explanation: 'Não é questão de velocidade: é de saber quando a sessão muda.' },
      ],
    },
    {
      prompt: 'A pessoa erra a senha. O que o app deveria mostrar?',
      alternatives: [
        { text: '`error.message`, que vem pronto do Supabase.', explanation: 'Ela vem em inglês, "Invalid login credentials", e pode mudar de uma versão para outra.' },
        {
          text: 'Uma frase em português escolhida pelo `error.code`, que é `invalid_credentials`.',
          correct: true,
          explanation: 'Isso: o code é estável, e a frase fica do jeito que o app quer.',
        },
        { text: 'Nada: o Supabase já mostra uma janela de erro.', explanation: 'O Supabase não desenha nada na tela; quem mostra é o app.' },
      ],
    },
  ],
  links: [
    { label: 'Supabase Auth: visão geral', url: 'https://supabase.com/docs/guides/auth' },
    { label: 'Login com e-mail e senha', url: 'https://supabase.com/docs/guides/auth/passwords' },
    { label: 'As chaves de API do Supabase', url: 'https://supabase.com/docs/guides/api/api-keys' },
    { label: 'onAuthStateChange', url: 'https://supabase.com/docs/reference/javascript/auth-onauthstatechange' },
    { label: 'Ambientes no Angular CLI', url: 'https://angular.dev/tools/cli/environments' },
  ],
};
