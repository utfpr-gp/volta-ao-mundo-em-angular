# Passaporte · etapa do capítulo 46

O Passaporte do jeito que ele fica ao fim do capítulo 46, **SEO**: como fazer o Google encontrar o seu app com SEO?
Faz parte do livro **Volta ao Mundo em Angular**: https://utfpr-gp.github.io/volta-ao-mundo-em-angular/capitulos/46-seo

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

Desde o capítulo 40, os dados do passaporte ficam no Supabase: o json-server não é mais usado.

Os testes não precisam do Supabase: eles usam um cliente falso (`src/testing/fake-supabase.ts`) e o `HttpTestingController`.

```bash
npm test                                # roda os testes e fica olhando as mudanças
npx ng test --watch=false --coverage    # roda uma vez e mostra a cobertura (relatório em coverage/passaporte/index.html)
```
