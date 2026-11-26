import type { ChapterContent } from '../types';

export const CHAPTER_50: ChapterContent = {
  summary: [
    'O PWABuilder lê o manifesto e o service worker do PWA publicado e gera pacotes para o Google Play, a Microsoft Store e a App Store (experimental).',
    'Teste no PWABuilder o endereço de uma página completa, como `/paises`: a raiz do Passaporte só redireciona e não tem o link do manifesto.',
    'O pacote Android é uma Trusted Web Activity: um app que abre o seu site no Chrome, sem a barra de endereço. O código Angular continua no site.',
    'O zip traz o `.aab` (para a loja), o `.apk` (para testar no celular), o `assetlinks.json` e a chave de assinatura, que fica fora do Git.',
    'O `assetlinks.json` vai em `/.well-known/` na raiz do domínio; sem ele, ou com a impressão digital errada, o app abre com a barra de endereço.',
    'Contas de desenvolvedor: Google Play, US$ 25 uma vez; Apple, US$ 99 por ano; Microsoft Store, gratuita pelo fluxo novo.',
  ],
  essentials: ['50/etapa/public/manifest.webmanifest', '50/assetlinks'],
  stage: '50-pwabuilder',
  questions: [
    {
      prompt: 'Você corrigiu um texto do Passaporte e publicou o site no Render. O que acontece no app Android que já estava instalado?',
      alternatives: [
        { text: 'Nada, até você gerar um pacote novo no PWABuilder e enviar à loja.', explanation: 'O app é uma janela para o site: o código Angular continua no Render.' },
        {
          text: 'O app mostra o texto novo, porque ele abre o site publicado.',
          correct: true,
          explanation: 'Isso: uma Trusted Web Activity carrega o seu endereço. Um pacote novo só é preciso para mudar o próprio app (nome, ícone, versão).',
        },
        { text: 'O app para de abrir até a loja aprovar a mudança.', explanation: 'A loja revisa o pacote, e não cada publicação do site.' },
      ],
    },
    {
      prompt: 'No PWABuilder, você digitou o endereço da raiz do Passaporte e recebeu "Missing Name". O que houve?',
      alternatives: [
        {
          text: 'A raiz é a página que só redireciona para /paises, e ela não tem o link do manifesto.',
          correct: true,
          explanation: 'Isso: com a pré-renderização, a rota vazia virou uma página de redirecionamento. Teste /paises.',
        },
        { text: 'O manifesto precisa se chamar manifest.json.', explanation: 'O nome não importa: o que vale é o <link rel="manifest"> na página.' },
        { text: 'O PWABuilder não aceita sites do Render.', explanation: 'Com /paises, o mesmo site passou com 0 erros.' },
      ],
    },
    {
      prompt: 'Onde o `assetlinks.json` precisa estar para o Android confiar no app?',
      alternatives: [
        { text: 'Dentro do .apk, junto com o ícone.', explanation: 'O app só traz o nome do pacote; quem prova o vínculo é o site.' },
        {
          text: 'Em /.well-known/assetlinks.json, na raiz do domínio do site.',
          correct: true,
          explanation: 'Isso: no Passaporte, em public/.well-known/, que o build copia para a raiz da pasta publicada.',
        },
        { text: 'Em qualquer pasta, desde que o manifesto aponte para ele.', explanation: 'O caminho é fixo, e na raiz do domínio, e não na pasta do app.' },
      ],
    },
    {
      prompt: 'O app instalado pelo .apk abre sem barra de endereço. Depois de publicado no Google Play, a barra aparece. Por quê?',
      alternatives: [
        { text: 'O Google Play desliga o modo tela cheia.', explanation: 'O modo de exibição vem do pacote e não muda na loja.' },
        { text: 'O site saiu do ar.', explanation: 'Com o site fora do ar, o app nem abriria a página.' },
        {
          text: 'O Google Play assina o app de novo, e a impressão digital dessa assinatura ainda não está no assetlinks.json.',
          correct: true,
          explanation: 'Isso: copie o SHA-256 do Google Play (Setup → App integrity) para a lista sha256_cert_fingerprints.',
        },
      ],
    },
  ],
  links: [
    { label: 'Service worker e PWA no Angular', url: 'https://angular.dev/ecosystem/service-workers' },
    { label: 'PWABuilder', url: 'https://www.pwabuilder.com' },
    { label: 'Publicar no Google Play com o PWABuilder', url: 'https://docs.pwabuilder.com/#/builder/android' },
    { label: 'Trusted Web Activity (Chrome para desenvolvedores)', url: 'https://developer.chrome.com/docs/android/trusted-web-activity' },
    { label: 'Digital Asset Links', url: 'https://developers.google.com/digital-asset-links/v1/getting-started' },
  ],
};
