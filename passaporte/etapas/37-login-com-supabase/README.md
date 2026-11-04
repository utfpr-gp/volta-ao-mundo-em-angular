# Passaporte · etapa do capítulo 37

O Passaporte do jeito que ele fica ao fim do capítulo 37, **Login com Supabase**: como fazer login com Supabase Auth?
Faz parte do livro **Volta ao Mundo em Angular**: https://utfpr-gp.github.io/volta-ao-mundo-em-angular/capitulos/37-login-com-supabase

Antes de rodar, crie o seu projeto gratuito no [Supabase](https://supabase.com) e escreva o **Project URL** e a
**chave publicável** (botão *Connect*, no topo do painel) nos dois arquivos de `src/environments`. No projeto, em
*Authentication → URL Configuration*, troque o **Site URL** para `http://localhost:4200`.

```bash
npm install
npm run api   # num terminal: o json-server, em http://localhost:3000 (os dados do passaporte continuam nele)
npm start     # em outro terminal: o app, em http://localhost:4200
```

Os testes não precisam do Supabase: eles usam um cliente falso (`src/testing/fake-supabase.ts`).

```bash
npm test
```
