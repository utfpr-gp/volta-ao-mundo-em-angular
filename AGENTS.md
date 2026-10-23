# Regras para quem mantém o livro

Este arquivo vale para pessoas e para agentes de IA. O projeto completo do livro está em
[docs/projeto.md](docs/projeto.md); leia-o antes da primeira mudança.

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
- **Capítulo 29 (`HttpClient`):** uma caixa curta de "primeiro contato com Observable", ligada ao capítulo 30.
- **Capítulo 39 (interceptors):** deixar claro que interceptors só veem requisições do `HttpClient`; o cliente do
  Supabase usa `fetch` e põe o token sozinho.
- **Em todo capítulo:** no máximo duas ou três analogias; termo novo vai ao glossário; partes de curiosidade vão para
  `<vm-deep-dive>`; terminar com "E agora?" apontando a próxima parada.
