# Volta ao Mundo em Angular — documento de projeto

**Autor do material:** Prof. Roni Fabio Banaszewski · Tecnologia em Sistemas para Internet (TSI) · UTFPR Guarapuava
**Data:** 22/10/2026 · **Situação:** aprovado

## 1. A intenção

Um site aberto, em português, que ensina Angular moderno do zero ao deploy para estudantes de graduação e para qualquer pessoa interessada. Ele funciona como um **livro**: pode ser lido do começo ao fim, para aprender, e consultado depois, para relembrar. Slides não comportam o que se quer aqui: texto didático de apostila, simuladores interativos, código prático e atualização fácil.

**O critério principal é a qualidade do material**, não a velocidade de produção. Não há prazo, turma ou calendário ligado ao projeto.

O material ensina construindo um único app de exemplo, o **Passaporte**: um app de países visitados e países desejados, que cresce um pouco a cada capítulo. O progresso de quem estuda também é um passaporte: cada capítulo concluído ganha um carimbo.
## 2. Objetivos, não objetivos e antiobjetivos

**Objetivos**
- Ensinar Angular moderno (standalone, signals, controle de fluxo novo, `inject()`, Vitest) com linguagem fácil, motivadora e visual, sem perder o rigor técnico.
- Cobrir do primeiro contato ao deploy, incluindo temas essenciais que costumam faltar: TypeScript para Angular, RxJS essencial, testes, leitura de mensagens de erro e acessibilidade.
- Dar a cada conceito uma forma de ser **visto funcionando** (simuladores) e **praticado** (passos guiados e desafios).
- Ser mantido por um agente de IA: estrutura previsível, regras de escrita registradas no repositório e verificação automática.

**Não objetivos**
- Não é a referência completa de cada API; o angular.dev cumpre esse papel, e cada capítulo aponta para ele. O site é um livro didático que também serve de consulta.
- Sem login, certificados, fórum ou comentários.
- Sem versão em inglês.
- Sem vídeos.
- Não menciona a disciplina, a ficha de avaliação, notas ou o método de projeto usado na UTFPR. O site serve a qualquer pessoa.

**Antiobjetivos** (o projeto fracassa se isto acontecer, mesmo funcionando)
- Capítulos que viram paredes de código sem contexto, ou texto técnico frio que desmotiva.
- Gamificação que premia clicar em vez de aprender.
- Conteúdo desatualizado em relação à versão atual do Angular, sem ninguém perceber.
- Dependência de serviço pago, chave de API ou cadastro para estudar os capítulos iniciais.

## 3. Público e tom

- **Público:** estudantes de graduação em computação e iniciantes em front-end que já sabem HTML, CSS e o básico de JavaScript.
- **Tom:** fala com "você", frases curtas, motivador. Cada conceito novo ganha uma analogia do cotidiano. Os termos técnicos aparecem com o nome oficial (`signal()`, `@defer`), sempre explicados na primeira vez.
- **Idioma:** português do Brasil. Nomes no código do Passaporte em inglês, como manda a boa prática, e comentados quando ajudar.

## 4. Anatomia de um capítulo

Validada com o professor no esboço do capítulo de Signals. Cada capítulo é uma narrativa única, sem abas, com "visões" que se repetem na mesma ordem e com identidade visual própria (ícone e cor):

| Visão | Papel |
|---|---|
| Cabeçalho | Trilha, tempo estimado, pré-requisito, a pergunta do capítulo no formato "Como fazer X com `termo`?", e o espaço do carimbo |
| 🎯 **A missão** | O que o Passaporte ganha neste capítulo, mostrado funcionando antes de qualquer explicação |
| 💡 **A ideia** | A analogia do cotidiano |
| 🔬 **Por dentro** | O conceito técnico, com um simulador interativo |
| 🛠️ **Mão no código** | A prática guiada em passos curtos: trecho com a linha nova destacada, notas numeradas e "o que muda na tela" |
| ⚠️ **Armadilhas** | Os erros reais que a pessoa vai encontrar, com a mensagem exata do Angular ou do TypeScript e como resolver |
| 🏁 **Desafio** | Perguntas com correção imediata; acertar tudo dá o carimbo |
| 📚 **Para ir além** | Os links da documentação oficial |

Regras de equilíbrio:
- Código em doses pequenas, sempre ligado a um resultado visível; o código completo da etapa fica a um clique (link para a pasta da etapa e para abrir no StackBlitz).
- Detalhes técnicos mais fundos ficam em caixas recolhíveis "Aprofundando", para não interromper o caminho principal.
- Lateral fixa com o resumo de 1 minuto (a "cola") e o passaporte da trilha.

## 5. O conteúdo: trilhas e capítulos

As trilhas são "continentes" da volta ao mundo. Cada capítulo responde a uma pergunta. A ordem é de aprendizado: cada capítulo usa só o que veio antes.

| Trilha | Capítulos |
|---|---|
| **Embarque** | 1. O que é o Angular, e por que escolhê-lo entre React, Vue e Svelte? · 2. Como preparar o ambiente: terminal, Node.js e editor? · 3. Que JavaScript moderno preciso saber? · 4. Que TypeScript preciso saber para o Angular? · 5. Como criar e rodar um projeto com o Angular CLI? |
| **Fundamentos** | 6. Como dividir a tela em componentes standalone? · 7. Como exibir dados com interpolação e property binding? · 8. Como responder a cliques e digitação com event binding? · 9. Como guardar estado que atualiza a tela com `signal()` e `computed()`? · 10. Como mostrar ou esconder elementos com `@if` e `@switch`? · 11. Como repetir elementos com `@for` e `track`? · 12. Como formatar dados com pipes? · 13. Como estilizar componentes, e onde entra o Tailwind? · 14. Como dar identidade visual ao app com design tokens? |
| **Componentes** | 15. Como passar dados entre componentes com `input()` e `output()`? · 16. Como sincronizar um valor nos dois sentidos com `model()`? · 17. Como reaproveitar conteúdo com `ng-content`? · 18. Como acessar um elemento ou componente filho com `viewChild()`? · 19. Como executar código quando o componente é criado e destruído? · 20. Como montar um layout responsivo Mobile-First? · 21. Como transformar um protótipo do Figma em componentes? · 22. Como usar componentes prontos com Angular Material, PrimeNG, daisyUI e Spartan? |
| **Navegação** | 23. Como navegar entre telas com o Router? · 24. Como receber parâmetros da URL com `input()`? · 25. Como aninhar telas com rotas filhas? · 26. Como carregar telas sob demanda com lazy loading? · 27. Como organizar o projeto por funcionalidades? |
| **Dados** | 28. Como compartilhar dados com services e `inject()`? · 29. Como buscar dados de uma API com `HttpClient`? · 30. Que RxJS preciso saber? · 31. Como transformar um Observable em signal com `toSignal()`? · 32. Como buscar dados com `resource()` e `httpResource()`? · 33. Como reagir a mudanças com `effect()`? |
| **Formulários** | 34. Como criar formulários com Reactive Forms? · 35. Como validar campos com regex e mostrar mensagens de erro? · 36. Como fazer formulários com Signal Forms? |
| **Back-end** | 37. Como fazer login com Supabase Auth? · 38. Como proteger rotas com guards? · 39. Como enviar o token em toda requisição com interceptors? · 40. Como criar, ler, atualizar e apagar dados no Supabase? · 41. Como carregar dados antes de abrir a tela com resolvers? |
| **Qualidade** | 42. Como testar componentes e services com Vitest? · 43. Como ler os erros do Angular e usar o Angular DevTools? · 44. Como deixar o app acessível? |
| **Produção** | 45. Como carregar partes da tela sob demanda com `@defer`? · 46. Como fazer o Google encontrar o seu app com SEO? · 47. Como transformar o app em um PWA instalável? · 48. Como gerar o build e publicar o app no Render? · 49. Como automatizar testes e publicação com GitHub Actions? · 50. Como levar o PWA para as lojas de aplicativos com o PWABuilder? |
| **Para ir além** (sem carimbo) | Renderização no servidor a cada acesso (SSR com servidor Node) · Animações · IA no desenvolvimento Angular (servidor MCP do Angular CLI, tutor de IA oficial) |

**O capítulo 6** explica o que é um componente com a analogia da química, do Atomic Design de Brad Frost:
- **átomos** são as peças que não se dividem: um botão, um campo, uma bandeira;
- **moléculas** juntam átomos com um propósito: o campo de busca com o botão;
- **organismos** são as partes inteiras da tela: o cabeçalho, a lista de países;
- **templates e páginas** são a tela montada.

A tela do Passaporte é desmontada nesses níveis, e o simulador mostra a árvore de componentes se formando a partir dela. A fonte é o material "Atomic Design: A Química das Interfaces", do professor.

**O capítulo 22** compara as bibliotecas de componentes prontos pelo que as diferencia:
- **Angular Material:** oficial, com o visual do Material Design.
- **PrimeNG:** um catálogo grande de componentes.
- **daisyUI:** classes prontas sobre o Tailwind.
- **Spartan:** componentes no estilo shadcn, copiados para o projeto e personalizáveis.
- **Angular Aria:** a base acessível, sem visual, para quem cria os próprios componentes.

A prática é o mesmo cartão de país do Passaporte feito em cada biblioteca, com o código lado a lado e cada versão numa pasta própria (`passaporte/variantes/`), que abre no StackBlitz. O site em si não depende dessas bibliotecas.

**O capítulo 35** trata a validação com o cuidado que ela merece:
- `Validators.pattern` com uma regex montada passo a passo, usando o número do passaporte brasileiro (duas letras e seis dígitos, `^[A-Z]{2}[0-9]{6}$`), além de `required`, `minLength` e `email`;
- um validador próprio: a data da viagem não pode ser no futuro;
- uma mensagem clara para cada tipo de erro, exibida só depois que o campo foi tocado;
- o botão de enviar desabilitado enquanto o formulário estiver inválido, com a discussão de quando isso ajuda e quando atrapalha, e a alternativa de validar ao enviar;
- a mensagem de erro ligada ao campo, para que leitores de tela a anunciem;
- máscaras de campo (o número do passaporte em maiúsculas enquanto se digita), o `select` e o estilo do campo conforme o estado de validação.

**O capítulo 46** trata de SEO:
- por que uma SPA comum entrega ao buscador um HTML quase vazio (só o `<app-root>`);
- a pré-renderização no build (SSG), que gera cada página com o conteúdo pronto;
- título e descrição por página, com a propriedade `title` das rotas e os services `Title` e `Meta`;
- as tags Open Graph, que montam o cartão de compartilhamento em redes sociais e mensageiros;
- `sitemap.xml`, `robots.txt` e a auditoria de SEO do Lighthouse.

No Passaporte, cada país ganha uma página com título e descrição próprios.

**O capítulo 48** publica o Passaporte no Render, como site estático conectado ao GitHub. Ele ensina a regra que manda qualquer endereço para o `index.html`: sem ela, recarregar `/paises/BR` dá erro 404, e entender esse erro é entender como uma SPA funciona. O capítulo termina com uma tabela de alternativas (Vercel, Netlify, GitHub Pages, Firebase Hosting).

**O capítulo 50** leva o Passaporte publicado às lojas com o PWABuilder:
- o relatório de qualidade do PWA;
- o empacotamento para Google Play, Microsoft Store, App Store (experimental) e Meta Quest;
- o arquivo que prova ao Android que o app e o site são do mesmo dono, para o app abrir sem a barra do navegador;
- o custo da conta de desenvolvedor de cada loja, com os valores conferidos na época em que o capítulo for escrito.

A prática não exige conta paga: o pacote Android pode ser instalado direto no celular para teste.

**Capítulos acrescentados a partir do material da disciplina no Moodle:**
- **3. JavaScript moderno:** arrow functions, desestruturação, espalhamento, módulos, Promise e async/await, no nível que o Angular exige.
- **18. `viewChild()`:** o componente pai acessando um elemento ou um componente filho diretamente.
- **19. Ciclo de vida:** o que roda quando o componente nasce e quando ele some (`ngOnInit`, `ngOnDestroy`, `DestroyRef`, `afterNextRender`).
- **21. Do protótipo ao componente:** ler uma tela do Figma, identificar átomos, moléculas e organismos, e tirar dela os tokens e os componentes do Passaporte.
- **27. Organização por funcionalidades:** as pastas `core/`, `shared/` e `features/`, e a regra de que uma funcionalidade não importa outra.
- **49. GitHub Actions:** testes e build a cada push, e a publicação automática.

**Assuntos do Moodle que entram dentro de capítulos existentes:**
- tratamento de erros e relações 1-para-N no json-server, no de `HttpClient`;
- operadores de ordem superior (`switchMap`), no de RxJS;
- a mesma instância de service para um componente e seus filhos, numa caixa "Aprofundando" do de services;
- as extensões do VS Code para Angular, no do ambiente;
- ícones, no de estilos, e o indicador de carregamento, no de `resource()`;
- o `angular-cli-ghpages`, na tabela de alternativas do deploy.

Git e Gitflow ficam de fora por serem outro assunto: o capítulo do ambiente diz que o Git é necessário e indica onde aprender.

**Ordem de construção:** a do livro, do capítulo 1 em diante. Antes do primeiro capítulo vêm a página inicial, a página "Meu passaporte" e a estrutura de todas as trilhas; os capítulos ainda não escritos aparecem como "em breve". O deck já feito do capítulo 1 (`angular/slides/01-o-que-e-o-angular.pptx`, no repositório `utf-disciplinas`) é a fonte do texto desse capítulo.

### 5.1. Recursos de livro de consulta

Para quem volta ao site depois de ter estudado:
- **Busca** em todo o conteúdo, funcionando no próprio navegador, sem serviço externo.
- **Glossário:** cada termo técnico tem uma definição curta; na primeira aparição em cada capítulo, o termo leva ao glossário.
- **Resumo de 1 minuto** em cada capítulo, e uma **página de referência rápida por trilha**, que junta os resumos e os trechos de código essenciais.
- **Ligações entre capítulos:** quando um capítulo usa algo de outro, aponta para ele ("você viu isso em…").
- **Links estáveis** para cada seção de cada capítulo, para poderem ser citados e compartilhados.

### 5.2. Critério de pronto de um capítulo

Um capítulo só é publicado quando cumpre todos os itens:
1. Todas as visões da seção 4 estão presentes, incluindo uma analogia e um simulador ou recurso visual.
2. Todo código foi conferido contra a documentação oficial da versão do Angular em uso, e a etapa do Passaporte correspondente compila e roda.
3. As armadilhas mostram mensagens de erro reais, reproduzidas de verdade.
4. O desafio tem de 3 a 5 perguntas, cada uma com explicação para a resposta errada.
5. O texto passou por revisão de português e de tom (seção 3), sem jargão sem explicação.
6. O simulador funciona com teclado, tem texto alternativo e respeita a preferência por menos movimento.
7. O professor aprovou o capítulo no Pull Request antes da publicação.

## 6. O app de exemplo: Passaporte

**Domínio:** países visitados e países desejados. Regras de negócio mínimas, e as poucas que existem servem para ensinar validação: a nota da viagem vai de 1 a 5, e a data da viagem não pode ser no futuro.

**Dados**
- **REST Countries** (`restcountries.com`): lista de países com bandeira, capital, população, região e moedas. Gratuita, sem chave. O endpoint de "todos os países" exige informar os campos desejados no parâmetro `fields`; confirmar o limite atual de campos antes de usar.
- **Open-Meteo**: clima atual da capital do país. Gratuita, sem chave, para uso não comercial.
- **json-server**: o "meu passaporte" (visitados e desejados) enquanto o curso não chega ao back-end.
- **Supabase**: o mesmo passaporte, com login, a partir da trilha Back-end. Cada pessoa usa o seu próprio projeto gratuito.

**Como o app cresce** (exemplos, não exaustivo): lista fixa de três países (componentes) → contador de visitados e porcentagem do mundo (`signal`, `computed`) → filtros e "lista vazia" (`@if`, `@switch`) → lista de cartões (`@for`) → população e porcentagem formatadas, e um pipe de bandeira (pipes) → a identidade visual do passaporte, com cores e fontes como tokens e modo escuro (design tokens) → cartão que avisa "marcar como visitado" (`input`, `output`) → estrelas de nota clicáveis (`model`) → `/paises` e `/paises/:codigo` com abas de visão geral, clima e anotações (rotas, parâmetros, rotas filhas) → busca enquanto digita (HTTP, RxJS, `toSignal`) → formulário de viagem (formulários) → login e passaporte na nuvem (back-end) → mapa ou gráfico carregado sob demanda (`@defer`) → instalável e consultável sem internet (PWA) → publicado no Render → empacotado para as lojas de aplicativos com o PWABuilder.

**Etapas:** cada capítulo tem a sua etapa do Passaporte em uma pasta própria (`passaporte/etapas/NN-slug/`), um projeto completo que roda sozinho. O capítulo aponta para a pasta no GitHub e para abri-la no StackBlitz, no navegador, sem instalar nada.

## 7. Simuladores

Componentes Angular do próprio site. Quando o conceito é de reatividade, o simulador usa signals de verdade, e a animação só mostra o que está acontecendo. Lista inicial (em negrito, os dos capítulos 1 a 14):
- **Do clique à página nova × SPA** (capítulo 1)
- **A árvore de componentes se montando a partir de uma tela**, nível por nível: átomos, moléculas, organismos (capítulo 6)
- **Os dois sentidos do binding**, com os dados indo da classe para a tela e o evento voltando (capítulos 7 e 8)
- **Grafo signal → computed → tela**, com o pulso percorrendo as ligações (capítulo 9)
- **`@for` com e sem `track`**, destacando quais elementos são reaproveitados e quais são recriados (capítulo 11)
- **Pipes como filtros**: o mesmo valor saindo formatado de jeitos diferentes (capítulo 12)
- **Editor de tokens**: a pessoa muda a cor `primary`, o arredondamento ou a fonte num seletor e vê o Passaporte inteiro mudar junto, inclusive no modo escuro (capítulo 14)
- Depois: dados descendo e eventos subindo na árvore; o `<router-outlet>` trocando de tela com a URL ao lado; a linha do tempo de uma requisição HTTP; um testador de regex ao vivo no campo do número do passaporte, mostrando o estado do campo (intocado, tocado, alterado, válido), as mensagens de erro e o botão de enviar se habilitando; a requisição atravessando os interceptors; um decodificador de JWT; o `@defer` disparando no scroll; "O que o Google vê", com o HTML de uma SPA comum ao lado do pré-renderizado, e a prévia do resultado de busca e do cartão de compartilhamento mudando ao vivo enquanto se edita título e descrição; o PWA funcionando sem internet.

Todo simulador funciona com teclado, tem texto alternativo para o que mostra, e respeita a preferência do sistema por menos movimento.

## 8. Gamificação: o passaporte de quem estuda

- Cada capítulo com carimbo tem um desafio de 3 a 5 perguntas, de múltipla escolha ou de "qual linha está certa".
- O carimbo só é dado quando todas as respostas estão certas. Pode tentar de novo quantas vezes quiser, e cada resposta errada mostra uma explicação curta.
- Uma página "Meu passaporte" mostra o mapa das trilhas, os carimbos conquistados e o progresso.
- O progresso fica salvo no navegador, sem login e sem servidor. Há um botão para exportar e importar o progresso em arquivo, para quem troca de computador.
- Sem ranking e sem pontuação competitiva.

## 9. Identidade visual

Baseada no esboço aprovado:
- **Cores:** azul-marinho `#12263A` (dominante), papel `#FBF8F1` (fundo), vermelho de carimbo `#C8102E`, dourado `#D99A1E`, azul-oceano `#1F6FB2`, verde `#1E8A6E`, violeta `#6B4FD8`.
- **Fontes:** Nunito Sans no texto e JetBrains Mono no código.
- **Design tokens:** cores, fontes e arredondamentos são declarados como tokens no `@theme` do Tailwind, com nomes de papel, nunca de aparência. Exemplos: `--color-primary` (o azul-marinho), `--color-surface` (o papel), `--color-stamp` (o vermelho de carimbo), `--color-highlight` (o dourado), e uma cor por visão do capítulo (`--color-mission`, `--color-idea`, `--color-inside`, `--color-code`, `--color-pitfall`, `--color-challenge`). Nenhum componente usa cor solta.
- **Modo escuro:** o site tem modo claro e escuro, seguindo a preferência do sistema e com um botão para trocar. Trocar de modo é trocar os valores dos tokens. O próprio site serve de exemplo do capítulo 14.
- Contraste mínimo AA em todo texto. Layout responsivo; no celular, a lateral e o sumário viram itens recolhíveis.
- **Rodapé de todas as páginas:** "Volta ao Mundo em Angular · Prof. Roni Fabio Banaszewski · Tecnologia em Sistemas para Internet · UTFPR Guarapuava", mais a licença.

## 10. Como é construído

- **Repositório:** `utfpr-gp/volta-ao-mundo-em-angular`, público, publicado em `utfpr-gp.github.io/volta-ao-mundo-em-angular`.
- **Tecnologia:** o site é uma aplicação Angular na versão estável atual (22 em outubro de 2026), gerada como site estático com `outputMode: "static"`. Todas as páginas são pré-geradas no build. Os capítulos são rotas pré-geradas, as rotas com parâmetro usam `getPrerenderParams`, e o `base href` é `/volta-ao-mundo-em-angular/`.
- **Estilo e componentes de interface:**
  - **Tailwind CSS 4** para o estilo, com a paleta da seção 9 declarada como tokens no `@theme`;
  - o **plugin de tipografia** (`prose`) para o texto longo dos capítulos;
  - **Angular Aria**, estável desde o Angular 22, para as partes interativas: abas dos passos de código e alternativas do desafio. Ele cuida de teclado, foco e acessibilidade, e o estilo fica com o Tailwind.
  - As caixas "Aprofundando" usam o `<details>` nativo do HTML, porque o acordeão do Angular Aria só desenha o conteúdo quando é aberto, e o texto ficaria fora do HTML pré-gerado, da busca e do Google. O menu das trilhas é uma lista de links comum dentro de `<nav>`, porque o papel `menu` do ARIA é para ações de aplicativo, não para navegação entre páginas.
  - **Sem daisyUI e sem Spartan.** O visual do site é próprio, e essas bibliotecas trariam um visual a desfazer ou peças a mais. Elas aparecem no livro como conteúdo, no capítulo 22, junto com o Angular Material e o PrimeNG, como opções para os projetos de quem lê.
- **Conteúdo:** cada capítulo é um componente standalone com o texto no template, usando componentes compartilhados para as visões (missão, ideia, código, armadilha, desafio, aprofundando). Os metadados de cada capítulo (trilha, número, pergunta, tempo, pré-requisito, versão do Angular em que foi verificado) ficam num catálogo único, de onde saem a navegação, o mapa e o progresso.
- **Organização:** a pasta `site/` (o site) e a pasta `passaporte/etapas/` (uma pasta por etapa do app de exemplo) num workspace npm, com uma única versão do Angular na raiz.
- **SEO do site:**
  - todas as páginas pré-renderizadas, com título e descrição próprios por capítulo;
  - Open Graph com imagem para compartilhamento;
  - `sitemap.xml`, `robots.txt` e URL canônica;
  - dados estruturados (JSON-LD) descrevendo o site como material de curso;
  - `lang="pt-BR"`.

  O próprio site serve de exemplo do capítulo 46.
- **Publicação:** GitHub Actions faz o build e publica no GitHub Pages a cada push na `main`.
- **Verificação automática a cada push:**
  - build do site;
  - build de todas as etapas do Passaporte;
  - testes (Vitest) do progresso, do desafio e dos simuladores;
  - verificação de links quebrados.
- **Atualização do Angular:** atualizações de dependência automáticas abrem PR; a verificação acima mostra o que quebrou.
- **Manutenção por agente:** um `AGENTS.md` (com `CLAUDE.md` apontando para ele) registra as regras de escrita, entre elas:
  - o tom e a analogia obrigatória;
  - a anatomia do capítulo;
  - não mencionar disciplina nem vídeo;
  - conferir toda API contra o angular.dev da versão em uso;
  - os nomes no código em inglês.

  O agente também lista nele os passos para criar um capítulo novo.
- **Licença:** CC BY 4.0 para o texto, MIT para o código.
- **Privacidade:** sem rastreamento de visitantes.

## 11. Decisões tomadas pelo agente (para o professor conferir)

- O site é feito em Angular, e não em uma ferramenta de documentação, porque quem mantém é um agente e porque o próprio site vira exemplo de Angular.
- As etapas do Passaporte ficam em pastas no mesmo repositório, e não em tags de outro repositório, para caberem num repositório só e serem verificadas pelo mesmo build.
- O carimbo depende de acertar o desafio, não de abrir a página.
- Licença CC BY 4.0 e MIT; sem rastreamento.
- A construção segue a ordem do livro, um capítulo por vez, e cada capítulo só é publicado depois de cumprir o critério de pronto (seção 5.2), incluindo a aprovação do professor no Pull Request.
- Os recursos de consulta (busca, glossário, referência rápida por trilha) fazem parte do projeto desde a estrutura inicial.
- O deploy do Passaporte é ensinado no Render, com as outras opções em tabela; o site do livro fica no GitHub Pages.
- Os dados do Passaporte vêm de APIs públicas (REST Countries, Open-Meteo), depois do json-server e, a partir da trilha Back-end, do Supabase. A troca mexe só nos services e é usada para ensinar arquitetura.
- Os nomes das trilhas são os continentes da volta ao mundo; o texto exato de cada capítulo é escrito na implementação.
- O código do próprio site também usa nomes em inglês, como o do Passaporte. Textos, URLs e chaves de conteúdo ficam em português.
- Os 50 slugs (endereços) dos capítulos são fixados no plano de construção e não mudam depois de publicados.

## 12. O que fica para quem constrói

- A escolha das demais bibliotecas de apoio (destaque de sintaxe, ícones, fontes hospedadas no próprio site ou não), desde que sejam gratuitas e não rastreiem. Tailwind, o plugin de tipografia e o Angular Aria já estão decididos (seção 10).
- O desenho exato de cada simulador, dentro do que a seção 7 descreve.
- O formato do catálogo de capítulos e dos testes.
- Como gerar a página 404 do GitHub Pages para links profundos que não foram pré-gerados.
