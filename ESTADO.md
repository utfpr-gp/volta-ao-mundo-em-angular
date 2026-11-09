# Estado do livro

> Onde a construção do livro parou e o que vem a seguir. **Leia antes de começar; atualize ao publicar um capítulo.**
> As regras permanentes (escrita, anatomia do capítulo, regras técnicas) estão no [AGENTS.md](AGENTS.md); aqui fica só o que muda.
> Última atualização: 2026-11-08 (capítulos 39 e 40 em revisão).

## Publicado

- **Capítulos 1 a 38**, em sete trilhas: Embarque, Fundamentos, Componentes, Navegação, Dados, Formulários e o começo de Back-end. Todos com `verifiedWithAngular: '22.2'`.
- **Último capítulo novo:** 38, Guards (PR #34). Antes dele, o 37, Login com Supabase (PR #33), e o 36, Signal Forms (PR #31). Antes dele, o 35, Validação (PR #30, que também corrigiu os READMEs de todas as etapas, que diziam "capítulo 5"). **Última correção:** capítulo 20, a tabela "O mesmo nome, escalas diferentes" (`xl:`, `max-w-xl`, `text-xl`, `rounded-xl`) e a conta de `max-w-6xl` em px (PR #29).
- **Em revisão (PRs empilhados, cada um sobre a branch do anterior):** capítulo 39, Interceptors (PR #35, `trilha-back-end-3`); capítulo 40, CRUD com Supabase (`trilha-back-end-4`). O merge automático pelo agente foi bloqueado pela permissão do modo automático: os merges ficam com o professor.
- Site: <https://utfpr-gp.github.io/volta-ao-mundo-em-angular/>

## O Passaporte, na etapa 40

`passaporte/etapas/40-crud-com-supabase/`. Organização por funcionalidades (`core/`, `features/`, `shared/`), rotas com `loadComponent`/`loadChildren`:

- `/paises`: lista, destaque, progresso mundial, filtro; dados da API de países do livro (`site/public/api/paises.json`).
- `/paises/:code`: rotas filhas com visão geral, anotações e o tempo (Open-Meteo).
- `/passaporte`: o livro de carimbos e, desde o 34, o **formulário de viagem** (`trip-form`, Reactive Forms com `NonNullableFormBuilder`: país, chegada, dias, transporte, companhia) e o **diário de viagens**, do mais recente ao mais antigo.
- `core/passport.ts`: até o 39, o estado salvo (visitados, anotações, `trips?`) num PUT no json-server e a cópia no `localStorage` por um `effect` (capítulo 33). **Desde o 40, tudo no Supabase** (veja abaixo).
- **Desde o 35, o formulário valida:** `Validators.required`/`min`/`max`/`maxLength`/`pattern` e um validador próprio (`notInFuture`, em `trip-validators.ts`, junto com `today()` e `NAME_PATTERN`). Mensagem quando o campo é inválido e `touched` (`showError`), com `aria-invalid`, `aria-describedby` e borda `aria-invalid:border-danger`; token novo `--color-danger`. O botão fica desligado enquanto o formulário for inválido, com um aviso embaixo, e o `submit()` confere de novo.
- **Desde o 36, o formulário é Signal Forms** (`@angular/forms/signals`, estável desde a 22): modelo `trip = signal<Trip>(blankTrip())`, `tripForm = form(trip, schema, { submission: { action } })`; regras e frases no schema (`required`/`min`/`max`/`maxLength`/`pattern` com `message`; `notInFuture(path, { message })` com `validate`); template com `[formRoot]` e `[formField]`, mensagem pelo `errorOf(campo)`; o `action` registra e chama `field().reset(blankTrip())`. A aparência é a mesma do 35. Daqui em diante, formulários novos do Passaporte usam Signal Forms.
- **Desde o 37, há login com o Supabase Auth** (`@supabase/supabase-js`): `core/supabase.ts` (o `InjectionToken` `SUPABASE`, com `createClient` a partir do `environment`), `core/auth.ts` (o service `Auth`: sessão num signal alimentado pelo `onAuthStateChange`, `user`/`signedIn` em `computed`, `ready` depois do `INITIAL_SESSION`, `signIn`/`signUp`/`signOut` devolvendo `AuthOutcome`, erros traduzidos pelo `error.code`), a tela `/entrar` (`features/auth/sign-in-page`, Signal Forms, entrar e criar conta na mesma tela, `submitting()` no botão) e o cabeçalho com "Entrar" ou o e-mail e "Sair". `src/environments` com valores de exemplo (cada leitor usa o seu projeto). Testes com `testing/fake-supabase.ts`. **Os dados do passaporte continuam no json-server** até o 40; nenhuma rota é protegida até o 38 (o `ready` existe para o guard).
- **Desde o 38, `/passaporte` é protegida:** `core/auth-guards.ts` com `authGuard` (espera `auth.whenReady()`, desvia para `/entrar?voltar=<url>` com `createUrlTree`) e `guestGuard` (quem já entrou sai de `/entrar`). `Auth.whenReady()` é uma Promise resolvida no primeiro `onAuthStateChange`. A tela de entrar recebe `?voltar` por `input(…, { alias: 'voltar' })`, valida com `safeReturnUrl` e mostra o aviso "Essa página é só para quem entrou". O `fake-supabase` aceita `{ session, manualStart }`.
- **Desde o 39, há três interceptors** em `core/http/`, registrados no `app.config.ts` com `provideHttpClient(withInterceptors([loadingInterceptor, authInterceptor, errorInterceptor]))`. `core/api.ts` tem o `API_URL` (`http://localhost:3000`) e o `isApiRequest`. O `authInterceptor` espera `auth.whenReady()` (`from` + `switchMap`) e põe `Authorization: Bearer <token>` (do `Auth.accessToken`, um `computed`) só nas requisições para a API. O `loadingInterceptor` conta as requisições no service `Loading` (`busy`), com `finalize`; o `app.html` mostra uma barra (`role="progressbar"`, animação `animate-loading` no `@theme`, só com `motion-safe:`). O `errorInterceptor` liga o `ApiStatus.failed` (o aviso amarelo) e devolve o erro com `throwError`; o `Passport` perdeu o `putFailed`/`saveFailed`. Nos specs com os interceptors, o `authInterceptor` solta a requisição numa microtarefa: `await new Promise((r) => setTimeout(r))` antes do `expectOne`.
- **Desde o 40, os dados ficam no Supabase, e o json-server saiu** (sem `db.json`, sem o script `api`). `supabase/passaporte.sql` cria `passports` (uma linha por conta: `user_id` PK `default auth.uid()`, `visited text[]`, `notes jsonb`) e `trips` (`id` identity, `user_id`, `country`, `arrival date`, `days`, `transport`, `companion`, com `check`), os `grant` para `authenticated`, o RLS e as políticas (`auth.uid() = user_id`). O `extract-snippets` lê também a pasta `supabase/` das etapas (chave `40/etapa/supabase/passaporte.sql`) e conhece SQL (`-- [!code highlight]`). O `API_URL` é `<supabaseUrl>/rest/v1`; o `authInterceptor` põe `apikey` e `Authorization`. No `Passport`: `savedRef` e `tripsRef` são `httpResource` que devolvem `undefined` sem login (idle) e usam `params` (`select`, `order`); `parse` tira a linha da lista; upsert com `Prefer: resolution=merge-duplicates`; `addTrip`/`updateTrip`/`deleteTrip` são `async` com `firstValueFrom`, `Prefer: return=representation` e filtro `id=eq.<id>` (o id nunca vai no corpo). A cópia no `localStorage` é por conta (`copyKey(userId)` = `passaporte:<id>`), e sem login não há cópia nem requisição: as marcações ficam só na visita. `Trip` ganhou `id?`. O formulário edita (`edit(trip)` chamado pelo diário via `viewChild`, `reset({...trip})`, foco no país, "Cancelar edição", `saveFailed` com `aria-live`), e o diário tem "Editar" e "Apagar" com `aria-label`. Testes: `startPassport(countries, saved, trips)` faz `overrideProvider(SUPABASE, …)` com a Ana logada (chame antes de qualquer `inject`) e responde aos três GET; `passportsGet`, `passportsUpsert`, `tripsRequest(method)` e `paramsOf` ajudam nos `expectOne`.

## Próximos capítulos (catálogo)

| Nº | Slug | Pergunta |
| --- | --- | --- |
| 41 | `41-resolvers` | Como carregar dados antes de abrir a tela com resolvers? |
| 42 | `42-testes-com-vitest` | Como testar componentes e services com Vitest? |
| 43 | `43-erros-e-devtools` | Como ler os erros do Angular e usar o Angular DevTools? |
| 44 | `44-acessibilidade` | Como deixar o app acessível? |
| 45 | `45-defer` | Como carregar partes da tela sob demanda com `@defer`? |
| 46 | `46-seo` | Como fazer o Google encontrar o seu app com SEO? |
| 47 | `47-pwa` | Como transformar o app em um PWA instalável? |
| 48 | `48-deploy-no-render` | Como gerar o build e publicar o app no Render? |
| 49 | `49-github-actions` | Como automatizar testes e publicação com GitHub Actions? |
| 50 | `50-pwabuilder` | Como levar o PWA para as lojas de aplicativos com o PWABuilder? |

As perguntas e descrições completas estão em `site/src/app/catalog/catalog.ts`. Notas específicas para o capítulo 41 estão no fim do `AGENTS.md`.

**Supabase local para conferir (2026-11-08):** `npx supabase@3.0.0 init` numa pasta de rascunho, portas trocadas para 553xx no `config.toml` (outro projeto já usava as 543xx), `supabase start -x vector,logflare,imgproxy,edge-runtime,realtime,storage-api,studio,postgres-meta`; o SQL da etapa roda com `docker exec -i supabase_db_<project_id> psql -U postgres`.

## Como um capítulo é publicado

1. Branch a partir da `main` (até aqui, uma por trilha: `trilha-formularios-1`, `trilha-formularios-2`…; correções com nome próprio, como `cap20-escalas-xl`).
2. Capítulo, etapa do Passaporte, trechos, glossário, catálogo, capturas de tela (`scripts/capturar-tela.mjs`, com `--lang=pt-BR`).
3. `npm test`, `npm run build`, `npm run check`, e conferência no navegador (claro e escuro, 375 px, teclado, movimento reduzido).
4. Commit `Capítulo NN: <título>`, push, Pull Request.
5. **O merge é autorizado pelo professor.** Com a autorização dada na conversa, o merge foi feito por `gh api` (PUT no endpoint de merge do PR). O merge na `main` dispara o `publicar.yml`; se a publicação não rodar, ela pode ser disparada à mão (`workflow_dispatch`).
6. Conferir a página publicada com `curl` (status 200 e o título do capítulo).

   Antes do merge, conferir se o PR tem o último commit: `gh pr view N --json headRefOid` tem de bater com `git rev-parse HEAD`. No PR #31, um push feito depois da abertura não chegou ao PR, e o merge levou a versão anterior.

## Cuidados que apareceram no caminho

- **Largura em 375 px (problema conhecido, fora dos capítulos):** a dica do `<vm-term>` (`span` invisível com `w-72`, centrado no termo) passa da borda direita quando o termo fica perto dela e alarga a página. Em 2026-10-30, 17 capítulos tinham `scrollWidth` maior que 375 (1, 2, 4, 7, 8, 15, 16, 17, 18, 21, 22, 24, 25, 28, 30, 34 e 36); o 37 também (436 px, termos `promise` e `jwt`). A correção é no `site/src/app/glossary/term.ts`, numa branch própria; o 18 (569 px) pode ter outra causa além dessa.

- **Porta 3000:** o json-server das etapas usa a 3000. Ao rodar capturas de tela, parar só os processos iniciados pela própria sessão, nunca o que já estava rodando.
- **`input[value=…]` com `formControlName`:** o `[value]` do rádio vai para a diretiva, e o atributo no DOM não é o valor. Nos testes, achar os rádios pelo texto do rótulo.
- **`@if` que troca um campo:** depois de mudar o estado, `await fixture.whenStable()` antes de digitar no campo novo.
- **`DatePipe` com `'AAAA-MM-DD'`** é tratado como data local: não há o "dia a menos" que se costuma temer. Não virou armadilha.
