# Passaporte · etapa do capítulo 49

O Passaporte do jeito que ele fica ao fim do capítulo 49, **GitHub Actions**: como automatizar testes e publicação com GitHub Actions?
Faz parte do livro **Volta ao Mundo em Angular**: https://utfpr-gp.github.io/volta-ao-mundo-em-angular/capitulos/49-github-actions

Antes de rodar:

1. Crie o seu projeto gratuito no [Supabase](https://supabase.com) e escreva o **Project URL** e a **chave publicável**
   (botão *Connect*, no topo do painel) nos dois arquivos de `src/environments`.
2. Em *Authentication → URL Configuration*, troque o **Site URL** para `http://localhost:4200`.
3. No *SQL Editor* do painel, cole e rode o arquivo [`supabase/passaporte.sql`](supabase/passaporte.sql): ele cria as
   tabelas `passports` e `trips` e as regras que deixam cada pessoa ver só os próprios dados.

```bash
npm install
npm start       # o app, em http://localhost:4200
npm run build   # pré-renderiza as páginas em dist/passaporte/browser e gera o sitemap.xml e o robots.txt
```

Desde este capítulo, o build pré-renderiza a lista de países, o "Sobre" e uma página para cada país (ele busca a lista na
API de países do livro, e por isso precisa de internet). Antes de publicar, troque o `SITE_URL` de `src/app/core/site.ts`
pelo endereço do seu app.

Desde o capítulo 47, o Passaporte é um PWA: instalável, com ícone próprio, e abre sem internet com as páginas e a lista de
países guardadas pelo service worker. O service worker só existe no build de produção. Para vê-lo funcionar:

```bash
npm run build
npx http-server -p 8080 -c-1 dist/passaporte/browser   # abra http://localhost:8080 (comece pela página inicial)
```

O que ele guarda está em `ngsw-config.json`. Nunca ponha a API do Supabase num `dataGroup`: o cache guarda pela URL, e a
pessoa seguinte que entrar no mesmo navegador veria os dados da anterior.

Desde o capítulo 48, o Passaporte vai ao ar no [Render](https://render.com), como site estático ligado ao seu
repositório no GitHub. O `render.yaml` descreve o site: o comando de build, a pasta publicada (`dist/passaporte/browser`)
e as regras de rewrite, que entregam o casco do app (`index.csr.html`) aos endereços sem arquivo, como `/passaporte`.
Você pode criar o site pelo painel (*New → Static Site*) ou pelo arquivo (*New → Blueprint*). Depois de publicar:

1. troque o `SITE_URL` de `src/app/core/site.ts` pelo endereço que o Render deu;
2. no Supabase, em *Authentication → URL Configuration*, troque o **Site URL** pelo endereço do Render: é para ele que o
   link do e-mail de confirmação leva.

Desde o capítulo 49, o `.github/workflows/ci.yml` roda `npm ci`, `npm test` e `npm run build` no GitHub Actions a cada
push na `main` e a cada pull request. O `render.yaml` tem `autoDeployTrigger: checksPass` (no painel: *Settings →
Auto-Deploy → After CI Checks Pass*): o Render só publica os commits em que todos os checks passaram. Para isso, o Render
precisa estar ligado ao repositório pelo app dele no GitHub. Mande sempre o `package-lock.json` junto com o `package.json`:
o `npm ci` do CI recusa um lock desatualizado.

Desde o capítulo 40, os dados do passaporte ficam no Supabase: o json-server não é mais usado.

Os testes não precisam do Supabase: eles usam um cliente falso (`src/testing/fake-supabase.ts`) e o `HttpTestingController`.

```bash
npm test                                # roda os testes e fica olhando as mudanças
npx ng test --watch=false --coverage    # roda uma vez e mostra a cobertura (relatório em coverage/passaporte/index.html)
```
