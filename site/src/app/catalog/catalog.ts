/**
 * O catálogo do livro: as trilhas e os capítulos, na ordem de leitura.
 * Daqui saem as rotas, a navegação, o mapa do passaporte e o progresso.
 * Os slugs são endereços públicos: depois de publicado, um slug não muda.
 */

export type TrackId =
  | 'embarque'
  | 'fundamentos'
  | 'componentes'
  | 'navegacao'
  | 'dados'
  | 'formularios'
  | 'back-end'
  | 'qualidade'
  | 'producao';

export interface Track {
  id: TrackId;
  name: string;
  emoji: string;
  summary: string;
}

export interface Chapter {
  number: number;
  slug: string;
  track: TrackId;
  /** A pergunta que o capítulo responde. Trechos de código vão entre crases. */
  question: string;
  /** Até 28 caracteres, para menus e carimbos. */
  shortTitle: string;
  /** De 120 a 160 caracteres; vira a meta description da página. */
  description: string;
  minutes: number;
  prerequisites: number[];
  /** Versão do Angular contra a qual o capítulo foi conferido, quando publicado. */
  verifiedWithAngular: string | null;
  published: boolean;
}

export const TRACKS: readonly Track[] = [
  {
    id: 'embarque',
    name: 'Embarque',
    emoji: '✈️',
    summary: 'Antes de decolar: o que é o Angular, o ambiente, o JavaScript e o TypeScript que ele pede, e o primeiro projeto.',
  },
  {
    id: 'fundamentos',
    name: 'Fundamentos',
    emoji: '🧱',
    summary: 'As peças de toda tela: componentes, bindings, signals, controle de fluxo, pipes, estilos e design tokens.',
  },
  {
    id: 'componentes',
    name: 'Componentes',
    emoji: '🧩',
    summary: 'Componentes que conversam entre si, se reaproveitam e formam layouts responsivos, do protótipo à biblioteca pronta.',
  },
  {
    id: 'navegacao',
    name: 'Navegação',
    emoji: '🧭',
    summary: 'Várias telas sem recarregar a página: rotas, parâmetros, rotas filhas, carregamento sob demanda e organização.',
  },
  {
    id: 'dados',
    name: 'Dados',
    emoji: '📡',
    summary: 'Buscar e compartilhar dados: services, HTTP, o RxJS essencial e as pontes entre Observables e signals.',
  },
  {
    id: 'formularios',
    name: 'Formulários',
    emoji: '📝',
    summary: 'Ler e validar o que a pessoa digita, com mensagens de erro claras, em Reactive Forms e em Signal Forms.',
  },
  {
    id: 'back-end',
    name: 'Back-end',
    emoji: '🗄️',
    summary: 'Login, rotas protegidas e dados na nuvem com o Supabase, mais interceptors e resolvers.',
  },
  {
    id: 'qualidade',
    name: 'Qualidade',
    emoji: '🔎',
    summary: 'Testes com Vitest, leitura das mensagens de erro, Angular DevTools e acessibilidade.',
  },
  {
    id: 'producao',
    name: 'Produção',
    emoji: '🚀',
    summary: 'Do seu computador para o mundo: desempenho, SEO, PWA, deploy, automação e as lojas de aplicativos.',
  },
];

export const EXTRA_TOPICS: readonly string[] = [
  'Renderização no servidor a cada acesso (SSR com servidor Node)',
  'Animações',
  'IA no desenvolvimento Angular: o servidor MCP do Angular CLI e o tutor de IA oficial',
];

type ChapterEntry = Omit<Chapter, 'number' | 'slug' | 'prerequisites' | 'verifiedWithAngular' | 'published'> & {
  slug: string;
  prerequisites?: number[];
  verifiedWithAngular?: string;
  published?: boolean;
};

const ENTRIES: ChapterEntry[] = [
  // Embarque
  {
    slug: '01-o-que-e-o-angular',
    track: 'embarque',
    question: 'O que é o Angular, e por que escolhê-lo entre React, Vue e Svelte?',
    shortTitle: 'O que é o Angular',
    description:
      'Entenda por que as aplicações web usam frameworks, o que o Angular traz de fábrica e como ele se compara ao React, ao Vue e ao Svelte.',
    minutes: 30,
    published: true,
    verifiedWithAngular: '22.2',
  },
  {
    slug: '02-preparando-o-ambiente',
    track: 'embarque',
    question: 'Como preparar o ambiente: terminal, Node.js e editor?',
    shortTitle: 'Preparando o ambiente',
    description:
      'Instale o Node.js, conheça o terminal e configure o VS Code com as extensões certas para programar em Angular sem tropeços.',
    minutes: 30,
    published: true,
    verifiedWithAngular: '22.2',
  },
  {
    slug: '03-javascript-moderno',
    track: 'embarque',
    question: 'Que JavaScript moderno preciso saber?',
    shortTitle: 'JavaScript moderno',
    description:
      'Arrow functions, desestruturação, espalhamento, módulos, Promise e async/await: o JavaScript que o Angular usa em toda linha.',
    minutes: 40,
    published: true,
    verifiedWithAngular: '22.2',
  },
  {
    slug: '04-typescript-para-angular',
    track: 'embarque',
    question: 'Que TypeScript preciso saber para o Angular?',
    shortTitle: 'TypeScript para Angular',
    description:
      'Tipos, interfaces, classes, genéricos e decorators: o TypeScript que você encontra em qualquer projeto Angular, explicado com calma.',
    minutes: 45,
    published: true,
    verifiedWithAngular: '22.2',
  },
  {
    slug: '05-angular-cli',
    track: 'embarque',
    question: 'Como criar e rodar um projeto com o Angular CLI?',
    shortTitle: 'Angular CLI',
    description:
      'Crie o projeto do Passaporte com o Angular CLI, entenda cada pasta gerada e veja a página atualizar sozinha a cada mudança no código.',
    minutes: 35,
    published: true,
    verifiedWithAngular: '22.2',
  },
  // Fundamentos
  {
    slug: '06-componentes',
    track: 'fundamentos',
    question: 'Como dividir a tela em componentes standalone?',
    shortTitle: 'Componentes',
    description:
      'Desmonte uma tela em átomos, moléculas e organismos, crie componentes standalone e monte com eles a árvore de componentes do app.',
    minutes: 40,
    published: true,
    verifiedWithAngular: '22.2',
  },
  {
    slug: '07-interpolacao-e-property-binding',
    track: 'fundamentos',
    question: 'Como exibir dados com interpolação e property binding?',
    shortTitle: 'Interpolação e binding',
    description:
      'Leve os dados da classe para a tela com interpolação e property binding, e entenda quando usar cada um nos templates do Angular.',
    minutes: 30,
    published: true,
    verifiedWithAngular: '22.2',
  },
  {
    slug: '08-event-binding',
    track: 'fundamentos',
    question: 'Como responder a cliques e digitação com event binding?',
    shortTitle: 'Event binding',
    description:
      'Faça a tela reagir a cliques, teclas e digitação com event binding, e veja os dados voltando da tela para a classe do componente.',
    minutes: 30,
    published: true,
    verifiedWithAngular: '22.2',
  },
  {
    slug: '09-signals',
    track: 'fundamentos',
    question: 'Como guardar estado que atualiza a tela com `signal()` e `computed()`?',
    shortTitle: 'Signals',
    description:
      'Guarde o estado do app em signals, derive valores com computed e veja o Angular atualizar só o que mudou na tela, sem você pedir.',
    minutes: 40,
    published: true,
    verifiedWithAngular: '22.2',
  },
  {
    slug: '10-if-e-switch',
    track: 'fundamentos',
    question: 'Como mostrar ou esconder elementos com `@if` e `@switch`?',
    shortTitle: '@if e @switch',
    description:
      'Mostre, esconda e alterne partes da tela conforme o estado com @if e @switch, incluindo a mensagem de lista vazia do Passaporte.',
    minutes: 30,
    published: true,
    verifiedWithAngular: '22.2',
  },
  {
    slug: '11-for-e-track',
    track: 'fundamentos',
    question: 'Como repetir elementos com `@for` e `track`?',
    shortTitle: '@for e track',
    description:
      'Repita cartões para cada país com @for, entenda para que serve o track e por que ele evita que o Angular recrie a lista inteira.',
    minutes: 35,
    published: true,
    verifiedWithAngular: '22.2',
  },
  {
    slug: '12-pipes',
    track: 'fundamentos',
    question: 'Como formatar dados com pipes?',
    shortTitle: 'Pipes',
    description:
      'Formate números, datas e porcentagens com os pipes prontos do Angular e crie o seu próprio pipe para mostrar a bandeira de um país.',
    minutes: 35,
    published: true,
    verifiedWithAngular: '22.2',
  },
  {
    slug: '13-estilos-e-tailwind',
    track: 'fundamentos',
    question: 'Como estilizar componentes, e onde entra o Tailwind?',
    shortTitle: 'Estilos e Tailwind',
    description:
      'Entenda o CSS isolado de cada componente, aplique classes do Tailwind direto no template e use ícones para dar vida ao Passaporte.',
    minutes: 35,
  },
  {
    slug: '14-design-tokens',
    track: 'fundamentos',
    question: 'Como dar identidade visual ao app com design tokens?',
    shortTitle: 'Design tokens',
    description:
      'Declare cores, fontes e arredondamentos como design tokens no Tailwind e troque o visual inteiro do app, até o modo escuro, de uma vez.',
    minutes: 30,
  },
  // Componentes
  {
    slug: '15-input-e-output',
    track: 'componentes',
    question: 'Como passar dados entre componentes com `input()` e `output()`?',
    shortTitle: 'input() e output()',
    description:
      'Faça os componentes conversarem: dados descem do pai para o filho com input() e eventos sobem do filho para o pai com output().',
    minutes: 30,
  },
  {
    slug: '16-model',
    track: 'componentes',
    question: 'Como sincronizar um valor nos dois sentidos com `model()`?',
    shortTitle: 'model()',
    description:
      'Crie as estrelas de nota do Passaporte com model() e entenda como um valor fica sincronizado entre o componente pai e o filho.',
    minutes: 20,
  },
  {
    slug: '17-ng-content',
    track: 'componentes',
    question: 'Como reaproveitar conteúdo com `ng-content`?',
    shortTitle: 'ng-content',
    description:
      'Construa componentes moldura, como um cartão ou um painel, que recebem conteúdo de fora com ng-content e servem para muitas telas.',
    minutes: 20,
  },
  {
    slug: '18-view-child',
    track: 'componentes',
    question: 'Como acessar um elemento ou componente filho com `viewChild()`?',
    shortTitle: 'viewChild()',
    description:
      'Acesse um elemento do template ou um componente filho com viewChild(), por exemplo para dar foco a um campo, e saiba quando evitar.',
    minutes: 20,
  },
  {
    slug: '19-ciclo-de-vida',
    track: 'componentes',
    question: 'Como executar código quando o componente é criado e destruído?',
    shortTitle: 'Ciclo de vida',
    description:
      'Entenda o ciclo de vida de um componente e rode código quando ele nasce e quando some, com ngOnInit, DestroyRef e afterNextRender.',
    minutes: 25,
  },
  {
    slug: '20-layout-responsivo',
    track: 'componentes',
    question: 'Como montar um layout responsivo Mobile-First?',
    shortTitle: 'Layout responsivo',
    description:
      'Monte o layout do Passaporte pensando primeiro no celular, com grid e flexbox no Tailwind, e faça a tela crescer bem até o desktop.',
    minutes: 35,
  },
  {
    slug: '21-do-prototipo-ao-componente',
    track: 'componentes',
    question: 'Como transformar um protótipo do Figma em componentes?',
    shortTitle: 'Do protótipo ao código',
    description:
      'Leia uma tela do Figma, encontre nela os átomos, as moléculas e os organismos, e tire dela os tokens e os componentes do app.',
    minutes: 35,
  },
  {
    slug: '22-bibliotecas-de-componentes',
    track: 'componentes',
    question: 'Como usar componentes prontos com Angular Material, PrimeNG, daisyUI e Spartan?',
    shortTitle: 'Componentes prontos',
    description:
      'Compare Angular Material, PrimeNG, daisyUI, Spartan e Angular Aria fazendo o mesmo cartão de país em cada um, com o código lado a lado.',
    minutes: 45,
  },
  // Navegação
  {
    slug: '23-router',
    track: 'navegacao',
    question: 'Como navegar entre telas com o Router?',
    shortTitle: 'Router',
    description:
      'Crie as telas do Passaporte e navegue entre elas com o Router do Angular, sem recarregar a página, com links e navegação por código.',
    minutes: 30,
  },
  {
    slug: '24-parametros-de-rota',
    track: 'navegacao',
    question: 'Como receber parâmetros da URL com `input()`?',
    shortTitle: 'Parâmetros de rota',
    description:
      'Abra a página de um país a partir do código na URL, como /paises/BR, recebendo o parâmetro da rota direto num input() do componente.',
    minutes: 25,
  },
  {
    slug: '25-rotas-filhas',
    track: 'navegacao',
    question: 'Como aninhar telas com rotas filhas?',
    shortTitle: 'Rotas filhas',
    description:
      'Divida a página do país em abas de visão geral, clima e anotações com rotas filhas, cada uma com o seu próprio endereço.',
    minutes: 25,
  },
  {
    slug: '26-lazy-loading',
    track: 'navegacao',
    question: 'Como carregar telas sob demanda com lazy loading?',
    shortTitle: 'Lazy loading',
    description:
      'Deixe o primeiro carregamento mais leve baixando cada tela só quando a pessoa chega nela, com lazy loading e loadComponent.',
    minutes: 20,
  },
  {
    slug: '27-organizacao-por-funcionalidades',
    track: 'navegacao',
    question: 'Como organizar o projeto por funcionalidades?',
    shortTitle: 'Organização do projeto',
    description:
      'Organize o código em core, shared e features, e siga a regra de que uma funcionalidade não importa outra, para o projeto crescer sem nó.',
    minutes: 25,
  },
  // Dados
  {
    slug: '28-services-e-inject',
    track: 'dados',
    question: 'Como compartilhar dados com services e `inject()`?',
    shortTitle: 'Services e inject()',
    description:
      'Tire a lógica de dentro dos componentes, coloque-a num service e compartilhe o mesmo estado entre telas usando o inject().',
    minutes: 30,
  },
  {
    slug: '29-http-client',
    track: 'dados',
    question: 'Como buscar dados de uma API com `HttpClient`?',
    shortTitle: 'HttpClient',
    description:
      'Busque os países numa API de verdade com o HttpClient, trate os erros de rede e salve o seu passaporte num json-server local.',
    minutes: 40,
  },
  {
    slug: '30-rxjs',
    track: 'dados',
    question: 'Que RxJS preciso saber?',
    shortTitle: 'RxJS essencial',
    description:
      'Observables, pipe, map, filter, debounceTime e switchMap: o RxJS essencial para fazer uma busca que responde enquanto você digita.',
    minutes: 40,
  },
  {
    slug: '31-to-signal',
    track: 'dados',
    question: 'Como transformar um Observable em signal com `toSignal()`?',
    shortTitle: 'toSignal()',
    description:
      'Ligue o mundo do RxJS ao mundo dos signals com toSignal() e toObservable(), e use o resultado de uma requisição direto no template.',
    minutes: 20,
  },
  {
    slug: '32-resource-e-http-resource',
    track: 'dados',
    question: 'Como buscar dados com `resource()` e `httpResource()`?',
    shortTitle: 'resource() e httpResource()',
    description:
      'Busque dados que dependem de signals com resource() e httpResource(), mostrando carregando, erro e resultado sem escrever subscribe.',
    minutes: 30,
  },
  {
    slug: '33-effect',
    track: 'dados',
    question: 'Como reagir a mudanças com `effect()`?',
    shortTitle: 'effect()',
    description:
      'Rode código sempre que um signal mudar com effect(), por exemplo para salvar no navegador, e aprenda quando um computed é melhor.',
    minutes: 20,
  },
  // Formulários
  {
    slug: '34-reactive-forms',
    track: 'formularios',
    question: 'Como criar formulários com Reactive Forms?',
    shortTitle: 'Reactive Forms',
    description:
      'Monte o formulário de viagem do Passaporte com Reactive Forms: FormGroup, FormControl, valores iniciais e o envio dos dados.',
    minutes: 35,
  },
  {
    slug: '35-validacao',
    track: 'formularios',
    question: 'Como validar campos com regex e mostrar mensagens de erro?',
    shortTitle: 'Validação',
    description:
      'Valide campos com regex e validadores próprios, mostre mensagens claras na hora certa e decida quando desabilitar o botão de enviar.',
    minutes: 45,
  },
  {
    slug: '36-signal-forms',
    track: 'formularios',
    question: 'Como fazer formulários com Signal Forms?',
    shortTitle: 'Signal Forms',
    description:
      'Refaça o formulário de viagem com Signal Forms, em que o modelo do formulário é um signal, e compare com a versão em Reactive Forms.',
    minutes: 35,
  },
  // Back-end
  {
    slug: '37-login-com-supabase',
    track: 'back-end',
    question: 'Como fazer login com Supabase Auth?',
    shortTitle: 'Login com Supabase',
    description:
      'Crie o seu projeto gratuito no Supabase e adicione cadastro, login e logout ao Passaporte, guardando a sessão de quem entrou.',
    minutes: 40,
  },
  {
    slug: '38-guards',
    track: 'back-end',
    question: 'Como proteger rotas com guards?',
    shortTitle: 'Guards',
    description:
      'Impeça que alguém sem login entre nas telas privadas com guards funcionais, e mande a pessoa para o login com o endereço de volta.',
    minutes: 25,
  },
  {
    slug: '39-interceptors',
    track: 'back-end',
    question: 'Como enviar o token em toda requisição com interceptors?',
    shortTitle: 'Interceptors',
    description:
      'Coloque o token em toda requisição do HttpClient, trate erros num lugar só e mostre um indicador de carregamento com interceptors.',
    minutes: 30,
  },
  {
    slug: '40-crud-com-supabase',
    track: 'back-end',
    question: 'Como criar, ler, atualizar e apagar dados no Supabase?',
    shortTitle: 'CRUD com Supabase',
    description:
      'Leve o seu passaporte para a nuvem: crie a tabela no Supabase, proteja os dados de cada pessoa e faça o CRUD completo pelo app.',
    minutes: 45,
  },
  {
    slug: '41-resolvers',
    track: 'back-end',
    question: 'Como carregar dados antes de abrir a tela com resolvers?',
    shortTitle: 'Resolvers',
    description:
      'Carregue os dados de uma tela antes de ela abrir com resolvers, e compare essa abordagem com buscar os dados dentro do componente.',
    minutes: 20,
  },
  // Qualidade
  {
    slug: '42-testes-com-vitest',
    track: 'qualidade',
    question: 'Como testar componentes e services com Vitest?',
    shortTitle: 'Testes com Vitest',
    description:
      'Escreva testes para services e componentes com Vitest, simule requisições HTTP e use os testes para mudar o código sem medo.',
    minutes: 45,
  },
  {
    slug: '43-erros-e-devtools',
    track: 'qualidade',
    question: 'Como ler os erros do Angular e usar o Angular DevTools?',
    shortTitle: 'Erros e DevTools',
    description:
      'Aprenda a ler as mensagens de erro do Angular e do TypeScript, e use o Angular DevTools para inspecionar componentes e signals.',
    minutes: 30,
  },
  {
    slug: '44-acessibilidade',
    track: 'qualidade',
    question: 'Como deixar o app acessível?',
    shortTitle: 'Acessibilidade',
    description:
      'Deixe o Passaporte usável por todo mundo: HTML semântico, teclado, foco visível, contraste, leitores de tela e o Angular Aria.',
    minutes: 40,
  },
  // Produção
  {
    slug: '45-defer',
    track: 'producao',
    question: 'Como carregar partes da tela sob demanda com `@defer`?',
    shortTitle: '@defer',
    description:
      'Carregue o mapa e os gráficos do Passaporte só quando aparecem na tela com @defer, e veja o primeiro carregamento ficar mais leve.',
    minutes: 25,
  },
  {
    slug: '46-seo',
    track: 'producao',
    question: 'Como fazer o Google encontrar o seu app com SEO?',
    shortTitle: 'SEO',
    description:
      'Faça o Google e as redes sociais entenderem o seu app com pré-renderização, título e descrição por página, Open Graph e sitemap.',
    minutes: 40,
  },
  {
    slug: '47-pwa',
    track: 'producao',
    question: 'Como transformar o app em um PWA instalável?',
    shortTitle: 'PWA',
    description:
      'Transforme o Passaporte num PWA: instalável no celular e no computador, com ícone próprio e funcionando mesmo sem internet.',
    minutes: 35,
  },
  {
    slug: '48-deploy-no-render',
    track: 'producao',
    question: 'Como gerar o build e publicar o app no Render?',
    shortTitle: 'Deploy no Render',
    description:
      'Gere o build de produção e publique o Passaporte no Render, entendendo por que recarregar uma rota pode dar erro 404 e como resolver.',
    minutes: 30,
  },
  {
    slug: '49-github-actions',
    track: 'producao',
    question: 'Como automatizar testes e publicação com GitHub Actions?',
    shortTitle: 'GitHub Actions',
    description:
      'Faça o GitHub rodar os testes e o build a cada push e publicar o app sozinho quando tudo passar, com um workflow do GitHub Actions.',
    minutes: 30,
  },
  {
    slug: '50-pwabuilder',
    track: 'producao',
    question: 'Como levar o PWA para as lojas de aplicativos com o PWABuilder?',
    shortTitle: 'PWABuilder',
    description:
      'Empacote o Passaporte com o PWABuilder para Google Play, Microsoft Store e outras lojas, e instale o pacote Android no seu celular.',
    minutes: 40,
  },
];

export const CHAPTERS: readonly Chapter[] = ENTRIES.map((entry, index) => ({
  ...entry,
  number: index + 1,
  prerequisites: entry.prerequisites ?? (index === 0 ? [] : [index]),
  verifiedWithAngular: entry.verifiedWithAngular ?? null,
  published: entry.published ?? false,
}));

export function chapterBySlug(slug: string): Chapter | undefined {
  return CHAPTERS.find((chapter) => chapter.slug === slug);
}

export function chapterByNumber(number: number): Chapter | undefined {
  return CHAPTERS[number - 1];
}

export function trackById(id: string): Track | undefined {
  return TRACKS.find((track) => track.id === id);
}

export function chaptersOfTrack(id: TrackId): Chapter[] {
  return CHAPTERS.filter((chapter) => chapter.track === id);
}

export function neighbors(slug: string): { previous?: Chapter; next?: Chapter } {
  const chapter = chapterBySlug(slug);
  if (!chapter) return {};
  return { previous: chapterByNumber(chapter.number - 1), next: chapterByNumber(chapter.number + 1) };
}
