import type { ChapterContent } from '../types';

export const CHAPTER_21: ChapterContent = {
  summary: [
    'Antes de codificar, faça o inventário: átomos, moléculas e organismos. Vira componente o que se repete ou tem variantes.',
    'Auto layout é flexbox; variante é `input()`; variável do Figma é design token.',
    'Cada cor e medida do protótipo vira um token ou um passo da escala do Tailwind, nunca um valor solto.',
    'Construa de baixo para cima: o átomo primeiro, o organismo por último.',
  ],
  essentials: ['21/etapa/src/app/stamp/stamp.html', '21/etapa/src/app/stamp-book/stamp-book.html'],
  stage: '21-do-prototipo-ao-componente',
  questions: [
    {
      prompt: 'No Figma, o componente Carimbo tem a variante "Carimbado: sim / não". O que ela vira no Angular?',
      alternatives: [
        { text: 'Dois componentes diferentes, um para cada valor.', explanation: 'É o mesmo componente com duas aparências; dois componentes duplicariam o código.' },
        { text: 'Um `input()` do componente, como `stamped`.', correct: true, explanation: 'Isso: quem usa o carimbo escolhe a variante passando o valor.' },
        { text: 'Um design token no `@theme`.', explanation: 'Tokens guardam valores como cores e fontes; a variante é um estado do componente.' },
      ],
    },
    {
      prompt: 'O auto layout de um frame é vertical, centralizado, com espaço de 8 px e margem de 12 px. Quais classes ele vira?',
      alternatives: [
        { text: '`flex flex-col items-center gap-2 p-3`', correct: true, explanation: 'Isso: na escala do Tailwind, cada unidade vale 4 px.' },
        { text: '`flex items-center gap-8 p-12`', explanation: 'Falta a direção vertical, e os números são unidades de 4 px, não pixels.' },
        { text: '`grid grid-cols-1 gap-[8px] p-[12px]`', explanation: 'Os colchetes copiam os pixels; a escala do Tailwind já tem esses valores.' },
      ],
    },
    {
      prompt: 'Uma camada do protótipo só arruma os cartões numa grade. Ela vira componente?',
      alternatives: [
        { text: 'Sim: toda camada do Figma vira um componente.', explanation: 'Assim o projeto se enche de componentes de uma linha que não se repetem.' },
        { text: 'Sim, mas só se tiver um nome em português.', explanation: 'O nome da camada não decide nada.' },
        { text: 'Não: ela fica no template de quem a usa, como um elemento com `grid`.', correct: true, explanation: 'Isso: vira componente o que se repete ou tem variantes.' },
      ],
    },
  ],
  links: [
    { label: 'Inputs de componentes', url: 'https://angular.dev/guide/components/inputs' },
    { label: 'Auto layout no Figma', url: 'https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout' },
    { label: 'Variantes no Figma', url: 'https://help.figma.com/hc/en-us/articles/360056440594-Create-and-use-variants' },
    { label: 'Figma para estudantes', url: 'https://www.figma.com/education/' },
  ],
};
