import type { ChapterContent } from '../types';

export const CHAPTER_22: ChapterContent = {
  summary: [
    'Angular Material e PrimeNG entregam componentes completos, com visual e tema próprios.',
    'daisyUI é só CSS sobre o Tailwind; Angular Aria é só comportamento e acessibilidade; o Spartan copia o código do visual para o seu projeto.',
    'O PrimeNG 22 pede uma chave de licença: gratuita para estudantes e equipes pequenas, paga nas demais empresas.',
    'Antes de adotar, teste num projeto à parte e compare visual, código, tamanho e licença.',
  ],
  essentials: ['22/material-template', '22/daisy-card', '22/aria-template'],
  questions: [
    {
      prompt: 'O que uma biblioteca headless, como o Angular Aria, entrega?',
      alternatives: [
        { text: 'Componentes completos, com visual pronto e tema.', explanation: 'Esses são os componentes prontos, como os do Material.' },
        { text: 'O comportamento e a acessibilidade, sem nenhum visual.', correct: true, explanation: 'Isso: teclado, foco e papéis de acessibilidade; o visual é seu.' },
        { text: 'Só classes CSS, por cima do Tailwind.', explanation: 'Esse é o daisyUI.' },
      ],
    },
    {
      prompt: 'Onde fica o código do visual de um componente do Spartan?',
      alternatives: [
        { text: 'Dentro do seu projeto, copiado pelo CLI para a pasta `libs/ui`.', correct: true, explanation: 'Isso: o código é seu, e dá para mudar as classes à vontade.' },
        { text: 'Num pacote do npm, que não pode ser alterado.', explanation: 'No npm fica a parte de comportamento, a brain; o visual, a helm, é copiado.' },
        { text: 'Num servidor da Spartan, baixado quando o app abre.', explanation: 'Nada é baixado em tempo de execução; o código vai junto com o app.' },
      ],
    },
    {
      prompt: 'Ao pôr o daisyUI no Passaporte, o cabeçalho ficou roxo. Por quê?',
      alternatives: [
        { text: 'O daisyUI não funciona com o Angular 22.', explanation: 'Funciona: o cartão do capítulo foi feito com ele.' },
        { text: 'O Tailwind foi desinstalado pelo daisyUI.', explanation: 'O daisyUI é um plugin do Tailwind; ele precisa do Tailwind instalado.' },
        { text: 'O tema do daisyUI também define `--color-primary`, e passou por cima do token do Passaporte.', correct: true, explanation: 'Isso: com `themes: false` e um prefixo, as duas coisas convivem.' },
      ],
    },
  ],
  links: [
    { label: 'Angular Aria', url: 'https://angular.dev/guide/aria/overview' },
    { label: 'Angular Material', url: 'https://material.angular.dev' },
    { label: 'PrimeNG', url: 'https://primeng.dev' },
    { label: 'daisyUI', url: 'https://daisyui.com' },
    { label: 'Spartan', url: 'https://www.spartan.ng' },
  ],
};
