import type { ChapterContent } from '../types';

export const CHAPTER_20: ChapterContent = {
  summary: [
    'Mobile-first: as classes sem prefixo são o celular; `sm:`, `md:`, `lg:` acrescentam mudanças a partir de 640, 768 e 1024 px.',
    'Grid para a página, com `md:grid-cols-...`; flexbox para enfileirar itens numa direção.',
    'No celular, os links viram um botão de menu: `md:hidden` no botão, `hidden md:flex` nos links.',
    'No CSS do componente, a mesma ideia: `@media (min-width: ...)`.',
  ],
  essentials: ['20/etapa/src/app/app.html', '20/etapa/src/app/header/header.html'],
  stage: '20-layout-responsivo',
  questions: [
    {
      prompt: 'O que a classe `md:grid-cols-2` faz?',
      alternatives: [
        { text: 'Duas colunas só em telas médias, entre 768 e 1023 px.', explanation: 'O prefixo não tem fim: vale de 768 px para cima, inclusive nas telas grandes.' },
        { text: 'Duas colunas a partir de 768 px de largura.', correct: true, explanation: 'Isso: o prefixo diz a partir de que largura a classe vale.' },
        { text: 'Duas colunas até 768 px, e uma coluna depois.', explanation: 'É o contrário: abaixo de 768 px vale a classe sem prefixo.' },
      ],
    },
    {
      prompt: 'O botão de menu deve aparecer só no celular. Qual classe ele recebe?',
      alternatives: [
        { text: '`hidden md:block`', explanation: 'Assim o botão some no celular e aparece no computador: o contrário.' },
        { text: '`sm:hidden lg:block`', explanation: 'Some a partir de 640 px e volta a partir de 1024 px: aparece no computador.' },
        { text: '`md:hidden`', correct: true, explanation: 'Isso: visível sem prefixo, no celular, e escondido a partir de 768 px.' },
      ],
    },
    {
      prompt: 'Num cartão com `display: flex`, um campo de texto passa da borda no celular. O que resolve?',
      alternatives: [
        { text: 'Dar `min-width: 0` ao filho do flex, ou empilhar os itens no celular.', correct: true, explanation: 'Isso: sem o `min-width: 0`, o filho não encolhe abaixo do conteúdo.' },
        { text: 'Dar uma largura fixa de 500 px ao cartão.', explanation: 'Largura fixa piora: a página inteira passa a rolar para o lado.' },
        { text: 'Apagar a linha do viewport do `index.html`.', explanation: 'Sem ela, o celular encolhe a página inteira; o problema continua lá.' },
      ],
    },
  ],
  links: [
    { label: 'Estilos de componentes', url: 'https://angular.dev/guide/components/styling' },
    { label: 'Design responsivo no Tailwind', url: 'https://tailwindcss.com/docs/responsive-design' },
    { label: 'Usando media queries (MDN)', url: 'https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_media_queries/Using_media_queries' },
    { label: 'Learn Responsive Design (web.dev)', url: 'https://web.dev/learn/design' },
  ],
};
