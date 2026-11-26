# Volta ao Mundo em React: a spec

> Proposta para discussão (2026-11-26). Nada aqui está decidido até o professor aprovar; as decisões em aberto estão no fim.
> As versões citadas foram conferidas no npm e nas documentações oficiais nesta data e precisam ser conferidas de novo
> quando cada capítulo for escrito, como manda o [AGENTS.md](../AGENTS.md).

## 1. A decisão: dois livros, uma plataforma

O site passa a ter **dois livros**: *Volta ao Mundo em Angular*, o de hoje, e *Volta ao Mundo em React*. Quem chega escolhe
um. Os dois:

- constroem o **mesmo Passaporte**, com as mesmas telas, a mesma API de países, o mesmo banco no Supabase e a mesma
  demonstração no Render;
- dividem um **tronco comum** de capítulos que não dependem do framework, escritos uma vez só;
- usam a mesma plataforma (catálogo, carimbos, glossário, busca, verificador, simuladores genéricos) e as mesmas regras de
  escrita.

**Por que não um livro só, com os dois frameworks lado a lado:** cada capítulo é uma narrativa em torno de uma API
(missão, analogia, simulador, passos, armadilhas). Com os dois em todo capítulo, o texto dobra, quem está aprendendo carrega
duas coisas novas ao mesmo tempo, as armadilhas não se correspondem (`NG8001` não tem par no React; a regra dos hooks não
tem par no Angular), e o carimbo deixa de dizer o que foi aprendido. Quem quiser comparar tem a página "Lado a lado"
(seção 6), fora do caminho principal.

## 2. A pilha do livro de React

| Peça | Escolha | Versão em 2026-11-26 | Por quê |
| --- | --- | --- | --- |
| Biblioteca | React | 19.3.1 (MIT) | A atual estável. |
| Projeto e rotas | React Router, **modo framework** (`npx create-react-router@latest`) | 8.5.3 (MIT) | O react.dev recomenda começar com um framework e lista o React Router. O modo framework tem rotas por arquivo de configuração, `loader`/`clientLoader`, divisão do código por rota e **pré-renderização estática** (`ssr: false` + `prerender`), o par dos capítulos 26, 41 e 46. Gera um site estático em `build/client`, como o livro de Angular: mesmo deploy, mesmo CI. |
| Compilação | Vite (por dentro do React Router) | 8.4.0 | O React Router em modo framework é um plugin do Vite. |
| Otimização | React Compiler | 1.0.0 | O react.dev o declara estável. Ele memoriza sozinho, e o livro pode ensinar `useMemo`/`useCallback` como detalhe de "Aprofundando", e não como obrigação. |
| Estilo | Tailwind 4, com os mesmos tokens do Passaporte | — | O capítulo de design tokens vira tronco comum. |
| Testes | Vitest + Testing Library | 5.1.2 e 16.3.3 (MIT) | O mesmo Vitest do livro de Angular. |
| Formulários | Primeiro, os do próprio React 19 (`<form action>`, `useActionState`); depois, React Hook Form + Zod | 7.92.0 e 4.6.7 (MIT) | O par de Reactive Forms (34) e Signal Forms (36): primeiro o que vem no React, depois a biblioteca que a maioria dos projetos usa. |
| Dados | `fetch` nos `clientLoader` do React Router; `use()` e `<Suspense>` | — | O par de `HttpClient`, `resource()` e resolvers, sem biblioteca extra. TanStack Query entra só como "Aprofundando". |
| Back-end | Supabase (`@supabase/supabase-js`) | 2.119.2 | O mesmo projeto e o mesmo SQL (`supabase/passaporte.sql`) do livro de Angular. |
| PWA | `vite-plugin-pwa` | 2.0.0 (MIT) | O React não tem um service worker próprio; esse é o plugin mais usado com o Vite. Precisa de projeto de teste antes (regra das bibliotecas externas). |
| Acessibilidade | React Aria Components | 1.22.1 (Apache-2.0) | O par do Angular Aria no capítulo 44. |

**Fora do livro, de propósito:** Next.js (muda toda a história de deploy: servidor, e não site estático), Create React App
(o react.dev nem o cita mais), Redux (Context e `useReducer` cobrem o Passaporte).

**Cuidado com as versões:** React Router 8.5.3, Vite 8.4, Vitest 5.1.2 e TypeScript 7.0.2 saíram nesta mesma semana. A
regra para as etapas é fixar a última versão com pelo menos duas semanas, e só subir de versão numa revisão de todo o livro.
O react.dev ainda chama o React Router de "v7", enquanto o site do React Router já documenta a v8: os capítulos citam a
versão que estiver no `package.json` da etapa.

## 3. Os 50 capítulos, lado a lado

Legenda: **C** = tronco comum (um texto só, com trechos por livro quando preciso); **P** = paralelo (capítulo próprio do
React, no lugar do de Angular); **N** = novo no React, sem par direto.

| Nº | Angular (hoje) | React | Tipo | O que muda no Passaporte |
| --- | --- | --- | --- | --- |
| 1 | O que é o Angular | O que é o React | P | — |
| 2 | Preparando o ambiente | Preparando o ambiente | C | Só as extensões do editor mudam (abas por livro). |
| 3 | JavaScript moderno | JavaScript moderno | C | — |
| 4 | TypeScript para Angular | TypeScript para React | P | Tipos de props e de eventos, genéricos em hooks. |
| 5 | Angular CLI | Criando o projeto com o React Router | P | `create-react-router`, a pasta `app/`, `npm run dev`. |
| 6 | Componentes | Componentes e JSX | P | O Atomic Design (átomos, moléculas, organismos) fica igual. |
| 7 | Interpolação e binding | Expressões no JSX e props dos elementos | P | `{nome}`, `className`, `src={…}`. |
| 8 | Event binding | Eventos | P | `onClick`, `onChange`, o objeto do evento. |
| 9 | Signals | Estado com `useState` | P | Renderizar de novo; por que a variável comum não muda a tela. |
| 10 | `@if` e `@switch` | Mostrar ou esconder | P | `&&`, ternário, `return` cedo. |
| 11 | `@for` e `track` | Listas e `key` | P | A armadilha da `key` faltando, com a mensagem real. |
| 12 | Pipes | Formatar dados | P | Funções e `Intl`, sem pipes. |
| 13 | Estilos e Tailwind | Estilos e Tailwind | C | `className` no lugar de `class` (abas por livro). |
| 14 | Design tokens | Design tokens | C | — |
| 15 | `input()` e `output()` | Props e funções de volta | P | — |
| 16 | `model()` | Componentes controlados | P | Levantar o estado para o pai. |
| 17 | `ng-content` | `children` e composição | P | — |
| 18 | `viewChild()` | `useRef` e refs | P | No React 19, `ref` é uma prop comum. |
| 19 | Ciclo de vida | Efeitos e limpeza | P | `useEffect`, a limpeza, o efeito que roda duas vezes no modo estrito. |
| 20 | Layout responsivo | Layout responsivo | C | — |
| 21 | Do protótipo ao componente | Do protótipo ao componente | C | O Figma e a leitura da tela são iguais; o código vem por livro. |
| 22 | Componentes prontos | Componentes prontos | P | Comparar bibliotecas do React (projeto de teste para cada uma). |
| 23 | Router | Rotas | P | `routes.ts`, `<Link>`, `<NavLink>`. |
| 24 | Parâmetros de rota | Parâmetros de rota | P | `params` no componente da rota. |
| 25 | Rotas filhas | Rotas aninhadas | P | `<Outlet>`. |
| 26 | Lazy loading | Código sob demanda por rota | P | O modo framework já divide por rota; medir com o build. |
| 27 | Organização por funcionalidades | Organização por funcionalidades | C | As pastas mudam de nome por livro. |
| 28 | Services e `inject()` | Hooks próprios e Context | P | `usePassport()`, `PassportProvider`. |
| 29 | `HttpClient` | `fetch` e carregamento | P | Estados de carregando e erro. |
| 30 | RxJS essencial | `useReducer` | N | O passaporte vira um reducer; sem RxJS no livro de React. |
| 31 | `toSignal()` | Estado derivado | N | Calcular durante a renderização, e não guardar duas vezes. |
| 32 | `resource()` e `httpResource()` | `use()` e `<Suspense>` | P | — |
| 33 | `effect()` | Sincronizar com o mundo de fora | P | A cópia no `localStorage`; "você talvez não precise de um efeito". |
| 34 | Reactive Forms | Formulários do React 19 | P | `<form action>`, `useActionState`, `useFormStatus`. |
| 35 | Validação | Validação com Zod | P | As mesmas regras do formulário de viagem. |
| 36 | Signal Forms | React Hook Form | P | O mesmo formulário, com a biblioteca. |
| 37 | Login com Supabase | Login com Supabase | C | O painel do Supabase e os erros são iguais; o `Auth` vira um Context. |
| 38 | Guards | Rotas protegidas | P | `clientLoader` que redireciona. |
| 39 | Interceptors | Um cliente HTTP com o token | P | Uma função em volta do `fetch`; o React não tem interceptors. |
| 40 | CRUD com Supabase | CRUD com Supabase | C | O SQL, o RLS e as respostas da API são iguais; o código vem por livro. |
| 41 | Resolvers | Loaders | P | Os dados chegam antes da tela abrir. |
| 42 | Testes com Vitest | Testes com Vitest e Testing Library | P | — |
| 43 | Erros e DevTools | Erros, error boundaries e React DevTools | P | — |
| 44 | Acessibilidade | Acessibilidade | C | A auditoria é a mesma; React Aria no lugar do Angular Aria. |
| 45 | `@defer` | `lazy()` e `<Suspense>` | P | O gráfico das viagens sob demanda. |
| 46 | SEO | SEO e pré-renderização | P | `prerender` no `react-router.config.ts` e `meta` por rota. |
| 47 | PWA | PWA com `vite-plugin-pwa` | P | — |
| 48 | Deploy no Render | Deploy no Render | C | As regras mudam (seção 5). |
| 49 | GitHub Actions | GitHub Actions | C | O mesmo `ci.yml`. |
| 50 | PWABuilder | PWABuilder | C | O mesmo processo e o mesmo `assetlinks.json`. |

Resumo: **13 capítulos comuns**, 35 paralelos e 2 novos. O livro de React teria então **37 capítulos para escrever**; os 13
comuns precisam de uma revisão para ganhar as abas por livro.

## 4. A plataforma com dois livros

### Endereços

- `/angular/capitulos/<slug>` e `/react/capitulos/<slug>`; os comuns aparecem nos dois, com o mesmo texto.
- Os endereços de hoje (`/capitulos/<slug>`) viram páginas de redirecionamento para `/angular/capitulos/<slug>`, geradas no
  build, para não quebrar links já compartilhados nem o Google.
- A página inicial apresenta os dois livros; a escolha fica guardada no navegador (`safeStorage`) e pode ser trocada no
  cabeçalho.

### Catálogo

- Cada capítulo ganha `book: 'angular' | 'react' | 'comum'` e um número **por livro** (o capítulo comum "Deploy no Render"
  é o 48 nos dois).
- `verifiedWithAngular` vira `verifiedWith: { angular?: '22.2', react?: '19.3' }`: um capítulo comum é conferido nos dois.
- As trilhas (Embarque … Produção) são as mesmas nos dois livros.

### Capítulos comuns

- Um componente de capítulo só, que recebe o livro pela rota.
- Um componente novo, `<vm-book-tabs>`, mostra o trecho do livro de quem lê e deixa ver o do outro numa aba ("No React" /
  "No Angular"). Ele também serve para frases curtas (`<vm-book only="react">`).
- Trechos: `site/snippets/NN-slug/` continua para os do Angular; os do React vão para `site/snippets-react/NN-slug/`, com
  chave `react/NN/nome`.

### Carimbos, glossário e busca

- Os carimbos são por livro (`progresso:angular`, `progresso:react`); o progresso que já existe no navegador migra para o
  Angular. Um capítulo comum carimba nos dois.
- O glossário ganha `books`: termos comuns (SPA, CDN, deploy) e termos de cada livro (`signal`, `hook`).
- A busca filtra pelo livro escolhido, com a opção de buscar nos dois.

### O Passaporte em React

- `passaporte-react/etapas/NN-slug/`, uma pasta por etapa, como hoje.
- O mesmo `supabase/passaporte.sql`, a mesma API de países, as mesmas mensagens nas telas e os mesmos nomes de teste,
  para que quem trocar de livro reconheça o app.
- Uma segunda demonstração no Render (por exemplo, `passaporte-react-livro`), com o mesmo CI.

### Nome e endereço do site

- O título passa a ser **Volta ao Mundo**, com o livro no subtítulo ("em Angular", "em React").
- O endereço de hoje (`utfpr-gp.github.io/volta-ao-mundo-em-angular`) pode ficar, e é o caminho sem risco. Renomear o
  repositório muda o endereço do GitHub Pages, e o endereço antigo **não** redireciona: renomear exige um domínio próprio
  ou aceitar os links quebrados. Decisão em aberto (seção 8).

## 5. O que já se sabe que vai dar trabalho

- **Pré-renderização e o Render.** O React Router escreve `build/client/[url].html` para cada página pré-renderizada, e o
  `__spa-fallback.html` (quando a raiz também é pré-renderizada) para as rotas do navegador. No capítulo 48, o Render
  **não** entregou `sobre.html` em `/sobre`. Antes de escrever o 46 e o 48 do React, é preciso conferir num site de
  verdade no Render o formato que o React Router 8 gera e escrever as regras certas, como foi feito no livro de Angular.
- **O efeito que roda duas vezes.** O modo estrito do React roda efeitos duas vezes em desenvolvimento. É a primeira
  armadilha do capítulo 19, e precisa de mensagem real (ex.: duas requisições na aba Rede).
- **Mensagens de erro reais.** O React tem menos códigos de erro que o Angular (avisos como `Each child in a list should
  have a unique "key" prop.` e erros minificados em produção com link para `react.dev/errors/…`). Cada armadilha precisa
  ser reproduzida num projeto, como hoje.
- **Componentes prontos (22).** Projeto de teste para cada biblioteca, com licença e tamanho do build, como manda o AGENTS.md.
- **Duas vezes a manutenção.** Cada versão nova do Angular ou do React pede uma revisão do livro dela, e os 13 comuns
  passam a ser conferidos nos dois.

## 6. A página "Lado a lado"

Uma página fora das trilhas (sem carimbo), com uma tabela por assunto: estado, listas, formulários, rotas, dados, testes,
deploy. Cada linha mostra o mesmo pedaço do Passaporte nos dois frameworks e liga aos capítulos dos dois livros. Serve a
quem já leu um livro e vai ler o outro, e a quem precisa escolher.

## 7. O critério de pronto, para os dois livros

Proposta para o `.github/pull_request_template.md` (já aplicada neste PR):

- O PR diz o livro (Angular, React ou comum) e o número do capítulo.
- A conferência de API cita a documentação do framework do capítulo (angular.dev ou react.dev, e a da biblioteca, quando
  houver), na versão do `package.json` da etapa.
- Um capítulo comum é conferido nos dois livros: trechos dos dois, nas duas etapas, e o navegador nos dois endereços.
- A etapa do Passaporte do livro certo compila, passa nos testes e roda.
- O resto continua igual: as sete visões, a analogia, o simulador acessível, armadilhas com mensagem real, 3 a 5
  perguntas, revisão de texto e a conferência no navegador.

No `AGENTS.md`, as regras de escrita continuam valendo para os dois livros; mudam a regra 7 (documentação oficial do
framework do capítulo), a seção "Como criar um capítulo" (o campo `book`, as pastas `snippets-react` e
`passaporte-react`) e o mapa do repositório. As notas de cada capítulo do React entram numa seção própria.

## 8. Fases

1. **Decisões (esta conversa):** as da seção 9.
2. **Plataforma com dois livros, sem React ainda.** Catálogo com `book`, endereços novos e redirecionamentos, carimbos e
   glossário por livro, `<vm-book-tabs>`. O livro de Angular continua igual para quem lê, só que em `/angular/…`. Um PR.
3. **O esqueleto do livro de React.** As 50 entradas no catálogo, todas "em breve"; os 13 comuns ganham as abas, ainda só
   com o lado do Angular.
4. **Capítulos do React, por trilha.** Embarque e Fundamentos primeiro, como foi com o Angular, com etapa, PR e
   verificação por capítulo. Os comuns ganham o lado do React quando a trilha chegar neles.
5. **A página "Lado a lado"**, quando houver capítulos dos dois lados em todas as trilhas.

## 9. Decisões em aberto

1. **Nome e endereço:** manter `utfpr-gp.github.io/volta-ao-mundo-em-angular` (recomendado agora) ou renomear com um
   domínio próprio.
2. **React Router em modo framework** (recomendado: é o que o react.dev aponta e dá o site estático pré-renderizado) **ou
   Vite puro com React Router em modo declarativo** (mais simples no começo, mas sem `loader` nem pré-renderização, e os
   capítulos 41 e 46 ficariam sem par).
3. **RxJS no livro de React:** fora (recomendado) ou um capítulo opcional.
4. **Formulários:** React 19 + React Hook Form com Zod (recomendado) ou só o React 19.
5. **Uma segunda demonstração no Render** para o Passaporte em React (recomendado) ou nenhuma.
6. **Ordem:** escrever o React do começo ao fim antes de mexer nos comuns, ou acertar os comuns logo na fase 3
   (recomendado: na fase 3, para os dois livros nascerem coerentes).
