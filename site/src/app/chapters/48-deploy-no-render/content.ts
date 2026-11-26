import type { ChapterContent } from '../types';

export const CHAPTER_48: ChapterContent = {
  summary: [
    'Depois do `npm run build`, o Passaporte é um site estático: a pasta `dist/passaporte/browser`, só com arquivos.',
    'No Render, um Static Site liga um repositório do GitHub: Build Command `npm ci && npm run build`, Publish Directory `dist/passaporte/browser`.',
    'Cada `git push` na branch publicada gera e publica o app de novo, com HTTPS e um endereço `onrender.com`.',
    'Telas montadas no navegador, como `/passaporte`, não têm arquivo: sem uma regra de rewrite, recarregar dá `Not Found`.',
    'Com páginas pré-renderizadas, a regra vai só para as telas do navegador (destino `/index.csr.html`); o resto cai num `404.html`, cópia do casco.',
    'A regra `/* → /index.html` dos tutoriais prende o Passaporte num laço: o `index.html` dele só redireciona para `/paises`.',
  ],
  essentials: ['48/etapa/render.yaml', '48/etapa/scripts/not-found.mjs'],
  stage: '48-deploy-no-render',
  questions: [
    {
      prompt: 'O Passaporte está no ar, sem nenhuma regra. No app, o link "Meu passaporte" funciona. Você manda o endereço `/passaporte` para uma amiga, que o abre pela primeira vez. O que ela vê, e por quê?',
      alternatives: [
        {
          text: 'Not Found: o link do app é resolvido pelo roteador do Angular, mas o endereço digitado é um pedido ao servidor, que não tem esse arquivo.',
          correct: true,
          explanation: 'Isso: o roteador troca o endereço sem falar com o servidor; abrir o link é um pedido novo, e o servidor só conhece arquivos.',
        },
        { text: 'A tela de entrar, porque o service worker guardou o app.', explanation: 'No navegador dela ainda não há service worker: é a primeira visita.' },
        { text: 'Um erro do Angular no console, porque a rota tem um guard.', explanation: 'O app nem chega a abrir: o servidor devolve só o texto Not Found.' },
      ],
    },
    {
      prompt: 'Por que a regra `/* → /index.html`, que funciona em tantas SPAs, prende o Passaporte num laço?',
      alternatives: [
        { text: 'Porque o Render não aceita o asterisco nas regras.', explanation: 'Aceita: /* vale para todos os endereços.' },
        {
          text: 'Porque, com a pré-renderização, o index.html do Passaporte só redireciona para /paises, e a regra devolve o mesmo arquivo em /paises.',
          correct: true,
          explanation: 'Isso: a rota vazia vira uma página de redirecionamento no build. O casco do app agora é o index.csr.html.',
        },
        { text: 'Porque o service worker responde antes da regra.', explanation: 'O laço acontece já no primeiro acesso, sem service worker nenhum.' },
      ],
    },
    {
      prompt: 'Com a configuração do Passaporte (regras para as telas do navegador e o 404.html), o que chega quando alguém abre `/paises/ZZ`, um país que não existe?',
      alternatives: [
        { text: 'O texto Not Found, porque não há arquivo nem regra.', explanation: 'Antes do Not Found, o Render procura o 404.html, e ele existe.' },
        { text: 'A lista de países, porque /paises existe.', explanation: '/paises/ZZ é outro endereço; a pasta /paises não responde por ele.' },
        {
          text: 'O 404.html, com o status 404: o casco abre, e o Angular mostra "Esta página não existe".',
          correct: true,
          explanation: 'Isso: o navegador recebe o status certo, e a pessoa vê a página "não encontrada" do próprio app.',
        },
      ],
    },
    {
      prompt: 'Você corrigiu um texto e fez `git push` na branch `main`, a que o Render publica. O que precisa fazer no painel do Render?',
      alternatives: [
        {
          text: 'Nada: o Render percebe o push, roda o build e publica a versão nova sozinho.',
          correct: true,
          explanation: 'Isso: é o deploy automático. O log do deploy mostra cada passo, até "Your site is live".',
        },
        { text: 'Clicar em "Deploy" e enviar a pasta dist de novo.', explanation: 'O Render gera a pasta dist sozinho, a partir do código do repositório.' },
        { text: 'Apagar o site e criar outro, para limpar o cache.', explanation: 'O cache da CDN é limpo a cada build que dá certo.' },
      ],
    },
  ],
  links: [
    { label: 'Deploy de um app Angular (angular.dev)', url: 'https://angular.dev/tools/cli/deployment' },
    { label: 'Static Sites no Render', url: 'https://render.com/docs/static-sites' },
    { label: 'Redirects e rewrites no Render', url: 'https://render.com/docs/redirects-rewrites' },
    { label: 'O render.yaml (Blueprint)', url: 'https://render.com/docs/blueprint-spec' },
    { label: 'A versão do Node.js no Render', url: 'https://render.com/docs/node-version' },
  ],
};
