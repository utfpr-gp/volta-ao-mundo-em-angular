# Volta ao Mundo em Angular — plano 1: a estrutura do livro e o capítulo 1

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar no GitHub Pages o site "Volta ao Mundo em Angular". Ele já deve trazer as páginas, o catálogo dos 50 capítulos, o passaporte de carimbos, a busca, o glossário, o SEO e a verificação automática, além do capítulo 1 completo. Os outros 49 capítulos aparecem como "em breve".

**Architecture:**
- **O site:** uma aplicação Angular 22 standalone e zoneless, gerada como site estático (`outputMode: "static"`). Cada página é pré-renderizada no build.
- **Os dados de cada capítulo:** a pergunta, a trilha e se já foi publicado vêm de um catálogo em TypeScript. O texto do capítulo fica num componente próprio, carregado sob demanda, que usa componentes compartilhados para as "visões".
- **O pós-build:** os trechos de código são destacados no build (Shiki) e viram um arquivo TypeScript gerado. Depois do build, um script cria o `404.html`, o `sitemap.xml`, o `robots.txt` e o índice da busca (Pagefind), e outros scripts verificam a saída.

**Tech Stack:**
- **Site e interface:** Angular 22 (`@angular/ssr`, Angular Aria, Vitest), Tailwind CSS 4 com `@tailwindcss/typography`, fontes `@fontsource-variable`.
- **Build e verificação:** Shiki com `@shikijs/transformers`, Pagefind e linkinator. Scripts em Node 24 com `node:test`.
- **Publicação:** GitHub Actions e GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-22-volta-ao-mundo-em-angular-design.md`. O esboço visual aprovado está em `docs/superpowers/specs/2026-10-22-volta-ao-mundo-esboco-capitulo.html`.

**Escopo deste plano:** a estrutura (seções 4 a 10 do spec, menos as etapas do Passaporte) e o capítulo 1. Cada capítulo seguinte terá o seu próprio plano curto, seguindo o "Como criar um capítulo" do `AGENTS.md` (Task 14). O primeiro desses planos, o do capítulo 5, também cria a primeira etapa do Passaporte e a extração de trechos a partir das etapas.

## Global Constraints

- **Repositório e endereço:**
  - repositório `utfpr-gp/volta-ao-mundo-em-angular`, público, clonado em `/home/ronifabio/dev/volta-ao-mundo-em-angular`;
  - URL do site `https://utfpr-gp.github.io/volta-ao-mundo-em-angular`, com `baseHref` `/volta-ao-mundo-em-angular/`.
- **Versões:** Angular na versão estável atual (22.x); Node 24; uma única versão do Angular na raiz de um workspace npm (`site/` e `passaporte/etapas/*`).
- **Nomes no código:**
  - classes, funções, arquivos e variáveis em inglês;
  - textos, URLs, ids de seção e chaves de conteúdo em português;
  - prefixo dos seletores: `vm`.
- **Proibido em qualquer texto do site:** "vídeo", "disciplina", "aula", "ficha", "checklist", "turma", "nota" no sentido de avaliação, e datas de entrega. "UTFPR" só aparece no crédito do rodapé, na página Sobre e no JSON-LD.
- **Crédito:**
  - rodapé de todas as páginas: "Volta ao Mundo em Angular · Prof. Roni Fabio Banaszewski · Tecnologia em Sistemas para Internet · UTFPR Guarapuava", mais a licença;
  - licenças: CC BY 4.0 para o texto e MIT para o código.
- **Cores e fontes:**
  - nenhum componente usa cor solta, só tokens com nome de papel;
  - contraste AA (4,5:1) em todo texto, nos dois modos;
  - fontes Nunito Sans (texto) e JetBrains Mono (código), servidas pelo próprio site.
- **Animação e acessibilidade:**
  - toda animação só roda com a variante `motion-safe:`;
  - todo controle interativo funciona com teclado;
  - toda mudança de estado de simulador ou desafio é anunciada numa região `aria-live="polite"`.
- **Sem rastreamento**, sem serviço externo em tempo de execução e sem chave de API.
- **Ids das visões**, em ordem e iguais em todo capítulo: `missao`, `ideia`, `por-dentro`, `mao-no-codigo`, `armadilhas`, `desafio`, `para-ir-alem`.
- **Commits:** em português, no formato `tipo: descrição`, terminando com a linha `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.

## Review Focus

1. **Navegador sem armazenamento.** Quando o `localStorage` está bloqueado, cheio ou com conteúdo corrompido, o site abre normalmente, o passaporte começa vazio e nada quebra. Importar um arquivo inválido mostra um erro e mantém o progresso atual. Os testes ficam na Task 6.
2. **Hidratação.** O HTML pré-gerado não conhece o progresso nem o tema de quem lê. O progresso só é lido depois da hidratação (`afterNextRender`), e o tema é aplicado no `<html>` por um script em linha, antes do Angular. Recarregar um capítulo com carimbo não pode gerar o erro NG0500 no console. Os testes ficam nas Tasks 2 e 6, e a verificação manual, na Task 14.
3. **Links profundos no GitHub Pages.** Abrir `/capitulos/09-signals` com ou sem a barra final mostra o capítulo. Um endereço inexistente mostra a página 404 do livro, com estilo e links funcionando, mesmo estando aninhado. Os testes ficam na Task 13, e a verificação no site publicado, na Task 14.
4. **Busca indisponível ou vazia.** No `ng serve`, sem o índice do Pagefind, a busca avisa que só funciona no site publicado. Um termo sem resultado mostra uma mensagem amigável, e `?q=` na URL já abre com a busca feita. Os testes ficam na Task 11.
5. **Desafio respondido pela metade.** Conferir com perguntas em branco marca essas perguntas como "Escolha uma alternativa" e não dá o carimbo. Acertar tudo carimba uma vez só e mantém a data do primeiro acerto. Os testes ficam na Task 9.

---

## Estrutura de arquivos

```
volta-ao-mundo-em-angular/
├── package.json                 workspace: ["site", "passaporte/etapas/*"]; scripts da raiz
├── AGENTS.md  CLAUDE.md  README.md  LICENSE (MIT)  LICENSE-CONTEUDO.md (CC BY 4.0)
├── docs/                        spec, esboço e este plano (copiados na Task 1)
├── .github/workflows/publicar.yml  links-externos.yml   .github/dependabot.yml
├── .github/pull_request_template.md
├── passaporte/etapas/.gitkeep   (a primeira etapa chega com o capítulo 5)
├── scripts/
│   ├── extract-snippets.mjs  (+ .test.mjs)   trechos → site/src/generated/snippets.ts
│   ├── post-build.mjs        (+ .test.mjs)   404.html, sitemap, robots, Pagefind
│   ├── check-contrast.mjs    (+ .test.mjs)
│   ├── check-output.mjs      (+ .test.mjs)
│   ├── check-links.mjs
│   ├── build-stages.mjs                       build de cada etapa
│   └── make-og-image.mjs                      gera site/public/og.png a partir de site/og.svg
└── site/
    ├── angular.json  .postcssrc.json  package.json
    ├── og.svg
    ├── snippets/NN-slug/<nome>.<ext>          trechos soltos dos capítulos
    ├── public/og.png  public/favicon.svg
    └── src/
        ├── index.html  styles.css  main.ts  main.server.ts
        ├── generated/snippets.ts              (gerado, no .gitignore)
        └── app/
            ├── app.ts|html  app.config.ts  app.config.server.ts  app.routes.ts  app.routes.server.ts
            ├── catalog/catalog.ts                  trilhas, capítulos e consultas
            ├── shared/safe-storage.ts  inline-code.ts  stamp.ts
            ├── theme/theme.ts  theme-toggle.ts
            ├── seo/seo.ts  book-title-strategy.ts  site.ts
            ├── progress/progress.ts
            ├── glossary/glossary.ts  term.ts
            ├── search/search.ts
            ├── layout/top-bar.ts  footer.ts
            ├── views/                              componentes das visões
            │   chapter-page.ts  chapter-header.ts  view.ts  analogy.ts  code.ts  steps.ts
            │   pitfall.ts  deep-dive.ts  further-links.ts  see-chapter.ts  challenge.ts  grade.ts
            ├── chapters/
            │   loaders.ts  content.ts  types.ts  coming-soon.ts
            │   01-o-que-e-o-angular/chapter.ts|html  content.ts  spa-simulator.ts
            └── pages/
                home.ts  passport.ts  track.ts  glossary-page.ts  search-page.ts  about.ts  not-found.ts
```

Cada `.ts` de `app/` tem o seu `.spec.ts` ao lado quando a task pede teste.

---

### Task 1: Repositório, workspace e esqueleto do site estático

**Files:**
- Create: o repositório inteiro conforme a árvore acima, só com o esqueleto
- Create: `docs/` (cópia do spec, do esboço e deste plano, vindos de `utf-disciplinas/docs/superpowers/`)
- Create: `package.json` (raiz), `LICENSE`, `LICENSE-CONTEUDO.md`, `README.md`, `.gitignore`, `.nvmrc` (`24`)

**Interfaces:**
- Produces:
  - os comandos da raiz `npm run build` (gera `site/dist/site/browser/`), `npm test` e `npm start`;
  - o prefixo `vm`;
  - o app `site` com `outputMode: "static"`, zoneless, Vitest, Tailwind 4, `@tailwindcss/typography`, `@angular/aria`, `@fontsource-variable/nunito-sans` e `@fontsource-variable/jetbrains-mono`.

- [ ] **Step 1: Criar o repositório**
  - O professor autorizou criar o repositório na organização `utfpr-gp`.
  - Antes, confira `gh auth status` e se a conta tem permissão na organização. Se não tiver, pare e avise.
  - Comandos: `gh repo create utfpr-gp/volta-ao-mundo-em-angular --public --description "Livro aberto e interativo de Angular moderno, do zero ao deploy" --clone`, depois mova a pasta para `/home/ronifabio/dev/volta-ao-mundo-em-angular`.

- [ ] **Step 2: Gerar o app**
  - Na raiz do repositório, rode `npx @angular/cli@22 new site --directory site --ssr --style css --prefix vm --skip-git --skip-install`.
  - Na raiz, crie o `package.json` com `"private": true`, `"workspaces": ["site", "passaporte/etapas/*"]` e `"engines": {"node": ">=24"}`, e rode `npm install`.

- [ ] **Step 3: Configurar o build estático**
  - No `site/angular.json`:
    - `outputMode: "static"`;
    - `baseHref: "/volta-ao-mundo-em-angular/"` só na configuração `production`;
    - remova a entrada `ssr.entry` e o `server.ts`, se o build continuar verde sem eles (o modo estático não precisa de servidor Express);
    - mantenha o `main.server.ts` e o `app.config.server.ts`, que fazem a pré-renderização.
  - No `app.routes.server.ts`, deixe `[{ path: '**', renderMode: RenderMode.Prerender }]`. A Task 4 completa esse arquivo.

- [ ] **Step 4: Tailwind, tipografia, fontes e Aria**
  - Instale no workspace `site`: `tailwindcss @tailwindcss/postcss postcss @tailwindcss/typography @angular/aria @fontsource-variable/nunito-sans @fontsource-variable/jetbrains-mono`.
  - Crie o `site/.postcssrc.json` com `{"plugins": {"@tailwindcss/postcss": {}}}`.
  - O `styles.css` começa com `@import "tailwindcss"; @plugin "@tailwindcss/typography";` e os dois imports das fontes. A Task 2 completa o resto.

- [ ] **Step 5: Scripts da raiz**
  - `"snippets": "node scripts/extract-snippets.mjs"`. Até a Task 7, ele só cria um `site/src/generated/snippets.ts` com `export type SnippetId = never; export const SNIPPETS = {} as Record<SnippetId, never>;`.
  - `"start": "npm run snippets && npm start -w site"`.
  - `"build": "npm run snippets && npm run build -w site && node scripts/post-build.mjs"`. O `post-build.mjs` começa vazio.
  - `"test": "npm run snippets && npm test -w site -- --watch=false && node --test scripts/"`.
  - `"check": "node scripts/check-contrast.mjs && node scripts/check-output.mjs && node scripts/check-links.mjs"`. Até as Tasks 2 e 13, cada script é um stub que sai com 0.
  - Ponha `site/src/generated/` no `.gitignore`.

- [ ] **Step 6: Licenças, README e docs**
  - `LICENSE`: MIT, "Copyright (c) 2026 Roni Fabio Banaszewski".
  - `LICENSE-CONTEUDO.md`: aviso em português de que o texto e as imagens estão sob CC BY 4.0, com o link `https://creativecommons.org/licenses/by/4.0/deed.pt-br`.
  - `README.md`: o que é o site, o link publicado, como rodar (`npm install`, `npm start`), a estrutura de pastas e as licenças. Nada de disciplina.

- [ ] **Step 7: Conferir**
  - Rode `npm test` e espere o PASS do spec padrão do app.
  - Rode `npm run build` e confira que `site/dist/site/browser/index.html` existe, contém `<base href="/volta-ao-mundo-em-angular/">` e que não há pasta `site/dist/site/server/`.

- [ ] **Step 8: Commit e push**
  - Commit `chore: esqueleto do site estático em Angular 22`, push na `main` (é o único commit direto na `main`).
  - Daí em diante, crie a branch `estrutura-inicial`. As Tasks 2 a 14 vão nela.

---

### Task 2: Design tokens e modo escuro

**Files:**
- Modify: `site/src/styles.css`, `site/src/index.html`
- Create: `site/src/app/shared/safe-storage.ts`, `site/src/app/theme/theme.ts`, `site/src/app/theme/theme-toggle.ts`, `scripts/check-contrast.mjs`
- Test: `site/src/app/shared/safe-storage.spec.ts`, `site/src/app/theme/theme.spec.ts`, `scripts/check-contrast.test.mjs`

**Interfaces:**
- Produces:
  - `safeStorage.read(key: string): string | null` e `safeStorage.write(key: string, value: string): boolean`, que nunca lançam exceção;
  - `ThemeService`: `preference: Signal<'system' | 'light' | 'dark'>`, `effective: Signal<'light' | 'dark'>`, `toggle(): void`;
  - o atributo `data-theme="light|dark"` no `<html>`;
  - a chave `vmea:theme`;
  - o componente `<vm-theme-toggle />`;
  - as classes Tailwind `bg-surface`, `text-ink`, `text-mission` e afins.

- [ ] **Step 1: Tokens no `@theme` do `styles.css`** (os valores do modo claro vêm do spec; os do escuro são decisão do plano)

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--color-primary` | `#12263A` | `#0A1622` | barra do topo, cabeçalho do capítulo |
| `--color-primary-soft` | `#1C3550` | `#1C3550` | chips sobre o primary |
| `--color-on-primary` | `#FFFFFF` | `#FFFFFF` | texto sobre primary |
| `--color-surface` | `#FBF8F1` | `#0F1C2B` | fundo (papel) |
| `--color-surface-raised` | `#FFFFFF` | `#16283B` | cartões |
| `--color-ink` | `#1E2430` | `#E8EEF5` | texto |
| `--color-ink-muted` | `#5B6474` | `#A7B6C6` | texto secundário |
| `--color-line` | `#E7E1D3` | `#2A3F55` | bordas |
| `--color-link` | `#1F6FB2` | `#7DB8EE` | links |
| `--color-stamp` | `#C8102E` | `#FF5A6E` | carimbo |
| `--color-highlight` | `#D99A1E` | `#F2B544` | destaque (fundo, nunca texto pequeno no claro) |
| `--color-mission` | `#C8102E` | `#FF6B7F` | rótulo da visão |
| `--color-idea` | `#8A5A0B` | `#F2C062` | rótulo da visão |
| `--color-inside` | `#1F6FB2` | `#7DB8EE` | rótulo da visão |
| `--color-code` | `#17705A` | `#5CCFA9` | rótulo da visão |
| `--color-pitfall` | `#B0102A` | `#FF8A7A` | rótulo da visão |
| `--color-challenge` | `#6B4FD8` | `#B3A1FF` | rótulo da visão |

  - Também vão no `@theme`: `--font-sans: "Nunito Sans Variable", system-ui, sans-serif;`, `--font-mono: "JetBrains Mono Variable", ui-monospace, monospace;` e `--radius-card: 18px;`.
  - Os valores escuros ficam num único bloco `@layer base { [data-theme="dark"] { … } }`.
  - O modo escuro do Tailwind é `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`.
  - Quem decide os valores é o `check-contrast.mjs` (Step 3). Se um par falhar, ajuste só a luminosidade e mantenha o matiz.

- [ ] **Step 2: Escrever os testes do verificador de contraste** (`scripts/check-contrast.test.mjs`, com `node:test`)

```js
test('contrast ratio of black on white is 21', () => assert.equal(round(contrast('#000000', '#FFFFFF')), 21));
test('reads light tokens from @theme and dark tokens from [data-theme="dark"]', () => {
  const { light, dark } = readTokens(CSS_FIXTURE);
  assert.equal(light['--color-surface'], '#FBF8F1');
  assert.equal(dark['--color-surface'], '#0F1C2B');
});
test('dark falls back to light when a token is not overridden', ...);
test('reports a failing pair with both colors and the ratio', () => {
  const problems = checkPairs({ '--color-ink': '#AAAAAA', '--color-surface': '#FFFFFF' }, [['--color-ink', '--color-surface']]);
  assert.match(problems[0], /--color-ink.*--color-surface.*2\.\d/);
});
```

- [ ] **Step 3: Implementar o `scripts/check-contrast.mjs`**
  - Exporta `contrast(a: string, b: string): number` (fórmula WCAG 2.x), `readTokens(css: string): { light: Record<string,string>, dark: Record<string,string> }` e `checkPairs(tokens, pairs): string[]`.
  - Quando executado direto, lê `site/src/styles.css` e confere em cada modo, com mínimo de 4,5:
    - `ink`, `ink-muted` e `link` sobre `surface` e `surface-raised`;
    - `on-primary` sobre `primary` e sobre `primary-soft`;
    - `primary` sobre `highlight`;
    - as seis cores de visão sobre `surface`.
  - Sai com código 1 e a lista de problemas se algum par falhar.
  - Rode `node --test scripts/check-contrast.test.mjs` e depois `node scripts/check-contrast.mjs`. Espere PASS e saída 0.

- [ ] **Step 4: Escrever os testes de `safeStorage` e `ThemeService`**

```ts
it('safeStorage.read returns null when localStorage throws', ...)        // vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error(); })
it('safeStorage.write returns false when setItem throws', ...)
it('ThemeService starts with preference "system" when nothing is stored', ...)
it('effective follows matchMedia when preference is system', ...)        // window.matchMedia mockado
it('toggle() from effective light stores "dark" under vmea:theme and sets data-theme="dark"', ...)
it('ThemeService does not touch document or storage on the server platform', ...) // provide PLATFORM_ID 'server'
```

- [ ] **Step 5: Implementar o `ThemeService` e o script em linha**
  - O `<head>` do `index.html` ganha um `<script>` que, antes do Angular, lê `vmea:theme` dentro de um try/catch e escreve `data-theme` no `<html>`:
    - `light` ou `dark` gravado: usa o gravado;
    - qualquer outro caso, inclusive erro de armazenamento: usa `matchMedia('(prefers-color-scheme: dark)')`.
  - O serviço lê o atributo inicial, escuta o `matchMedia` enquanto a preferência for `system` e grava com `safeStorage`.
  - O `<vm-theme-toggle>` é um `<button>` com `aria-label="Trocar para o modo escuro"` (ou "claro") e um ícone sol ou lua.
  - Rode `npm test -w site -- --watch=false` e espere PASS.

- [ ] **Step 6: Commit** `feat: design tokens com modo claro e escuro`

---

### Task 3: O catálogo de trilhas e capítulos

**Files:**
- Create: `site/src/app/catalog/catalog.ts`
- Test: `site/src/app/catalog/catalog.spec.ts`

**Interfaces:**
- Produces:

```ts
export type TrackId = 'embarque' | 'fundamentos' | 'componentes' | 'navegacao' | 'dados' | 'formularios' | 'back-end' | 'qualidade' | 'producao';
export interface Track { id: TrackId; name: string; emoji: string; summary: string; }
export interface Chapter {
  number: number; slug: string; track: TrackId;
  question: string;            // a pergunta do spec; trechos de código entre crases
  shortTitle: string;          // até 28 caracteres, para menus e carimbos
  description: string;         // 120 a 160 caracteres, vira a meta description
  minutes: number; prerequisites: number[];
  verifiedWithAngular: string | null;   // ex.: '22.0' quando publicado
  published: boolean;
}
export const TRACKS: readonly Track[];
export const CHAPTERS: readonly Chapter[];
export const EXTRA_TOPICS: readonly string[];   // "Para ir além", sem carimbo
export function chapterBySlug(slug: string): Chapter | undefined;
export function chaptersOfTrack(id: TrackId): Chapter[];
export function neighbors(slug: string): { previous?: Chapter; next?: Chapter };
```

- [ ] **Step 1: Escrever os testes de integridade**

```ts
it('has 50 chapters numbered 1..50 in order', () => expect(CHAPTERS.map(c => c.number)).toEqual(range(1, 50)));
it('every slug is NN-kebab and starts with its zero-padded number', () =>
  CHAPTERS.forEach(c => expect(c.slug).toMatch(new RegExp(`^${pad2(c.number)}-[a-z0-9]+(-[a-z0-9]+)*$`))));
it('slugs are unique', ...);
it('tracks cover the spec ranges', () => {
  expect(chaptersOfTrack('embarque').map(c => c.number)).toEqual(range(1, 5));
  // fundamentos 6–14, componentes 15–22, navegacao 23–27, dados 28–33,
  // formularios 34–36, back-end 37–41, qualidade 42–44, producao 45–50
});
it('prerequisites only point to earlier chapters', ...);
it('descriptions are 120–160 chars and shortTitle ≤ 28', ...);
it('a published chapter has verifiedWithAngular set', ...);
it('neighbors of chapter 1 has no previous and next is chapter 2', ...);
it('no text in the catalog contains a forbidden word', () => /* vídeo|disciplina|aula|turma|ficha|checklist */ ...);
```

- [ ] **Step 2: Rodar e ver falhar** com `npm test -w site -- --watch=false`. Espere FAIL: o catálogo ainda não existe.

- [ ] **Step 3: Preencher o catálogo**
  - **Trilhas:** os nomes da tabela do spec, com os emojis `✈️ 🧱 🧩 🧭 📡 📝 🗄️ 🔎 🚀`. `EXTRA_TOPICS` traz os três temas de "Para ir além".
  - **Perguntas:** cópia exata da seção 5 do spec.
  - **Slugs fixos** (não mudam depois de publicados):

```
01-o-que-e-o-angular  02-preparando-o-ambiente  03-javascript-moderno  04-typescript-para-angular  05-angular-cli
06-componentes  07-interpolacao-e-property-binding  08-event-binding  09-signals  10-if-e-switch  11-for-e-track
12-pipes  13-estilos-e-tailwind  14-design-tokens  15-input-e-output  16-model  17-ng-content  18-view-child
19-ciclo-de-vida  20-layout-responsivo  21-do-prototipo-ao-componente  22-bibliotecas-de-componentes  23-router
24-parametros-de-rota  25-rotas-filhas  26-lazy-loading  27-organizacao-por-funcionalidades  28-services-e-inject
29-http-client  30-rxjs  31-to-signal  32-resource-e-http-resource  33-effect  34-reactive-forms  35-validacao
36-signal-forms  37-login-com-supabase  38-guards  39-interceptors  40-crud-com-supabase  41-resolvers
42-testes-com-vitest  43-erros-e-devtools  44-acessibilidade  45-defer  46-seo  47-pwa  48-deploy-no-render
49-github-actions  50-pwabuilder
```

  - **`description`:** escrita no tom da seção 3 do spec.
  - **`minutes` e `prerequisites`:** estimativa de quem implementa; o padrão de `prerequisites` é `[number - 1]`.
  - **Publicação:** todos começam com `published: false`. O capítulo 1 só muda na Task 15.

- [ ] **Step 4: Rodar e ver passar** com `npm test -w site -- --watch=false`. Espere PASS.

- [ ] **Step 5: Commit** `feat: catálogo das 9 trilhas e 50 capítulos`

---

### Task 4: Rotas, moldura do site e páginas "em breve" e 404

**Files:**
- Create: `site/src/app/chapters/types.ts`, `loaders.ts`, `content.ts`, `coming-soon.ts`, `site/src/app/layout/top-bar.ts`, `footer.ts`, `site/src/app/pages/not-found.ts`, `about.ts`, `track.ts` (versão mínima), `home.ts` (versão mínima), `site/src/app/shared/inline-code.ts`
- Modify: `app.ts`, `app.html`, `app.routes.ts`, `app.routes.server.ts`, `app.config.ts`
- Test: `app.routes.spec.ts`, `shared/inline-code.spec.ts`, `layout/footer.spec.ts`

**Interfaces:**
- Consumes: `CHAPTERS`, `TRACKS` e `chapterBySlug` (Task 3).
- Produces:
  - `LOADERS: Partial<Record<string, () => Promise<Type<unknown>>>>`, por slug;
  - `CONTENT: Partial<Record<string, ChapterContent>>`, por slug;
  - os tipos de `types.ts`, que as Tasks 8, 9 e 12 usam (`SnippetId` vem do stub gerado na Task 1):

```ts
export interface Alternative { text: string; correct?: true; explanation: string; }
export interface Question { prompt: string; snippet?: SnippetId; alternatives: Alternative[]; }
export interface ChapterContent { summary: string[]; essentials: SnippetId[]; questions: Question[]; links: { label: string; url: string }[]; }
```

  - `inlineCode(text: string): { code: boolean; text: string }[]` divide o texto nas crases, e `plainText(text: string): string` remove as crases;
  - `route.data`: `{ kind: 'chapter' | 'coming-soon' | 'page' | 'not-found', slug?: string, description: string }`.

- [ ] **Step 1: Escrever os testes**

```ts
it('creates one route per chapter at capitulos/<slug>', () =>
  expect(routes.filter(r => r.path?.startsWith('capitulos/')).length).toBe(50));
it('chapter route title is the plain question', () =>
  expect(find('capitulos/09-signals').title).toBe('Como guardar estado que atualiza a tela com signal() e computed()?'));
it('unpublished chapter routes load ComingSoon and have kind coming-soon', ...);
it('has routes "", passaporte, trilhas/:trilha, glossario, busca, sobre, 404 and ** in that order, ** last', ...);
it('inlineCode splits on backticks', () =>
  expect(inlineCode('com `signal()` e')).toEqual([{code:false,text:'com '},{code:true,text:'signal()'},{code:false,text:' e'}]));
it('footer shows the exact credit line and both licenses', ...);
```

- [ ] **Step 2: Rodar e ver falhar.** Espere FAIL.

- [ ] **Step 3: Rotas** (`app.routes.ts`)
  - As rotas de capítulo são geradas a partir de `CHAPTERS`: `loadComponent: LOADERS[slug] ?? (() => import('./chapters/coming-soon'))`, `title: plainText(question)` e `data` com `kind`, `slug` e `description`.
  - `trilhas/:trilha` recebe o parâmetro com `withComponentInputBinding()`.
  - `404` e `**` usam `NotFound`.
  - Habilite `withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })`.

- [ ] **Step 4: Rotas do servidor** (`app.routes.server.ts`)
  - `trilhas/:trilha` com `RenderMode.Prerender` e `getPrerenderParams: async () => TRACKS.map(t => ({ trilha: t.id }))`.
  - `**` com `RenderMode.Prerender`.
  - Se o build reclamar de pré-renderizar o curinga do router, liste as rotas estáticas explicitamente com `RenderMode.Prerender` e deixe `**` com `RenderMode.Client`.

- [ ] **Step 5: A moldura**
  - **`app.html`:** link "Pular para o conteúdo", `<vm-top-bar>`, `<main id="conteudo">` com o `<router-outlet>` e `<vm-footer>`.
  - **Topo** (segue o esboço):
    - a marca à esquerda (link para o início);
    - os chips das trilhas, numa lista de links dentro de `<nav aria-label="Trilhas">`, com rolagem horizontal no celular e a trilha atual destacada com `highlight`;
    - à direita, o contador de carimbos (ligado na Task 6), o link da busca e o `<vm-theme-toggle>`.
  - **Rodapé:** o crédito exato das Global Constraints, as licenças e os links para Sobre e para o repositório.
  - **`ComingSoon`:**
    - lê `slug` de `route.data`;
    - mostra o cabeçalho com trilha, número e pergunta, a frase "Este capítulo ainda está sendo escrito." e a descrição;
    - tem links para o capítulo anterior, o próximo e a trilha;
    - o elemento raiz leva `data-coming-soon`.
  - **`NotFound`:** "Este destino não está no mapa", com links para o início, as trilhas e a busca.
  - **`About`:** autor, curso, instituição, licenças, como citar, privacidade (sem rastreamento) e o link do código.
  - **`Home` e `Track`:** só um título por enquanto. A Task 12 completa as duas.

- [ ] **Step 6: Rodar os testes e conferir o build**
  - `npm test -w site -- --watch=false` deve dar PASS.
  - `npm run build` deve gerar `capitulos/01-o-que-e-o-angular/index.html` … `capitulos/50-pwabuilder/index.html`, `trilhas/embarque/index.html` … `trilhas/producao/index.html` e `404/index.html`.

- [ ] **Step 7: Commit** `feat: rotas pré-geradas, moldura do site e páginas em breve e 404`

---

### Task 5: SEO

**Files:**
- Create: `site/src/app/seo/site.ts`, `seo.ts`, `book-title-strategy.ts`, `site/og.svg`, `site/public/og.png`, `site/public/favicon.svg`, `scripts/make-og-image.mjs`
- Modify: `app.config.ts`, `index.html` (`lang="pt-BR"`)
- Test: `seo/seo.spec.ts`, `seo/book-title-strategy.spec.ts`

**Interfaces:**
- Consumes: `route.data` (Task 4).
- Produces:
  - `SITE_URL = 'https://utfpr-gp.github.io/volta-ao-mundo-em-angular'` e `SITE_NAME = 'Volta ao Mundo em Angular'`;
  - `canonicalUrl(path: string): string`: `''` vira `${SITE_URL}/`, e `capitulos/x` vira `${SITE_URL}/capitulos/x/`;
  - `SeoService.apply(page: { title: string; description: string; path: string; noindex: boolean; jsonLd: object }): void`;
  - `BookTitleStrategy`.

- [ ] **Step 1: Escrever os testes**

```ts
it('canonicalUrl adds the trailing slash and keeps the home at SITE_URL/', ...);
it('apply sets <title>, meta description, og:title/description/url/image/type/locale, twitter:card and link[rel=canonical]', ...);
it('apply replaces, never duplicates, the tags on a second call', ...);
it('noindex adds <meta name="robots" content="noindex"> and removes it on the next page', ...);
it('apply writes one <script type="application/ld+json" id="jsonld">', ...);
it('title strategy produces "<pergunta> · Volta ao Mundo em Angular" for chapters and "Volta ao Mundo em Angular" for the home', ...);
it('coming-soon and not-found pages get noindex', ...);
```

- [ ] **Step 2: Rodar e ver falhar.** Espere FAIL.

- [ ] **Step 3: Implementar**
  - O `SeoService` usa `Title`, `Meta` e `DOCUMENT`.
  - A `BookTitleStrategy` estende `TitleStrategy`, pega a rota mais funda e monta a página a partir de `title` e `data`.
  - JSON-LD:
    - no início, `Course`: `name`, `description`, `inLanguage: 'pt-BR'`, `author` (`Person` "Roni Fabio Banaszewski") e `provider` (`CollegeOrUniversity` "UTFPR Guarapuava");
    - nos capítulos, `LearningResource` com `isPartOf` apontando para o curso, `educationalLevel: 'graduação'` e `inLanguage`;
    - nas demais páginas, `WebPage`.
  - `og:image`: `${SITE_URL}/og.png`.

- [ ] **Step 4: A imagem de compartilhamento**
  - `site/og.svg` (1200×630): fundo `primary`, título do livro, a frase "Angular moderno, do zero ao deploy", um carimbo e o crédito.
  - `scripts/make-og-image.mjs` converte com `sharp` (devDependency) para `site/public/og.png`. Rode uma vez e faça commit do PNG.
  - O `favicon.svg` é o carimbo.

- [ ] **Step 5: Rodar os testes e conferir o HTML**
  - `npm test -w site -- --watch=false` deve dar PASS.
  - Depois de `npm run build`, rode `grep -c 'rel="canonical"' site/dist/site/browser/capitulos/09-signals/index.html`. Espere 1.

- [ ] **Step 6: Commit** `feat: SEO com títulos, Open Graph, canônica e JSON-LD`

---

### Task 6: Progresso, carimbos e a página "Meu passaporte"

**Files:**
- Create: `site/src/app/progress/progress.ts`, `site/src/app/shared/stamp.ts`, `site/src/app/pages/passport.ts`
- Modify: `layout/top-bar.ts` (contador)
- Test: `progress/progress.spec.ts`, `shared/stamp.spec.ts`, `pages/passport.spec.ts`

**Interfaces:**
- Consumes:
  - `safeStorage` (Task 2);
  - `CHAPTERS`, `TRACKS` e `chaptersOfTrack` (Task 3).
- Produces:

```ts
export interface ProgressData { version: 1; stamps: Record<string, string>; }   // slug → data ISO do 1º acerto
export function parseProgress(text: string): ProgressData | null;
@Injectable({ providedIn: 'root' }) export class ProgressService {
  readonly stamps: Signal<Record<string, string>>;
  readonly count: Signal<number>;              // só slugs que existem em CHAPTERS
  hasStamp(slug: string): boolean;
  stamp(slug: string): void;                   // mantém a primeira data
  exportJson(): string;
  importJson(text: string): { ok: true; added: number } | { ok: false; error: string };   // une, nunca apaga
}
```

  - A chave de armazenamento é `vmea:progress`.
  - `<vm-stamp [chapter]="c" [date]="iso | null" size="sm|lg">`:
    - um círculo tracejado com o número e o `shortTitle`;
    - conquistado: vermelho `stamp`, girado -8°, com a data em `dd/MM/yyyy`;
    - a animação de "bater o carimbo" só com `motion-safe:`.

- [ ] **Step 1: Escrever os testes**

```ts
it('parseProgress rejects invalid JSON, wrong version, stamps not an object, non-ISO dates', ...);
it('starts empty when storage throws or holds garbage', ...);                        // Review Focus 1
it('does not read storage before afterNextRender and never on the server', ...);    // Review Focus 2
it('stamp() keeps the first date when called twice', ...);                          // Review Focus 5
it('count ignores slugs that are not in the catalog', ...);
it('importJson merges, keeps earliest dates, reports added, and leaves progress unchanged on error', ...);
it('exportJson round-trips through importJson', ...);
it('passport page lists the 9 tracks with stamped / empty / coming-soon slots and the % of the world', ...);
it('passport import of an invalid file shows "Este arquivo não é um passaporte válido."', ...);
```

- [ ] **Step 2: Rodar e ver falhar.** Espere FAIL.

- [ ] **Step 3: Implementar**
  - **Serviço:** guarda o estado num `signal`, carrega em `afterNextRender` só no navegador e grava em cada mudança com `safeStorage`.
  - **Página "Meu passaporte"** (`/passaporte`):
    - o mapa das trilhas, com os carimbos de cada uma;
    - o progresso "X de 50 carimbos" e a porcentagem;
    - um texto curto explicando como ganhar carimbos.
  - **Exportar e importar:**
    - "Exportar" baixa `meu-passaporte-angular.json` (Blob e link temporário);
    - "Importar" usa `<input type="file" accept="application/json">`;
    - o resultado é anunciado em `aria-live`.
  - **Topo:** mostra `count()` no lugar do placeholder da Task 4.

- [ ] **Step 4: Rodar e ver passar.** Espere PASS.

- [ ] **Step 5: Commit** `feat: passaporte de carimbos salvo no navegador, com exportar e importar`

---

### Task 7: Trechos de código destacados no build

**Files:**
- Create: `scripts/extract-snippets.mjs` (versão real), `site/src/app/views/code.ts`
- Test: `scripts/extract-snippets.test.mjs`, `site/src/app/views/code.spec.ts`

**Interfaces:**
- Consumes: os arquivos `site/snippets/NN-slug/<nome>.<ext>`.
- Produces:
  - o arquivo gerado `site/src/generated/snippets.ts`:
    - `export type SnippetId = '01/counter-angular' | …;`
    - `export const SNIPPETS: Record<SnippetId, { lang: string; html: string; source: string }>;`
    - a chave é `NN/<nome sem extensão>`;
  - `<vm-code [snippet]="id" caption="contador.ts" />`.

- [ ] **Step 1: Escrever os testes do script**

```js
test('maps extensions to Shiki languages', () => assert.deepEqual(
  ['ts','html','js','jsx','vue','svelte','css','json','sh'].map(langFor),
  ['angular-ts','angular-html','javascript','jsx','vue','svelte','css','json','bash']));
test('key is NN/name from the folder number and file name', () => assert.equal(keyFor('site/snippets/01-o-que-e-o-angular/counter-angular.ts'), '01/counter-angular'));
test('// [!code highlight] marks the line and disappears from html and source', async () => { /* html has class "highlighted"; source has no "[!code" */ });
test('<!-- [!code highlight] --> works in html files', ...);
test('html carries both themes as --shiki-light / --shiki-dark variables', ...);
test('generated module text declares SnippetId as a union of all keys, or never when empty', ...);
```

- [ ] **Step 2: Rodar e ver falhar** com `node --test scripts/extract-snippets.test.mjs`. Espere FAIL.

- [ ] **Step 3: Implementar o script**
  - Usa `codeToHtml` do `shiki` com `themes: { light: 'github-light', dark: 'github-dark' }`, `defaultColor: false` e `transformers: [transformerNotationHighlight()]`, de `@shikijs/transformers`.
  - `source` é o arquivo sem as marcas `[!code …]`.
  - Grava o módulo TypeScript.

- [ ] **Step 4: Escrever os testes do componente**

```ts
it('renders the pre-highlighted html inside <pre> without the sanitizer stripping style attributes', ...);
it('copy button writes the plain source to the clipboard and announces "Código copiado"', ...);
```

- [ ] **Step 5: Implementar o `<vm-code>`**
  - Usa `DomSanitizer.bypassSecurityTrustHtml`. O HTML é gerado pelo próprio build e nunca vem de quem lê, e o comentário no código diz isso.
  - Em `styles.css`, escolha `--shiki-light` ou `--shiki-dark` conforme o `data-theme`, e destaque `.highlighted` com `highlight` a 15% de opacidade.
  - Mostre o nome do arquivo (`caption`) no alto.

- [ ] **Step 6: Rodar os testes.** Rode `node --test scripts/` e `npm test -w site -- --watch=false`. Espere PASS nos dois.

- [ ] **Step 7: Commit** `feat: trechos de código destacados no build com Shiki`

---

### Task 8: As visões do capítulo e a página de capítulo

**Files:**
- Create: em `site/src/app/views/`, os arquivos `chapter-page.ts`, `chapter-header.ts`, `view.ts`, `analogy.ts`, `steps.ts`, `pitfall.ts`, `deep-dive.ts`, `further-links.ts` e `see-chapter.ts`
- Test: em `site/src/app/views/`, os specs `chapter-page.spec.ts`, `view.spec.ts`, `steps.spec.ts`, `deep-dive.spec.ts` e `see-chapter.spec.ts`

**Interfaces:**
- Consumes:
  - `chapterBySlug`, `neighbors` e `chaptersOfTrack` (Task 3);
  - `CONTENT` (Task 4);
  - `ProgressService` e `<vm-stamp>` (Task 6);
  - `<vm-code>` (Task 7);
  - `inlineCode` (Task 4).
- Produces: estes componentes, que todo capítulo usa.

| Componente | Entradas | O que desenha |
|---|---|---|
| `<vm-chapter-page slug>` | `slug: string` | cabeçalho, sumário à esquerda, `<article data-pagefind-body [attr.data-chapter]="slug" class="prose">` com o conteúdo projetado, lateral com o "Resumo de 1 minuto" (`CONTENT[slug].summary`) e os carimbos da trilha, e no fim os links anterior e próximo |
| `<vm-chapter-header [chapter]>` | `Chapter` | trilha, número, tempo, pré-requisitos (links), a pergunta com `<code>` e o espaço do carimbo |
| `<vm-view kind title>` | `kind: 'mission' \| 'idea' \| 'inside' \| 'code' \| 'pitfalls' \| 'challenge' \| 'further'`, `title: string` | `<section [id]>` com o id das Global Constraints, ícone `🎯 💡 🔬 🛠️ ⚠️ 🏁 📚`, o rótulo ("A missão", "A ideia", "Por dentro", "Mão no código", "Armadilhas", "Desafio", "Para ir além") na cor do token da visão, `<h2>` e um link `#` para copiar o endereço da seção |
| `<vm-analogy emoji>` | `emoji: string` | o cartão da analogia do esboço |
| `<vm-steps>` com `<ng-template vmStep title="…">` | `title` por passo | abas do Angular Aria (`Tabs`, `TabList`, `Tab`, `TabPanel`, `TabContent`, `[preserveContent]="true"`, `selectionMode="explicit"`), com uma aba por passo, desenhadas a partir de `contentChildren(StepDirective)` |
| `<vm-pitfall message>` | `message: string` (a mensagem exata) | a mensagem em bloco monoespaçado e a explicação projetada |
| `<vm-deep-dive title>` | `title: string` | `<details class="…"><summary>Aprofundando: {{title}}</summary>…</details>` |
| `<vm-further-links [links]>` | `{label,url}[]` | a lista de links externos, com `rel="noopener"` |
| `<vm-see-chapter [number]>` | `number` | "você viu isso no capítulo N: <pergunta>", com o link |

- [ ] **Step 1: Escrever os testes**

```ts
it('chapter page renders the 7 view sections in the fixed order when a chapter projects them', ...);
it('toc lists the 7 views and links to #missao … #para-ir-alem', ...);
it('view kind "pitfalls" renders id "armadilhas" and label "Armadilhas"', ...);
it('steps renders one tab per vmStep and arrow keys move between tabs', ...);
it('deep-dive content is present in the DOM while closed (prerender/search need it)', ...);
it('see-chapter links to capitulos/<slug> with the plain question', ...);
it('previous/next skip nothing and show "em breve" on unpublished neighbors', ...);
```

- [ ] **Step 2: Rodar e ver falhar.** Espere FAIL.

- [ ] **Step 3: Implementar os componentes**
  - O layout segue o esboço: grade `240px / minmax(0,780px) / 260px` a partir de 1100px.
  - Abaixo de 1100px, uma coluna só. O sumário e a lateral viram `<details>` no alto.
  - Use só tokens. As bolhas dos ícones usam `color-mix(in srgb, var(--color-<visão>) 14%, transparent)`.

- [ ] **Step 4: Rodar e ver passar.** Espere PASS.

- [ ] **Step 5: Commit** `feat: componentes das visões e página de capítulo`

---

### Task 9: O desafio e o carimbo

**Files:**
- Create: `site/src/app/views/grade.ts`, `site/src/app/views/challenge.ts`
- Test: `views/grade.spec.ts`, `views/challenge.spec.ts`, `chapters/content.spec.ts`

**Interfaces:**
- Consumes:
  - `ProgressService.stamp` e `hasStamp` (Task 6);
  - `<vm-code>` (Task 7);
  - `Question`, `Alternative` e `inlineCode` (Task 4).
- Produces:

```ts
export interface Grading { allCorrect: boolean; items: { correct: boolean; feedback: string }[]; }
export function grade(questions: Question[], answers: (number | null)[]): Grading;
// <vm-challenge [slug] [questions] />
```

- [ ] **Step 1: Escrever os testes**

```ts
it('all correct → allCorrect true and each feedback is the chosen alternative explanation', ...);
it('a wrong answer → correct false and feedback is the wrong alternative explanation', ...);
it('null answer → correct false and feedback "Escolha uma alternativa."', ...);          // Review Focus 5
it('challenge stamps the chapter only when allCorrect, once, and shows the stamp with an aria-live announcement', ...);
it('alternatives are an Angular Aria listbox, single selection, operable with arrows + space', ...);
it('a stamped chapter shows "Carimbo conquistado em dd/MM/yyyy" and still allows retrying', ...);
// chapters/content.spec.ts — vale para todo capítulo publicado (critério de pronto 1 e 4 do spec):
it('every published chapter has a LOADERS entry and a CONTENT entry, and vice versa', ...);
it('each published chapter has 3–5 questions, exactly one correct alternative each, and a non-empty explanation on every alternative', ...);
it('summary has 3–6 items and links has at least one angular.dev URL', ...);
```

- [ ] **Step 2: Rodar e ver falhar.** Espere FAIL.

- [ ] **Step 3: Implementar**
  - `grade` é uma função pura.
  - `<vm-challenge>`:
    - guarda as respostas num `signal<(number | null)[]>`;
    - cada pergunta é um `ngListbox` de seleção única, com `ngOption` em cada alternativa;
    - o botão "Conferir respostas" chama `grade`;
    - mostra o retorno ao lado de cada pergunta;
    - se tudo estiver certo, chama `progress.stamp(slug)` e mostra o `<vm-stamp size="lg">` conquistado.
  - O desafio fica fora do `data-pagefind-body`, para que as respostas não apareçam na busca: use `data-pagefind-ignore`.

- [ ] **Step 4: Rodar e ver passar.** Espere PASS.

- [ ] **Step 5: Commit** `feat: desafio com correção imediata e carimbo`

---

### Task 10: Glossário

**Files:**
- Create: `site/src/app/glossary/glossary.ts`, `site/src/app/glossary/term.ts`, `site/src/app/pages/glossary-page.ts`
- Test: `glossary/glossary.spec.ts`, `glossary/term.spec.ts`

**Interfaces:**
- Produces:

```ts
export const GLOSSARY = { spa: { term: 'SPA', definition: '…', chapter: 1 }, … } as const satisfies Record<string, GlossaryEntry>;
export type TermId = keyof typeof GLOSSARY;
// <vm-term id="spa">aplicação de página única</vm-term>  → id inexistente quebra o build (strictTemplates)
```

- [ ] **Step 1: Escrever os testes**

```ts
it('every entry has a definition of at most 220 chars and a chapter between 1 and 50', ...);
it('term renders a link to /glossario#<id> with the definition as accessible description', ...);
it('glossary page lists terms in pt-BR alphabetical order with an anchor per term and a link to the chapter', ...);
```

- [ ] **Step 2: Rodar e ver falhar.** Espere FAIL.

- [ ] **Step 3: Implementar**
  - Comece com os termos do capítulo 1: SPA, framework, biblioteca, componente, TypeScript, AngularJS, JSON, código aberto, opinativo.
  - O `<vm-term>` mostra a definição num popover nativo (`popover`/`popovertarget`), que abre por clique ou por teclado. O link "ver no glossário" fica dentro do popover.
  - A página `/glossario` usa `data-pagefind-body`.

- [ ] **Step 4: Rodar e ver passar.** Espere PASS.

- [ ] **Step 5: Commit** `feat: glossário com termos ligados aos capítulos`

---

### Task 11: Busca

**Files:**
- Create: `site/src/app/search/search.ts`, `site/src/app/pages/search-page.ts`
- Modify: `layout/top-bar.ts` (campo que leva a `/busca?q=`)
- Test: `search/search.spec.ts`, `pages/search-page.spec.ts`

**Interfaces:**
- Produces:

```ts
export interface SearchHit { path: string; title: string; excerpt: string; }   // path sem baseHref, pronto para routerLink
export const PAGEFIND_LOADER = new InjectionToken<() => Promise<PagefindApi>>('PAGEFIND_LOADER');
@Injectable({ providedIn: 'root' }) export class SearchService {
  readonly available: Signal<boolean | null>;     // null enquanto carrega
  search(query: string): Promise<SearchHit[]>;
}
```

- [ ] **Step 1: Escrever os testes** (com o carregador mockado pelo token)

```ts
it('loader failure → available false and the page says "A busca funciona no site publicado."', ...);   // Review Focus 4
it('maps Pagefind results to SearchHit with path relative to the base href', ...);
it('empty result → "Nada encontrado para “x”. Tente outra palavra ou veja o glossário."', ...);
it('?q=signals on load fills the field and runs the search', ...);
it('typing updates ?q= without adding history entries', ...);
```

- [ ] **Step 2: Rodar e ver falhar.** Espere FAIL.

- [ ] **Step 3: Implementar**
  - O carregador padrão faz `import(/* @vite-ignore */ new URL('pagefind/pagefind.js', document.baseURI).href)`, só no navegador.
  - O resultado vem de `pagefind.search(q)` e de `data()` dos 10 primeiros.
  - O trecho (`excerpt`) vem do Pagefind com `<mark>`. Ele é gerado no build a partir do próprio conteúdo, por isso pode entrar com `innerHTML` sanitizado; o sanitizador padrão mantém `<mark>`.

- [ ] **Step 4: Rodar e ver passar.** Espere PASS.

- [ ] **Step 5: Commit** `feat: busca no navegador com Pagefind`

---

### Task 12: Página inicial e páginas de trilha

**Files:**
- Modify: `site/src/app/pages/home.ts`, `site/src/app/pages/track.ts`
- Test: `pages/home.spec.ts`, `pages/track.spec.ts`

**Interfaces:**
- Consumes:
  - `TRACKS`, `chaptersOfTrack` e `EXTRA_TOPICS` (Task 3);
  - `CONTENT` (Tasks 4 e 9);
  - `ProgressService` e `<vm-stamp>` (Task 6);
  - `<vm-code>` (Task 7).

- [ ] **Step 1: Escrever os testes**

```ts
it('home has the book title as h1, a "Começar a viagem" link to capitulos/01-o-que-e-o-angular and 9 track cards', ...);
it('home explains the 7 views with their icons and shows the "Para ir além" topics', ...);
it('track page for an unknown id shows NotFound content', ...);
it('track page lists its chapters with stamp state, and its quick reference joins summary + essentials of published chapters only', ...);
it('track page says "A referência rápida desta trilha cresce a cada capítulo publicado." when none is published', ...);
```

- [ ] **Step 2: Rodar e ver falhar.** Espere FAIL.

- [ ] **Step 3: Implementar**
  - **Início:**
    - capa com o título, a promessa ("Angular moderno, do zero ao deploy, construindo um app de verdade") e o botão "Começar a viagem";
    - "Como funciona cada capítulo", com as 7 visões;
    - "O Passaporte", o app que cresce a cada capítulo, com a lista do spec, seção 6;
    - o mapa das 9 trilhas, com o progresso de cada uma;
    - "Para ir além";
    - o crédito.
  - **Trilha:** cabeçalho com emoji, nome e resumo; a lista dos capítulos; e a "Referência rápida", com o resumo e os trechos essenciais de cada capítulo publicado. A referência fica dentro de `data-pagefind-body`.
  - O texto segue o tom do spec, seção 3.

- [ ] **Step 4: Rodar e ver passar.** Espere PASS.

- [ ] **Step 5: Commit** `feat: página inicial e páginas de trilha com referência rápida`

---

### Task 13: Pós-build e verificações da saída

**Files:**
- Create: `scripts/post-build.mjs` (versão real), `scripts/check-output.mjs`, `scripts/check-links.mjs`
- Test: `scripts/post-build.test.mjs`, `scripts/check-output.test.mjs`

**Interfaces:**
- Consumes: `site/dist/site/browser/`.
- Produces:
  - em `browser/`: `404.html`, `sitemap.xml`, `robots.txt` e `pagefind/`;
  - `checkPage(html: string, path: string): string[]`, que devolve a lista de problemas.

- [ ] **Step 1: Escrever os testes**

```js
test('canonicalUrl matches the site version (trailing slash, home = SITE_URL/)', ...);
test('sitemap lists every index.html except 404 and pages with data-coming-soon, as canonical URLs', ...);
test('robots.txt allows all and points to the sitemap URL', ...);
test('404.html is a copy of 404/index.html', ...);
test('checkPage flags a missing <title>, meta description, canonical, og:image or lang="pt-BR"', ...);
test('checkPage flags a published chapter missing any of the 7 view ids', ...);
test('checkPage ignores the view rule on data-coming-soon pages', ...);
test('checkPage flags forbidden words in visible text (vídeo, disciplina, aula, turma, ficha, checklist)', ...);
```

- [ ] **Step 2: Rodar e ver falhar** com `node --test scripts/`. Espere FAIL.

- [ ] **Step 3: Implementar**
  - **`post-build.mjs`**, nesta ordem: copia o 404, gera o sitemap e o robots, e roda `npx pagefind --site site/dist/site/browser`. O Pagefind usa `lang="pt-BR"` para a raiz das palavras.
  - **`check-output.mjs`:** percorre todos os `index.html` e sai com 1 se houver algum problema.
  - **`check-links.mjs`:**
    - copia `browser/` para `tmp-links/volta-ao-mundo-em-angular/`;
    - roda o linkinator com `serverRoot: 'tmp-links'`, recursivo, a partir de `/volta-ao-mundo-em-angular/`;
    - por padrão ignora links externos; com `--externos`, confere também os externos;
    - sai com 1 se houver link quebrado.
  - Ponha `tmp-links/` no `.gitignore`.

- [ ] **Step 4: Conferir**
  - `node --test scripts/` deve dar PASS.
  - `npm run build && npm run check` deve sair com 0.
  - `site/dist/site/browser/pagefind/pagefind.js` deve existir.

- [ ] **Step 5: Commit** `feat: pós-build com 404, sitemap, robots e busca, e verificação da saída`

---

### Task 14: Publicação, automação e regras para o agente

**Files:**
- Create: `.github/workflows/publicar.yml`, `.github/workflows/links-externos.yml`, `.github/dependabot.yml`, `.github/pull_request_template.md`, `AGENTS.md`, `CLAUDE.md`, `scripts/build-stages.mjs`

**Interfaces:**
- Consumes: os scripts da raiz (Tasks 1 e 13).

- [ ] **Step 1: `publicar.yml`**
  - Roda em `push` na `main` e em `pull_request`.
  - **Job `verificar`:**
    - Node 24 com cache do npm;
    - `npm ci`, `npm test`, `npm run build`, `npm run check` e `node scripts/build-stages.mjs`.
    - O `build-stages.mjs` roda `npm run build -w <etapa>` para cada `passaporte/etapas/*` com `package.json`. Sem etapas, sai com 0 e imprime "nenhuma etapa ainda".
  - **Job `publicar`:**
    - só em push na `main` e depois do `verificar`;
    - `actions/upload-pages-artifact` com `site/dist/site/browser` e `actions/deploy-pages`;
    - permissões `pages: write` e `id-token: write`.

- [ ] **Step 2: Automação**
  - **`links-externos.yml`:** toda segunda-feira, roda o build e depois `node scripts/check-links.mjs --externos`.
  - **`dependabot.yml`:**
    - npm semanal na raiz, com o grupo `angular` (`@angular/*`, `@angular-devkit/*`, `@schematics/angular`) e o grupo `tailwind`;
    - `github-actions` mensal.
  - **`pull_request_template.md`:** o critério de pronto do spec (seção 5.2) como checklist de 7 itens, mais "Conferi as APIs no angular.dev da versão em uso".

- [ ] **Step 3: `AGENTS.md`**
  - **Regras de escrita:** o tom e a analogia obrigatória (spec, seção 3), a anatomia (seção 4) e as Global Constraints deste plano.
  - **Regras de conteúdo:** conferir toda API contra o angular.dev da versão em uso, via Context7 ou angular.dev; armadilhas com mensagens reproduzidas de verdade; o primeiro uso de cada termo com `<vm-term>`.
  - **Mapa do repositório.**
  - **Como criar um capítulo:**
    1. Ler a linha do capítulo no catálogo e os capítulos de que ele depende.
    2. Conferir as APIs no angular.dev.
    3. Criar `site/src/app/chapters/NN-slug/`, com `chapter.ts`/`chapter.html` usando `<vm-chapter-page>` e as 7 visões, `content.ts`, e o simulador num componente próprio com spec.
    4. Pôr os trechos em `site/snippets/NN-slug/`.
    5. Registrar em `LOADERS` e `CONTENT`.
    6. Acrescentar os termos novos ao glossário.
    7. Marcar `published: true` e `verifiedWithAngular`.
    8. Criar a etapa em `passaporte/etapas/NN-slug/` (a partir do capítulo 5).
    9. Rodar `npm test`, `npm run build` e `npm run check`.
    10. Abrir o PR com o template. Só o professor faz o merge.
  - `CLAUDE.md` contém só `@AGENTS.md`.

- [ ] **Step 4: Ligar o Pages e publicar**
  - Rode `gh api -X POST repos/utfpr-gp/volta-ao-mundo-em-angular/pages -f build_type=workflow`.
  - Faça push da branch `estrutura-inicial` e abra o PR "Estrutura do livro".
  - Espere o `verificar` ficar verde. O merge é do professor; avise e espere.
  - Depois do merge, acompanhe o deploy com `gh run watch`.

- [ ] **Step 5: Verificar no site publicado** (Review Focus 2 e 3)
  - Use `curl -sI` e o navegador.
  - `…/volta-ao-mundo-em-angular/capitulos/09-signals` e o mesmo endereço com `/` no fim mostram a página "em breve" do capítulo 9.
  - `…/volta-ao-mundo-em-angular/nao/existe` devolve 404 com a página do livro estilizada.
  - `…/sitemap.xml` e `…/og.png` respondem 200.
  - O modo escuro persiste ao recarregar e o console não mostra NG0500.
  - Se a barra final quebrar a rota, corrija no router e repita esta verificação.

---

### Task 15: Capítulo 1, "O que é o Angular, e por que escolhê-lo entre React, Vue e Svelte?"

Branch `capitulo-01`, criada a partir da `main` depois do merge da Task 14.

**Files:**
- Create: `site/src/app/chapters/01-o-que-e-o-angular/chapter.ts`, `chapter.html`, `content.ts`, `spa-simulator.ts`
- Create: `site/snippets/01-o-que-e-o-angular/` (`counter-vanilla.js`, `counter-angular.ts`, `counter-react.jsx`, `counter-vue.vue`, `counter-svelte.svelte`, `angularjs.html`, `angular-today.ts`)
- Modify: `chapters/loaders.ts`, `chapters/content.ts`, `catalog/catalog.ts` (`published: true`, `verifiedWithAngular`), `glossary/glossary.ts`
- Test: `chapters/01-o-que-e-o-angular/spa-simulator.spec.ts`

**Fonte:** o deck `angular/slides/01-o-que-e-o-angular.pptx` do repositório `utf-disciplinas`. Leia o texto e as notas de cada slide (com `markitdown` ou descompactando o pptx). O deck é ponto de partida, não transcrição. Duas adaptações são obrigatórias:
- o slide "Por que o Angular nesta disciplina" vira "Por que aprender Angular", sem citar disciplina;
- a linha do tempo (slide 17) é conferida no angular.dev, inclusive as versões 20 a 22.

**Interfaces:**
- Consumes: tudo das Tasks 3 a 10.
- Produces: `<vm-spa-simulator />`.

- [ ] **Step 1: Escrever os testes do simulador**

```ts
it('clicking "Caronas" on the traditional side marks header, content and footer as redrawn and adds an HTML request to the log', ...);
it('clicking "Caronas" on the SPA side marks only the content as redrawn and adds a JSON request to the log', ...);
it('shows the total bytes per side, and the traditional total grows faster', ...);
it('every click announces what happened in an aria-live region', ...);
it('with prefers-reduced-motion the redraw is shown by an outline, without the flash animation', ...);
it('all controls are buttons reachable by Tab and work with Enter/Space; "Recomeçar" resets both sides', ...);
```

- [ ] **Step 2: Rodar e ver falhar.** Espere FAIL.

- [ ] **Step 3: Implementar o `<vm-spa-simulator>`**
  - **O que mostra:**
    - dois mininavegadores lado a lado ("Site tradicional" e "Aplicação de página única"), cada um com cabeçalho, miolo e rodapé;
    - três links ("Caronas", "Perfil", "Ajuda");
    - um registro das requisições, com o tipo de resposta e o tamanho: HTML de 48 KB contra JSON de 2 KB.
  - **Como é feito:**
    - o estado é feito com signals;
    - a área redesenhada pisca só com `motion-safe:`;
    - no celular, os lados ficam empilhados.

- [ ] **Step 4: Escrever o capítulo** (`chapter.html` dentro de `<vm-chapter-page slug="01-o-que-e-o-angular">`)
  - **🎯 A missão:** o que a pessoa vai saber ao final, mais uma prévia do Passaporte completo, rotulada como "o que você vai construir ao longo do livro". Use uma ilustração em HTML e CSS, sem captura de tela de app inexistente.
  - **💡 A ideia:** duas analogias do deck, o restaurante (SPA) e a caixa de ferramentas contra a estrutura da casa (biblioteca contra framework).
  - **🔬 Por dentro:**
    - o `<vm-spa-simulator>`;
    - o problema de manter a tela em dia, com o trecho `counter-vanilla`;
    - biblioteca contra framework;
    - "Angular, em uma frase", com o que vem de fábrica;
    - a árvore de componentes;
    - a tabela comparativa com React, Vue e Svelte;
    - "Opinativo";
    - "Por que aprender Angular";
    - a linha do tempo;
    - um `<vm-deep-dive>` sobre o motor Ivy e a saída do Zone.js.
  - **🛠️ Mão no código:** `<vm-steps>` com o mesmo contador em Angular, React, Vue e Svelte, um passo por framework, com a linha que muda o estado destacada. Depois, o exercício guiado no `angular.dev/playground`: achar um texto, trocar e ver a tela mudar.
  - **⚠️ Armadilhas:**
    - AngularJS não é Angular, com os trechos `angularjs` e `angular-today`;
    - exemplos antigos com `NgModule` e `*ngFor`.
    - Cada armadilha traz uma mensagem real, reproduzida no playground da versão em uso. Por exemplo, colar um template com `*ngFor` sem importar nada e copiar o aviso ou erro exato que aparece.
  - **🏁 Desafio:** 4 perguntas a partir dos exercícios e respostas comentadas do deck (slides 19 e 20). São elas: classificar um trecho como AngularJS, Angular antigo ou Angular de hoje; biblioteca ou framework; o que a SPA pede ao servidor depois do primeiro acesso; o que o Angular traz de fábrica. Cada alternativa errada traz a sua explicação.
  - **📚 Para ir além:**
    - `angular.dev/overview`
    - `angular.dev/playground`
    - `angular.dev/reference/releases`
    - a página de versões e suporte
  - **Fechamento:** "Próxima parada: o capítulo 2".
  - Use o `<vm-term>` no primeiro uso de SPA, framework, biblioteca, componente, TypeScript, AngularJS e JSON.
  - `content.ts` traz o resumo (os 4 itens de "Para guardar" do deck), `essentials: ['01/counter-angular']`, as perguntas e os links.

- [ ] **Step 5: Registrar e publicar no catálogo**
  - Registre em `LOADERS` e em `CONTENT`.
  - No catálogo: `published: true`, `verifiedWithAngular: '<versão do package.json>'`.

- [ ] **Step 6: Conferir**
  - `npm test`, `npm run build` e `npm run check` devem passar.
  - Abra `npm start` e percorra o capítulo:
    - só com teclado;
    - no modo escuro;
    - em 375px de largura;
    - com "reduzir movimento" ligado no sistema.
  - Acerte o desafio e veja o carimbo no topo e em "Meu passaporte".

- [ ] **Step 7: Commit e PR**
  - Commit `feat: capítulo 1, o que é o Angular`.
  - Abra o PR "Capítulo 1: O que é o Angular" com o template preenchido. O merge, que publica o capítulo, é do professor.
