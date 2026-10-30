# Estado do livro

> Onde a construção do livro parou e o que vem a seguir. **Leia antes de começar; atualize ao publicar um capítulo.**
> As regras permanentes (escrita, anatomia do capítulo, regras técnicas) estão no [AGENTS.md](AGENTS.md); aqui fica só o que muda.
> Última atualização: 2026-10-30 (capítulo 35 em revisão).

## Publicado

- **Capítulos 1 a 34**, em seis trilhas: Embarque, Fundamentos, Componentes, Navegação, Dados e o começo de Formulários. Todos com `verifiedWithAngular: '22.2'`.
- **Último capítulo novo:** 34, Reactive Forms (PR #28). **Última correção:** capítulo 20, a tabela "O mesmo nome, escalas diferentes" (`xl:`, `max-w-xl`, `text-xl`, `rounded-xl`) e a conta de `max-w-6xl` em px (PR #29).
- **Em revisão:** capítulo 35, Validação, na branch `trilha-formularios-2` (PR aberto, esperando a autorização do merge). A mesma branch corrige os READMEs de todas as etapas, que diziam "capítulo 5".
- Site: <https://utfpr-gp.github.io/volta-ao-mundo-em-angular/>

## O Passaporte, na etapa 35

`passaporte/etapas/35-validacao/`. Organização por funcionalidades (`core/`, `features/`, `shared/`), rotas com `loadComponent`/`loadChildren`:

- `/paises`: lista, destaque, progresso mundial, filtro; dados da API de países do livro (`site/public/api/paises.json`).
- `/paises/:code`: rotas filhas com visão geral, anotações e o tempo (Open-Meteo).
- `/passaporte`: o livro de carimbos e, desde o 34, o **formulário de viagem** (`trip-form`, Reactive Forms com `NonNullableFormBuilder`: país, chegada, dias, transporte, companhia) e o **diário de viagens**, do mais recente ao mais antigo.
- `core/passport.ts`: o estado salvo (visitados, desejados, anotações, `trips?`), PUT no json-server (`npm run api`, `db.json`) e cópia no `localStorage` por um `effect` (capítulo 33).
- **Desde o 35, o formulário valida:** `Validators.required`/`min`/`max`/`maxLength`/`pattern` e um validador próprio (`notInFuture`, em `trip-validators.ts`, junto com `today()` e `NAME_PATTERN`). Mensagem quando o campo é inválido e `touched` (`showError`), com `aria-invalid`, `aria-describedby` e borda `aria-invalid:border-danger`; token novo `--color-danger`. O botão fica desligado enquanto o formulário for inválido, com um aviso embaixo, e o `submit()` confere de novo.
- **O 36 (Signal Forms)** refaz este mesmo formulário e compara com a versão do 35.

## Próximos capítulos (catálogo)

| Nº | Slug | Pergunta |
| --- | --- | --- |
| 36 | `36-signal-forms` | Como fazer formulários com Signal Forms? |
| 37 | `37-login-com-supabase` | Como fazer login com Supabase Auth? |
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

## Cuidados que apareceram no caminho

- **Porta 3000:** o json-server das etapas usa a 3000. Ao rodar capturas de tela, parar só os processos iniciados pela própria sessão, nunca o que já estava rodando.
- **`input[value=…]` com `formControlName`:** o `[value]` do rádio vai para a diretiva, e o atributo no DOM não é o valor. Nos testes, achar os rádios pelo texto do rótulo.
- **`@if` que troca um campo:** depois de mudar o estado, `await fixture.whenStable()` antes de digitar no campo novo.
- **`DatePipe` com `'AAAA-MM-DD'`** é tratado como data local: não há o "dia a menos" que se costuma temer. Não virou armadilha.
