# Estado do livro

> Onde a construção do livro parou e o que vem a seguir. **Leia antes de começar; atualize ao publicar um capítulo.**
> As regras permanentes (escrita, anatomia do capítulo, regras técnicas) estão no [AGENTS.md](AGENTS.md); aqui fica só o que muda.
> Última atualização: 2026-11-04 (capítulo 37 publicado).

## Publicado

- **Capítulos 1 a 37**, em sete trilhas: Embarque, Fundamentos, Componentes, Navegação, Dados, Formulários e o começo de Back-end. Todos com `verifiedWithAngular: '22.2'`.
- **Último capítulo novo:** 37, Login com Supabase (PR #33). Antes dele, o 36, Signal Forms (PR #31). Antes dele, o 35, Validação (PR #30, que também corrigiu os READMEs de todas as etapas, que diziam "capítulo 5"). **Última correção:** capítulo 20, a tabela "O mesmo nome, escalas diferentes" (`xl:`, `max-w-xl`, `text-xl`, `rounded-xl`) e a conta de `max-w-6xl` em px (PR #29).
- **Próximo capítulo novo:** 38, Guards (usa o `Auth.ready` da etapa 37).
- Site: <https://utfpr-gp.github.io/volta-ao-mundo-em-angular/>

## O Passaporte, na etapa 37

`passaporte/etapas/37-login-com-supabase/`. Organização por funcionalidades (`core/`, `features/`, `shared/`), rotas com `loadComponent`/`loadChildren`:

- `/paises`: lista, destaque, progresso mundial, filtro; dados da API de países do livro (`site/public/api/paises.json`).
- `/paises/:code`: rotas filhas com visão geral, anotações e o tempo (Open-Meteo).
- `/passaporte`: o livro de carimbos e, desde o 34, o **formulário de viagem** (`trip-form`, Reactive Forms com `NonNullableFormBuilder`: país, chegada, dias, transporte, companhia) e o **diário de viagens**, do mais recente ao mais antigo.
- `core/passport.ts`: o estado salvo (visitados, desejados, anotações, `trips?`), PUT no json-server (`npm run api`, `db.json`) e cópia no `localStorage` por um `effect` (capítulo 33).
- **Desde o 35, o formulário valida:** `Validators.required`/`min`/`max`/`maxLength`/`pattern` e um validador próprio (`notInFuture`, em `trip-validators.ts`, junto com `today()` e `NAME_PATTERN`). Mensagem quando o campo é inválido e `touched` (`showError`), com `aria-invalid`, `aria-describedby` e borda `aria-invalid:border-danger`; token novo `--color-danger`. O botão fica desligado enquanto o formulário for inválido, com um aviso embaixo, e o `submit()` confere de novo.
- **Desde o 36, o formulário é Signal Forms** (`@angular/forms/signals`, estável desde a 22): modelo `trip = signal<Trip>(blankTrip())`, `tripForm = form(trip, schema, { submission: { action } })`; regras e frases no schema (`required`/`min`/`max`/`maxLength`/`pattern` com `message`; `notInFuture(path, { message })` com `validate`); template com `[formRoot]` e `[formField]`, mensagem pelo `errorOf(campo)`; o `action` registra e chama `field().reset(blankTrip())`. A aparência é a mesma do 35. Daqui em diante, formulários novos do Passaporte usam Signal Forms.
- **Desde o 37, há login com o Supabase Auth** (`@supabase/supabase-js`): `core/supabase.ts` (o `InjectionToken` `SUPABASE`, com `createClient` a partir do `environment`), `core/auth.ts` (o service `Auth`: sessão num signal alimentado pelo `onAuthStateChange`, `user`/`signedIn` em `computed`, `ready` depois do `INITIAL_SESSION`, `signIn`/`signUp`/`signOut` devolvendo `AuthOutcome`, erros traduzidos pelo `error.code`), a tela `/entrar` (`features/auth/sign-in-page`, Signal Forms, entrar e criar conta na mesma tela, `submitting()` no botão) e o cabeçalho com "Entrar" ou o e-mail e "Sair". `src/environments` com valores de exemplo (cada leitor usa o seu projeto). Testes com `testing/fake-supabase.ts`. **Os dados do passaporte continuam no json-server** até o 40; nenhuma rota é protegida até o 38 (o `ready` existe para o guard).

## Próximos capítulos (catálogo)

| Nº | Slug | Pergunta |
| --- | --- | --- |
| 38 | `38-guards` | Como proteger rotas com guards? |
| 39 | `39-interceptors` | Como enviar o token em toda requisição com interceptors? |
| 40 | `40-crud-com-supabase` | Como criar, ler, atualizar e apagar dados no Supabase? |
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

As perguntas e descrições completas estão em `site/src/app/catalog/catalog.ts`. Notas específicas para os capítulos 39 e 41 estão no fim do `AGENTS.md`.

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
