# Passaporte · etapa do capítulo 40

O Passaporte do jeito que ele fica ao fim do capítulo 40, **CRUD com Supabase**: como criar, ler, atualizar e apagar dados no Supabase?
Faz parte do livro **Volta ao Mundo em Angular**: https://utfpr-gp.github.io/volta-ao-mundo-em-angular/capitulos/40-crud-com-supabase

Antes de rodar:

1. Crie o seu projeto gratuito no [Supabase](https://supabase.com) e escreva o **Project URL** e a **chave publicável**
   (botão *Connect*, no topo do painel) nos dois arquivos de `src/environments`.
2. Em *Authentication → URL Configuration*, troque o **Site URL** para `http://localhost:4200`.
3. No *SQL Editor* do painel, cole e rode o arquivo [`supabase/passaporte.sql`](supabase/passaporte.sql): ele cria as
   tabelas `passports` e `trips` e as regras que deixam cada pessoa ver só os próprios dados.

```bash
npm install
npm start     # o app, em http://localhost:4200
```

Desde este capítulo, os dados do passaporte ficam no Supabase: o json-server não é mais usado.

Os testes não precisam do Supabase: eles usam um cliente falso (`src/testing/fake-supabase.ts`) e o `HttpTestingController`.

```bash
npm test
```
