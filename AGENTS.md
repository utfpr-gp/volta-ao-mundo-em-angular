# Regras para quem mantém o livro

Este arquivo vale para pessoas e para agentes de IA. O projeto completo do livro está em
[docs/projeto.md](docs/projeto.md); leia-o antes da primeira mudança. **Onde a construção parou e o que vem a seguir
está em [ESTADO.md](ESTADO.md):** leia antes de começar e atualize ao publicar um capítulo.

## O que é este repositório

**Volta ao Mundo em Angular** é um livro aberto, em português, que ensina Angular moderno do zero ao deploy.
O site é ele mesmo uma aplicação Angular, gerada como site estático e publicada no GitHub Pages
(`https://utfpr-gp.github.io/volta-ao-mundo-em-angular`). O livro ensina construindo um único app de exemplo,
o **Passaporte** (países visitados e desejados), que cresce a cada capítulo.

O critério principal é a **qualidade do material**. Não há prazo, turma ou calendário.

## Regras de escrita

1. **Público:** quem está na graduação em computação e qualquer pessoa que já sabe HTML, CSS e o básico de JavaScript.
   Essas pessoas já usaram terminal: trate comandos básicos (`cd`, `ls`, `mkdir`) como revisão rápida, e não como novidade.
   Não subestime: explique com calma o que é novo (Angular, TypeScript, ferramentas), sem infantilizar o que já é conhecido.
2. **Tom:** fale com "você", em frases curtas, de forma motivadora e técnica ao mesmo tempo. Nada de parede de código sem
   contexto, nem de texto frio.
3. **Toda ideia nova ganha uma analogia do cotidiano** (`<vm-analogy>`).
4. **Termos técnicos com o nome oficial** (`signal()`, `@defer`), explicados na primeira vez. A primeira aparição de cada
   termo em cada capítulo usa `<vm-term name="…">`; termo novo entra em `site/src/app/glossary/glossary.ts`.
5. **O site serve a qualquer pessoa.** Não mencione disciplina, aula, turma, ficha de avaliação, checklist, notas,
   datas de entrega nem vídeo. O verificador da saída (`npm run check`) reprova essas palavras.
6. **Português do Brasil** no texto. **Nomes no código em inglês**, tanto no site quanto no Passaporte; URLs, ids de
   seção e chaves de conteúdo em português.
7. **Confira toda API contra a documentação oficial da versão do Angular em uso** (angular.dev; via Context7 quando
   disponível). Nunca escreva de memória um nome de função, opção ou mensagem de erro.
8. **Armadilhas mostram mensagens reais**, reproduzidas de verdade (no projeto, no playground ou no terminal) e copiadas
   letra por letra.
9. Código em doses pequenas, sempre ligado a um resultado visível. Detalhes mais fundos vão em `<vm-deep-dive>`.

## Anatomia de um capítulo

Cada capítulo é uma narrativa única com sete visões, sempre nesta ordem e com estes ids:

| Visão | `kind` | id | Papel |
|---|---|---|---|
| 🎯 A missão | `mission` | `missao` | O que o Passaporte ganha, mostrado antes de qualquer explicação |
| 💡 A ideia | `idea` | `ideia` | A analogia do cotidiano |
| 🔬 Por dentro | `inside` | `por-dentro` | O conceito técnico, com um simulador interativo |
| 🛠️ Mão no código | `code` | `mao-no-codigo` | A prática guiada em passos (`<vm-steps>`) |
| ⚠️ Armadilhas | `pitfalls` | `armadilhas` | Os erros reais, com a mensagem exata e a saída |
| 🏁 Desafio | `challenge` | `desafio` | De 3 a 5 perguntas; acertar todas dá o carimbo |
| 📚 Para ir além | `further` | `para-ir-alem` | Links da documentação oficial |

Componentes disponíveis em `site/src/app/views/`:

| Componente | Uso |
|---|---|
| `<vm-chapter-page slug="NN-slug">` | A moldura do capítulo; tudo vai dentro dela |
| `<vm-view kind="…" title="…">` | Cada uma das sete visões |
| `<vm-analogy emoji="🍽️" title="…">` | O cartão da analogia |
| `<vm-code snippet="NN/nome" caption="arquivo.ts">` | Trecho de código de `site/snippets/NN-slug/nome.ext` |
| `<vm-steps>` + `<ng-template vmStep="Título">` | Passos da prática em abas |
| `<vm-pitfall title="…" message="mensagem exata">` | Uma armadilha |
| `<vm-deep-dive title="…">` | Caixa recolhível "Aprofundando" |
| `<vm-see-chapter [number]="6">` | Liga a outro capítulo ("você viu isso no capítulo 6") |
| `<vm-challenge [slug] [questions]>` | O desafio |
| `<vm-further-links [links]>` | Os links finais |
| `<vm-term name="…">` | Termo do glossário |

Nos trechos de código, marque a linha nova com `// [!code highlight]` (ou `<!-- [!code highlight] -->` no HTML);
a marca some do código mostrado e do código copiado.

## Como criar um capítulo

1. Leia a linha do capítulo em `site/src/app/catalog/catalog.ts` e os capítulos de que ele depende.
2. Confira no angular.dev todas as APIs que o capítulo vai usar, na versão do `package.json`.
3. Crie `site/src/app/chapters/NN-slug/` com:
   - `chapter.ts` e `chapter.html`, usando `<vm-chapter-page>` e as sete visões;
   - `content.ts`, com o resumo de 1 minuto (3 a 6 itens), os trechos essenciais, as perguntas do desafio
     (cada alternativa com explicação) e os links;
   - o simulador num componente próprio, com teste (teclado, `aria-live`, `motion-safe:`).
4. Ponha os trechos de código em `site/snippets/NN-slug/`.
5. Registre o capítulo em `site/src/app/chapters/loaders.ts` (`LOADERS`) e em `site/src/app/chapters/content.ts` (`CONTENT`).
6. Acrescente os termos novos ao glossário.
7. No catálogo, marque `published: true` e `verifiedWithAngular` com a versão em uso.
8. A partir do capítulo 5, crie a etapa do Passaporte em `passaporte/etapas/NN-slug/`: um projeto completo que roda
   sozinho e abre no StackBlitz.
9. Rode `npm test`, `npm run build` e `npm run check`. Confira no navegador: modo claro e escuro, 375 px, só teclado,
   e com "reduzir movimento" ligado.
10. Abra o Pull Request com o template preenchido. **Só o professor faz o merge**; o merge publica o capítulo.

## Regras técnicas

- **Cores só por tokens** (`bg-surface`, `text-ink`, `text-mission`…), declarados em `site/src/styles.css`.
  Nunca use cor solta. Token novo precisa passar em `node scripts/check-contrast.mjs` (AA, 4,5:1) nos dois modos.
- **Animações só com `motion-safe:`** (ou dentro de `@media (prefers-reduced-motion: no-preference)`).
- **Todo controle funciona com teclado**, e toda mudança de estado de simulador ou desafio é anunciada em
  `aria-live="polite"`.
- **Nada lê `localStorage` antes da hidratação**: use `safeStorage` e `afterNextRender`, como em `ProgressService`.
- **Links internos com `routerLink`**; âncoras com `[routerLink]="[]" [fragment]="id"` (um `href="#id"` voltaria
  para a página inicial por causa do `<base href>`).
- **Sem rastreamento, sem serviço externo em tempo de execução, sem chave de API.**
- Commits em português, no formato `tipo: descrição`.

## Mapa do repositório

| Caminho | O que tem |
|---|---|
| `site/src/app/catalog/` | Trilhas e capítulos (de onde saem rotas, menus e progresso) |
| `site/src/app/chapters/` | Um componente por capítulo publicado, mais `LOADERS`, `CONTENT` e a página "em breve" |
| `site/src/app/views/` | Os componentes das visões, a página de capítulo e o desafio |
| `site/src/app/pages/` | Início, trilhas, passaporte, glossário, busca, sobre e 404 |
| `site/src/app/progress/` | Os carimbos de quem lê, guardados no navegador |
| `site/src/app/seo/` | Títulos, descrições, Open Graph, URL canônica e JSON-LD |
| `site/snippets/` | Trechos de código dos capítulos (destacados no build) |
| `passaporte/etapas/` | Uma pasta por etapa do app de exemplo |
| `scripts/` | Trechos, pós-build (404, sitemap, robots, busca) e verificações |
| `docs/` | O projeto do livro e os planos de construção |

## Comandos

| Comando | O que faz |
|---|---|
| `npm start` | Servidor de desenvolvimento em http://localhost:4200 |
| `npm test` | Testes do site (Vitest) e dos scripts (node:test) |
| `npm run build` | Site estático em `site/dist/site/browser/`, com 404, sitemap, robots e índice da busca |
| `npm run check` | Contraste, verificação de cada página gerada e links internos |
| `node scripts/make-og-image.mjs` | Regera a imagem de compartilhamento a partir de `site/og.html` |

## Notas para capítulos futuros

Vindas das revisões do capítulo 1 (professor, estudante e especialista):

- **Capítulo 5 (CLI):** incluir um "Aprofundando: como ler uma mensagem de erro", porque os erros começam a aparecer ali,
  bem antes do capítulo 43.
- **Capítulo 11 (`@for`):** armadilha do `*ngFor` antigo com a mensagem real do compilador
  (`NG8103: The *ngFor directive was used in the template, but neither the NgFor directive nor the CommonModule was imported...`),
  e o aviso de que `*ngIf`/`*ngFor` estão obsoletos desde a versão 20. Não citar `*ngFor` antes desse capítulo.
- **Em todo capítulo:** no máximo duas ou três analogias; termo novo vai ao glossário; partes de curiosidade vão para
  `<vm-deep-dive>`; terminar com "E agora?" apontando a próxima parada.
- **Bibliotecas externas:** antes de citar a API de uma biblioteca, montar um projeto de teste à parte, rodar o build e
  conferir licença e tamanho (`Initial total`). Foi assim que apareceram a chave de licença do PrimeNG 22 e o choque do
  daisyUI com o `--color-primary` do Passaporte.
- **Trechos de código:** a chave ignora a extensão; `card.ts` e `card.html` na mesma pasta de `site/snippets` não podem
  conviver (a extração falha). Use nomes como `card.ts` e `card-template.html`.
- **Capturas de tela:** o Chrome headless segue o tema do sistema; para o modo claro, passe
  `--blink-settings=preferredColorScheme=1`.
- **Angular 22 mudou o que os tutoriais ensinam:** `ng generate service` gera `@Service()` (atalho para
  `@Injectable({ providedIn: 'root' })`, só com `inject()`); o `HttpClient` já vem disponível sem `provideHttpClient()`,
  e o `fetch` é o padrão (`withFetch()` está obsoleto); rotas filhas herdam parâmetros por padrão. Conferir no código do
  Angular (`node_modules/@angular/*/types`) antes de afirmar qualquer detalhe de API.
- **API de países do livro:** `site/public/api/paises.json`, gerada por `scripts/build-countries-api.mjs` (Wikidata CC0 +
  nomes do CLDR). A REST Countries v3.1 foi desativada e a v5 pede chave; não usar APIs que exijam chave no navegador.
- **Etapas a partir da 29:** o `Passport` faz requisições ao nascer. Todo spec que monta uma tela com ele usa
  `provideHttpClientTesting()` e `startPassport()` (de `src/testing/passport-testing.ts`); sem isso, o teste vai à rede de
  verdade. Para rodar o app: `npm run api` (json-server) e `ng serve`.
- **Testar httpResource e effects:** os resources só pedem dados quando o Angular roda os efeitos. Sequência nos specs:
  `TestBed.tick()`, `HttpTestingController` (`expectOne`/`flush`) e `await ApplicationRef.whenStable()`. Não chamar
  `whenStable()` com requisição pendente (trava). `vi.useFakeTimers()` não se dá bem com `toObservable`/effects: usar o
  relógio de verdade com esperas curtas.
- **APIs externas em uso:** a API de países do livro (com coordenadas das capitais) e a Open-Meteo para o tempo (sem chave,
  com CORS; exige citar a fonte, "Dados: Open-Meteo").
- **Capturas com interação:** `node scripts/capturar-tela.mjs <url> <saida.png> <largura> <altura> "js;;wait:600"` roda
  passos em JavaScript (digitar, clicar, esperar) no Chrome headless e captura a tela, sem Puppeteer. Para que um
  `<input type="date">` apareça como 30/10/2026, e não 10/30/2026, rode com `LANG=pt_BR.UTF-8 LANGUAGE=pt_BR`.
- **Capítulo 35 (validação), verificado no Angular 22.2.3:** `Validators.pattern` com texto ganha `^` e `$`; com `RegExp`,
  não. A flag `g` faz a mesma validação alternar. `min`/`max`/`pattern` ignoram campo vazio. `required` aceita `"   "`.
  As chaves de erro de `minLength`/`maxLength` são `minlength`/`maxlength`.
- **Capítulo 36 (Signal Forms), verificado no Angular 22.2.3:** `@angular/forms/signals` é `@publicApi 22.0` (estável).
  O `[formField]` escreve no HTML os atributos que vêm do schema (`required`, `min`, `max`, `maxlength`), e o compilador
  recusa os mesmos atributos escritos à mão (`NG8022`); em `input type="date"`, `min`/`max` são permitidos. Nos rádios, o
  `[value]` é permitido e vai para o HTML. O `[formField]` escuta só o evento `input`: nos testes, o `<select>` precisa de
  `new Event('input')`, e não de `change`. Campo de número apagado vira `null`. A chave do erro é `maxLength` (camelCase).
  O `pattern` só aceita `RegExp`; a flag `g` continua alternando, e o `required` aceita `"   "`. `form()` fora de um
  contexto de injeção dá `NG0203`. `submit()` marca os campos como tocados; `reset(valor)` troca o valor e limpa
  `touched`/`dirty`. Para testar um validador isolado: `TestBed.runInInjectionContext(() => form(signal(v), schema))`.
- **Capítulo 37 (Login com Supabase), verificado com `@supabase/supabase-js` 2.118 num Supabase local (CLI 3.0, Docker):**
  conferido contra o servidor de verdade, não contra a documentação. `signUp` com senha curta dá `weak_password`
  ("Password should be at least 6 characters."); e-mail repetido dá `user_already_exists`; senha errada e e-mail
  inexistente dão o mesmo `invalid_credentials` ("Invalid login credentials", status 400). Com a confirmação ligada
  (padrão dos projetos na nuvem), o `signUp` devolve `session: null`, e o login antes de confirmar dá
  `email_not_confirmed`; o link do e-mail volta ao **Site URL** (padrão `http://localhost:3000` na nuvem) e o cliente
  lê o token da URL e avisa `SIGNED_IN`. O `onAuthStateChange` avisa `INITIAL_SESSION` logo ao assinar. Sessão no
  `localStorage`, chave `sb-<ref>-auth-token` (`sb-127-auth-token` no local); `expires_in` 3600. Servidor fora do ar:
  `AuthRetryableFetchError`, `code` indefinido, status 0. `createClient('', …)` lança `supabaseUrl is required.`.
  O callback `async` do `onAuthStateChange` está `@deprecated` (pode travar): use o síncrono. Para conferir de novo:
  `npx supabase@3.0.0 init`, mudar as portas do `config.toml` se já houver outro Supabase local, `supabase start`;
  os e-mails ficam no Mailpit. **Nunca commitar** as chaves locais no `environment*.ts` da etapa: ela vai com valores
  de exemplo, e os testes usam o `testing/fake-supabase.ts`.
- **Capítulo 38 (Guards), verificado no Angular 22.2.4 e num Supabase local:** `CanActivateFn` assíncrono; `inject()`
  depois do `await` dá `NG0203: The \`Router\` token injection failed…` e a navegação não acontece. Guard que devolve
  `false`: o link não faz nada; digitando o endereço, o app abre em `/` com o cabeçalho e a tela vazia. Sem esperar a
  sessão: na maior parte das vezes ela chega a tempo (`ready=true` no guard), mas com o token vencido no `localStorage`
  o guard vê `ready=false signedIn=false` e desvia para `/entrar`; o `guestGuard` (que espera) devolve a pessoa.
  `withComponentInputBinding()` liga também os parâmetros de consulta, pelo nome público: `input(…, { alias: 'voltar' })`
  recebe `?voltar=`; sem o alias, o input fica vazio sem erro (conferido com `RouterTestingHarness`). Campo da classe
  declarado depois de uma Promise que o preenche é zerado pela declaração (`useDefineForClassFields`, ES2022): use
  variável local no construtor. Não afirmar que o `canActivate` evita baixar o `loadComponent` (não medido).
- **Capítulo 39 (Interceptors), verificado no Angular 22.2.3, com json-server e Supabase local:** o `HttpClient` já vem
  pronto, mas interceptors exigem `provideHttpClient(withInterceptors([...]))`. Interceptors só veem o `HttpClient`: o
  `supabase-js` usa `fetch` e põe o próprio token (visto na aba Rede). Sem esperar `whenReady()`, o primeiro `GET` do app,
  ao recarregar já logado, sai sem `Authorization`. Com o token em toda requisição, o GitHub Pages responde `405` ao
  preflight e o console mostra `Access to fetch at '…/api/paises.json' from origin 'http://localhost:4200' has been blocked
  by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header
  is present on the requested resource.`; o Open-Meteo aceita `authorization` no preflight (o token vazaria calado).
  `req.headers = …` dá `TS2540: Cannot assign to 'headers' because it is a read-only property.`; `req.headers.set(...)`
  sem usar o resultado não manda nada. `catchError(() => EMPTY)` no interceptor: o `subscribe` só recebe `complete`, e o
  `httpResource` vai para erro com `NG0991: Resource completed before producing a value.`. Barra com `tap` no lugar de
  `finalize` fica para sempre com o servidor parado.
- **Inspecionar a rede no Chrome headless:** com o protocolo do DevTools (como em `scripts/capturar-tela.mjs`),
  `Network.enable` mostra cada requisição com os cabeçalhos, `Log.enable` mostra os erros de CORS, e `Fetch.enable` com
  `patterns` segura uma requisição (para capturar a tela no meio do carregamento) até `Fetch.continueRequest`.
- **Capítulo 40 (CRUD com Supabase), verificado num Supabase local (CLI 3.0) com `supabase-js` 2.118:** a API REST
  (`/rest/v1/<tabela>`) responde: RLS ligado sem política, `GET` dá `200 []` calado e `POST` dá `403`
  `new row violates row-level security policy for table "trips"` (`42501`; sem login, `401`); RLS desligado, só a chave
  publicável lê e muda tudo; `POST` repetido sem `Prefer: resolution=merge-duplicates` dá `409`
  `duplicate key value violates unique constraint "passports_pkey"`; sem `Prefer: return=representation`, `201` com corpo
  vazio, e `const [created] = await firstValueFrom(…)` dá `TypeError: (intermediate value) is not iterable` (a linha foi
  criada); `PATCH` com o `id` no corpo dá `column "id" can only be updated to DEFAULT` (`428C9`); `PATCH`/`DELETE` sem
  filtro dão `UPDATE requires a WHERE clause`/`DELETE requires a WHERE clause` (`21000`); `check` violado dá `23514`;
  `PATCH`/`DELETE` em linha de outra pessoa dão `200 []`/`204` sem mudar nada. Tabela recém-criada pode dar `PGRST205`
  ("Could not find the table … in the schema cache") por um instante. O local aceitou pedido sem `apikey`; não afirmar
  nada sobre a nuvem sem conferir.
- **Chrome headless com Signal Forms:** depois de um `reset()`, `el.value = …` + `new Event('input')` deixa de chegar ao
  `[formField]` (campo número e select), embora a digitação de verdade funcione. Para roteiros de captura, use teclado
  (`Input.insertText` do protocolo do DevTools) ou crie os dados pela API. No jsdom (Vitest), o evento sintético funciona.
- **Capítulo 41 (Resolvers), verificado no Angular 22.2.3:** o roteador usa o **primeiro** valor de um Observable devolvido
  pelo resolver (não precisa completar); um Observable que nunca emite prende a navegação sem erro do Angular (tela vazia,
  título do `index.html`). Resolver que lança erro na navegação inicial: o app termina em `/` com a tela vazia e o console
  mostra `ERROR HttpErrorResponse`. Chave do `resolve` com nome diferente do `input()`: o input fica `undefined` sem aviso.
  `RedirectCommand` com `skipLocationChange: true` mantém na barra o endereço **anterior** (no teste, `Location.path()` dá
  `''`); use `browserUrl: state.url` (que já vem com o `redirectTo` das filhas, como `/paises/XX/visao-geral`). Com
  `browserUrl`, o `router.url` é o da página de destino, e o `Location.path()` é o pedido. `urlUpdateStrategy` padrão é
  `'deferred'`: a barra só muda no fim da navegação. Os `resources` de rota (`withRouterResources`, `nonBlocking`) são
  `@developerPreview 22.2`.
- **Capítulo 42 (Testes com Vitest), verificado no Vitest 5.0.5 com `@angular/build:unit-test`:** sem
  `provideHttpClientTesting()`, o `HttpClient` (provido por padrão na 22) vai à rede de verdade e o teste **passa** (369 ms);
  `whenStable()` com requisição pendente dá `Error: Test timed out in 5000ms.`; conferir sem esperar a tela dá
  `AssertionError: expected +0 to be 4 // Object.is equality`; `verify()` com requisição sem resposta dá
  `Error: Expected no open requests, found 1: POST …`; `--coverage` sem pacote dá `Code coverage requires either
  "@vitest/coverage-v8" or "@vitest/coverage-istanbul" to be installed.`. Para tirar a cor da saída do `ng test` ao copiar
  mensagens: `sed 's/\x1b\[[0-9;]*m//g'`.
- **Capítulo 43 (Erros e DevTools), verificado no Angular 22.2.3:** mensagens reais: `TS2551 … Did you mean 'country'?`
  (nome errado no template), `NG8001 … is not a known element` com duas hipóteses e `Find more at
  https://next.angular.dev/errors/NG8001` (erros do compilador apontam para `next.angular.dev`; os de execução, para
  `v22.angular.dev`), `NG8118: \`country\` is a required \`input\` and does not have a value in this context.` (o
  compilador da 22 barra ler `input.required` no construtor; não afirmar que dá NG0950), `NG0951` (viewChild.required sem
  resultado). Em produção, o NG0203 vira `ERROR C: NG0203` com nomes encurtados. Calar o NG8001 com
  `CUSTOM_ELEMENTS_SCHEMA` compila e deixa o elemento vazio. O `ErrorHandler` padrão faz `console.error('ERROR', erro)`.
  O objeto `ng` do modo de desenvolvimento tem `getComponent`, `getOwningComponent`, `getInjector`, `getListeners`,
  `applyChanges`, `isSignal` e outros. O Angular DevTools (extensão) não roda no Chrome headless: o que o livro diz dele vem
  de angular.dev/tools/devtools (quatro abas, `$ng0`, Show Signal Graph, `debugName`). O `@boundary` aparece nos tipos da 22,
  mas não na documentação: não usar.
- **Capítulo 44 (Acessibilidade), auditado no Chrome headless:** axe-core 4.14 (MPL-2.0, instalado só no rascunho; no
  livro, recomendar o Lighthouse do Chrome) injetado pelo `Runtime.evaluate`; a árvore de acessibilidade pelo
  `Accessibility.getFullAXTree` (papéis e nomes que o leitor de tela recebe). Teclado pelo `Input.dispatchKeyEvent`: para
  ativar botões com Enter, mande `rawKeyDown` + `char` (`text: '\r'`) + `keyUp`; links ativam já no keydown. Achados reais:
  `/paises` sem `h1`; `text-primary` com contraste 1,06:1 no escuro; 195 botões "Visitar"; filtro só pela cor; foco que
  fica no menu depois de navegar; e `<a href="#conteudo">` com `<base href="/">` leva a `/paises#conteudo`. O `not-sr-only`
  do Tailwind zera o padding (use `focus:px-4 focus:py-2`). Os botões °C/°F já tinham `aria-pressed`.
- **Capítulo 45 (@defer), verificado no Angular 22.2.3:** `NG8019: Trigger with no target can only be placed on an @defer
  that has a @placeholder block`; `NG8020: … with exactly one root element node`; citar o componente adiado fora do bloco
  (até num `viewChild`) o põe de volta na página, sem aviso. Para conferir o download sob demanda, use um build estático (o
  `ng serve` pede metadados dos componentes mais cedo) e a aba Rede: o pedaço só chega ao rolar. O Chart.js sem uma peça
  registrada dá `Error: "bar" is not a registered controller.`; `chart.js/auto` custa ~55 kB a mais. Os testes de
  `site/src/app/pages/track.spec.ts` procuram trilhas e capítulos não publicados no catálogo (e pulam quando não houver).
- **Capítulo 46 (SEO), verificado no Angular 22.2.3 com `@angular/ssr` 22.2.4:** rota com parâmetro em `Prerender` sem
  `getPrerenderParams` dá `The 'paises/:code/visao-geral' route uses prerendering and includes parameters, but
  'getPrerenderParams' is missing. …`; `localStorage` num componente pré-renderizado dá `ERROR ReferenceError: localStorage
  is not defined` e `An error occurred while prerendering route '/paises'. Error: The content returned was empty.`. Sem
  `robots.txt`, um servidor com fallback devolve o `index.csr.html`, e o Lighthouse diz `robots.txt is not valid` (19 erros,
  "Syntax not understood"). O `ng add @angular/ssr` cria `server.ts` com Express e `outputMode: "server"` (no rascunho, a
  instalação falhou por causa do `allow-scripts` do npm local). Lighthouse pela linha de comando:
  `npx -y lighthouse@12 <url> --only-categories=seo --output=json --chrome-flags="--headless=new"`. Servidor estático com
  fallback para testar: um `node:http` que tenta o arquivo, `<pasta>/index.html` e por fim o `index.csr.html`.
- **Capítulo 47 (PWA), verificado no Angular 22.2.3 com `@angular/service-worker` 22.2.3, no Chrome headless:** o
  `ng add @angular/pwa` (22.2.4) chama o schematic `service-worker`, copia manifesto e ícones (logo do Angular) para
  `public/`, põe `<link rel="manifest">` no `index.html` e só põe o `<noscript>` se não houver um; não põe `theme-color`.
  O manifesto gerado tem só o nome do projeto. `ng serve`: nenhum registro, e `/ngsw-worker.js` devolve o `index.html`;
  `ng serve --configuration=production` registra o service worker. `http-server` (`npx http-server -p 8080 -c-1 …`) não
  tem fallback: `/passaporte` direto dá 404 até o service worker assumir. Versão nova: aparece no carregamento seguinte ao
  build, com o `VERSION_READY`. Sem o servidor, as páginas e os países abrem do cache. No `ngsw-worker.js`, `freshness`
  cai na cópia quando a rede falha ou passa do `timeout`; `performance` usa a cópia sem consultar a rede. Um `dataGroup`
  com a API do Supabase (`performance`) fez o Bruno ver as viagens da Ana (o cache guarda pela URL). Sem
  `provideServiceWorker` nos specs: `NG0201: No provider found for \`SwUpdate\`. Source: DynamicTestModule. Path:
  _AppUpdates -> SwUpdate.`. O pacote inicial passou de 599,91 para 606,89 kB (aviso do orçamento de 600 kB). A pasta de
  rascunho pode ser limpa entre sessões: guarde capturas que vão para o livro direto em `site/public/imagens/`.
- **Capítulo 48 (Deploy no Render), verificado num site estático de verdade no Render (2026-11-10):** a ordem das respostas
  é arquivo com o nome exato → regra → pasta com `index.html` → `404.html` (status 404) → `Not Found` (texto, 404). Uma
  regra `/*` passa por cima das pastas pré-renderizadas pedidas sem barra no fim (`/paises`, `/sobre`); com destino
  `/index.html`, o Passaporte entra em laço (`Redirecting to /paises`; 1817 pedidos em 8 s num servidor local que imita a
  ordem). Rewrite para um arquivo que não existe (`/paises/:code` → `/paises/:code/index.html`, com `ZZ`) dá `200` com corpo
  vazio. Arquivos `.html` planos (`sobre.html`) não respondem por `/sobre`. Solução adotada: regras só para as rotas
  `RenderMode.Client` (`/passaporte`, `/entrar`, `/paises/:code/clima`, `/paises/:code/anotacoes`) e `404.html` = cópia do
  `index.csr.html` (`scripts/not-found.mjs`). Cabeçalhos: `cache-control: public, max-age=0, s-maxage=300` em tudo; mudar só
  as regras não limpa o cache da CDN (5 min). Logo depois do primeiro deploy de um site novo, alguns arquivos (até o
  `main-*.js`) deram `Not Found` por um ou dois minutos. O Blueprint acrescenta e muda regras pelo `source`, mas não apaga;
  renomear o serviço no `render.yaml` cria outro. O Render roda um `npm install` próprio antes do Build Command e leu o
  `.nvmrc` da raiz do livro (Node 24.22.2). Demonstração: `passaporte/render.yaml` (Blueprint
  `exs-dbpndu8m7kps73821lu0`, serviço `passaporte-livro-k64a`, https://passaporte-livro-k64a.onrender.com), com `rootDir`
  na etapa; o `npm ci` dentro da pasta da etapa instala pela raiz do workspace.
