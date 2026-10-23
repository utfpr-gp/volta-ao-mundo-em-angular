import type { ChapterContent } from '../types';

export const CHAPTER_14: ChapterContent = {
  summary: [
    'Design tokens dão nome de papel aos valores visuais: `primary`, `surface`, `ink`, `highlight`.',
    'No Tailwind 4, os tokens ficam no `@theme` e viram classes: `--color-primary` gera `bg-primary`.',
    'No CSS dos componentes, use `var(--color-primary)`.',
    'Modo escuro: os mesmos tokens com outros valores, dentro de `@media (prefers-color-scheme: dark)`.',
    'Variáveis fora do `@theme` não geram classes.',
  ],
  essentials: ['14/etapa/src/styles.css'],
  stage: '14-design-tokens',
  questions: [
    {
      prompt: 'Qual nome de token é o melhor para a cor de fundo do app?',
      alternatives: [
        { text: '`--color-cream`, porque descreve exatamente a cor de fundo atual.', explanation: 'No modo escuro, o fundo deixa de ser creme, e o nome passa a mentir.' },
        { text: '`--color-surface`', correct: true, explanation: 'Isso: o nome diz o papel, e o valor pode mudar com o tema.' },
        { text: '`--color-fbf8f1`, o próprio código da cor.', explanation: 'Um nome que repete o valor não ajuda em nada quando o valor muda.' },
      ],
    },
    {
      prompt: 'Com `--color-primary` declarado no `@theme`, qual classe pinta o fundo de um elemento com ele?',
      alternatives: [
        { text: '`bg-primary`', correct: true, explanation: 'Isso: o Tailwind cria a classe a partir do nome do token.' },
        { text: '`bg-color-primary`', explanation: 'O prefixo `--color-` some no nome da classe.' },
        { text: '`bg-[--color-primary]`, com colchetes, porque o token é uma variável.', explanation: 'Não é preciso: tokens do `@theme` viram classes normais.' },
      ],
    },
    {
      prompt: 'Como o Passaporte troca para o modo escuro sem mudar nenhum componente?',
      alternatives: [
        { text: 'Cada componente verifica o tema e escolhe as próprias cores.', explanation: 'Nenhum componente sabe do tema; quem muda são os tokens.' },
        { text: 'O navegador inverte as cores automaticamente quando o sistema está escuro.', explanation: 'O navegador não inverte nada; é o CSS que define os valores.' },
        { text: 'Um bloco `@media (prefers-color-scheme: dark)` dá outros valores aos mesmos tokens.', correct: true, explanation: 'Isso: todo lugar que usa o token acompanha.' },
      ],
    },
    {
      prompt: 'Você declarou `--color-brand` dentro de `:root` e a classe `bg-brand` não pinta nada. Por quê?',
      alternatives: [
        { text: 'Porque o nome `brand` é reservado pelo Tailwind e não pode ser usado.', explanation: 'Não há nada de reservado em `brand`; o problema é onde o token foi declarado.' },
        { text: 'Porque o Tailwind só cria classes para tokens declarados no `@theme`.', correct: true, explanation: 'Isso: no `:root`, é só uma variável CSS comum.' },
        { text: 'Porque variáveis CSS não funcionam em projetos Angular.', explanation: 'Funcionam; o próprio `var(--color-brand)` funcionaria no CSS.' },
      ],
    },
  ],
  links: [
    { label: 'Tema e variáveis no Tailwind 4 (@theme)', url: 'https://tailwindcss.com/docs/theme' },
    { label: 'Modo escuro no Tailwind', url: 'https://tailwindcss.com/docs/dark-mode' },
    { label: 'prefers-color-scheme (MDN)', url: 'https://developer.mozilla.org/pt-BR/docs/Web/CSS/@media/prefers-color-scheme' },
    { label: 'Estilos de componentes no Angular', url: 'https://angular.dev/guide/components/styling' },
  ],
};
