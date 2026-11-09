import type { ChapterContent } from '../types';

export const CHAPTER_47: ChapterContent = {
  summary: [
    '`ng add @angular/pwa` cria o manifesto, os ícones e o `ngsw-config.json`, e liga o service worker com `provideServiceWorker`.',
    'O manifesto dá nome, ícones e cores ao app instalado; o service worker fica entre o app e a rede e guarda cópias.',
    '`assetGroups` guardam os arquivos do app; `dataGroups` guardam respostas de APIs, com a estratégia `performance` ou `freshness`.',
    'O service worker só existe no build de produção: teste com `npm run build` e um servidor estático.',
    'Uma versão nova é baixada em segundo plano e só entra ao recarregar; o `SwUpdate.versionUpdates` avisa com `VERSION_READY`.',
    'Dados que dependem de quem entrou, como a API do Supabase, nunca vão para um `dataGroup`.',
  ],
  essentials: ['47/etapa/ngsw-config.json', '47/etapa/src/app/core/app-updates.ts'],
  stage: '47-pwa',
  questions: [
    {
      prompt: 'Você mudou um texto, rodou o build e publicou. Quem já tinha o Passaporte aberto recarrega a página uma vez. O que vê?',
      alternatives: [
        {
          text: 'A versão nova, na hora.',
          explanation: 'O service worker responde primeiro com a versão guardada, para ser rápido, e baixa a nova em segundo plano.',
        },
        {
          text: 'A versão antiga, com o aviso de que há uma nova pronta; ela entra no próximo carregamento.',
          correct: true,
          explanation: 'Isso: o service worker confere o ngsw.json ao abrir o app, baixa a versão nova e anuncia o VERSION_READY.',
        },
        { text: 'Um erro, porque os arquivos guardados não existem mais no servidor.', explanation: 'A versão antiga está inteira no cache do service worker.' },
      ],
    },
    {
      prompt: 'A lista de países está num `dataGroup` com a estratégia `performance`. O que acontece quando o app pede a lista e ela já está guardada?',
      alternatives: [
        {
          text: 'O service worker devolve a cópia guardada, sem consultar a rede.',
          correct: true,
          explanation: 'Isso: é a resposta mais rápida possível, e a cópia vale até o maxAge (7 dias, no Passaporte).',
        },
        { text: 'Ele consulta a rede e só usa a cópia se a rede falhar.', explanation: 'Isso é a estratégia freshness, usada no Passaporte para o tempo agora.' },
        { text: 'Ele devolve a cópia e, ao mesmo tempo, sempre busca uma nova.', explanation: 'A performance não consulta a rede enquanto a cópia vale.' },
      ],
    },
    {
      prompt: 'Por que a API do Supabase não entra num `dataGroup` do Passaporte?',
      alternatives: [
        { text: 'Porque o service worker não consegue guardar respostas com o cabeçalho Authorization.', explanation: 'Ele guarda, e esse é justamente o problema.' },
        {
          text: 'Porque o cache guarda pela URL: quem entrar depois no mesmo navegador recebe os dados de quem saiu.',
          correct: true,
          explanation: 'Isso: o pedido das viagens tem a mesma URL para todo mundo, e a cópia de uma pessoa serve à outra sem passar pelo RLS.',
        },
        { text: 'Porque o Supabase proíbe cache.', explanation: 'O problema está no cache do navegador, que não sabe de quem é cada resposta.' },
      ],
    },
    {
      prompt: 'Você roda `ng serve`, abre o app e não acha service worker nenhum. O que houve?',
      alternatives: [
        {
          text: 'Nada de errado: no modo de desenvolvimento ele fica desligado; teste com o build de produção.',
          correct: true,
          explanation: 'Isso: o enabled: !isDevMode() desliga o registro, e o ngsw-worker.js só é gerado no build de produção.',
        },
        { text: 'Faltou o manifesto.', explanation: 'O manifesto cuida da instalação; o service worker é registrado pelo provideServiceWorker.' },
        { text: 'O navegador bloqueia service workers em localhost.', explanation: 'Os navegadores aceitam service worker em localhost, mesmo sem HTTPS.' },
      ],
    },
  ],
  links: [
    { label: 'Service workers no Angular: primeiros passos', url: 'https://angular.dev/ecosystem/service-workers/getting-started' },
    { label: 'O ngsw-config.json', url: 'https://angular.dev/ecosystem/service-workers/config' },
    { label: 'Conversando com o service worker (SwUpdate)', url: 'https://angular.dev/ecosystem/service-workers/communications' },
    { label: 'Versões e atualizações em produção', url: 'https://angular.dev/ecosystem/service-workers/devops' },
    { label: 'O manifesto de um app web (MDN)', url: 'https://developer.mozilla.org/pt-BR/docs/Web/Progressive_web_apps/Manifest' },
  ],
};
