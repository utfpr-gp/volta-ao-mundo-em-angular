import type { ChapterContent } from '../types';

export const CHAPTER_27: ChapterContent = {
  summary: [
    '`core`: o que o app tem uma vez só (cabeçalho, rodapé, dados do app). `shared`: peças genéricas. `features`: uma pasta por funcionalidade.',
    'A regra: uma feature importa do `core`, do `shared` e dela mesma, nunca de outra feature.',
    'Quando duas features precisam da mesma peça, ela sobe para o `shared` ou para o `core`.',
    'Mova arquivos pelo VS Code, que atualiza os imports, e confira com `ng build` e `ng test`.',
  ],
  essentials: ['27/arvore', '27/etapa/src/app/app.routes.ts'],
  stage: '27-organizacao-por-funcionalidades',
  questions: [
    {
      prompt: 'A página do país quer mostrar o `CountryCard`, que mora em `features/countries`. O que fazer?',
      alternatives: [
        { text: 'Importar direto de `features/countries`: o Angular aceita.', explanation: 'Aceita, mas uma feature passaria a depender da outra.' },
        { text: 'Mover o cartão para o `shared` (ou para o `core`), e as duas features importam de lá.', correct: true, explanation: 'Isso: o que mais de uma feature usa sobe.' },
        { text: 'Copiar o cartão para dentro de `features/country-detail`.', explanation: 'Duas cópias divergem com o tempo; a peça deve existir uma vez só.' },
      ],
    },
    {
      prompt: 'Onde mora o cabeçalho do Passaporte?',
      alternatives: [
        { text: 'No `core`: é do app inteiro e aparece uma vez só.', correct: true, explanation: 'Isso: o App o usa em toda tela.' },
        { text: 'No `shared`: todo mundo vê o cabeçalho.', explanation: 'O `shared` é para peças genéricas, reutilizáveis em vários lugares.' },
        { text: 'Em `features/countries`, porque tem o link Países.', explanation: 'O cabeçalho não pertence a uma funcionalidade só.' },
      ],
    },
    {
      prompt: 'O que muda na tela depois da reorganização?',
      alternatives: [
        { text: 'As telas ficam mais rápidas, porque as pastas são menores.', explanation: 'O build não liga para os nomes das pastas; o tamanho do app é o mesmo.' },
        { text: 'Os endereços mudam para /features/countries.', explanation: 'Os endereços vêm das rotas, não das pastas.' },
        { text: 'Nada: a mudança é para quem lê e mantém o código.', correct: true, explanation: 'Isso: o app e os testes continuam iguais.' },
      ],
    },
  ],
  links: [
    { label: 'Guia de estilo do Angular', url: 'https://angular.dev/style-guide' },
    { label: 'Regra no-restricted-imports do ESLint', url: 'https://eslint.org/docs/latest/rules/no-restricted-imports' },
  ],
};
