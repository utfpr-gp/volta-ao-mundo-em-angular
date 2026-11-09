import type { ChapterContent } from '../types';

export const CHAPTER_44: ChapterContent = {
  summary: [
    'O leitor de tela lê a árvore de acessibilidade: cada elemento tem papel, nome e, às vezes, estado.',
    'HTML que diz o que é: `button`, `h1`, `h2`. Um `h1` por página, mesmo que só para o leitor de tela (`sr-only`).',
    'Nada só pela cor: o estado vai na árvore (`aria-selected`, `aria-pressed`), e o visual deriva dele.',
    'Numa SPA, leve o foco ao título da página nova no `NavigationEnd`; e ofereça um "Pular para o conteúdo".',
    'Texto com contraste de 4,5:1 nos dois modos; o Angular Aria dá papéis, estados e teclado prontos.',
  ],
  essentials: ['44/etapa/src/app/core/page-focus.ts', '44/etapa/src/app/features/countries/country-list/country-list.html'],
  stage: '44-acessibilidade',
  questions: [
    {
      prompt: 'O filtro pinta de dourado a opção escolhida. O que falta para quem usa leitor de tela?',
      alternatives: [
        { text: 'Nada: o leitor de tela anuncia a cor.', explanation: 'O leitor de tela lê papel, nome e estado; a cor não está na árvore.' },
        {
          text: 'Um estado na árvore de acessibilidade, como o `aria-selected` da opção escolhida.',
          correct: true,
          explanation: 'Isso: com o ngListbox, a opção ganha aria-selected, e o dourado passa a depender dele.',
        },
        { text: 'Um texto alternativo no dourado.', explanation: 'Uma cor de fundo não tem texto alternativo: o que falta é o estado.' },
      ],
    },
    {
      prompt: 'Qual destes nomes é o melhor para o botão "Visitar" do cartão do Japão?',
      alternatives: [
        { text: '"Visitar".', explanation: 'É o que havia: 195 botões iguais, sem dizer qual país.' },
        {
          text: '"Visitar Japão", com o texto visível no começo.',
          correct: true,
          explanation: 'Isso: diz qual país, e quem usa comando de voz ainda pode dizer "Visitar".',
        },
        { text: '"Marcar o Japão como país visitado no passaporte".', explanation: 'Diz qual país, mas não contém o texto visível "Visitar": o comando de voz não acha o botão.' },
      ],
    },
    {
      prompt: 'Por que o "Pular para o conteúdo" do Passaporte é um botão, e não um `<a href="#conteudo">`?',
      alternatives: [
        { text: 'Porque links não recebem foco pelo teclado.', explanation: 'Links recebem foco, sim.' },
        {
          text: 'Porque o `<base href="/">` faz o `#conteudo` virar `/#conteudo`, e a pessoa sai da página.',
          correct: true,
          explanation: 'Isso: em /sobre, o link levava a /paises#conteudo.',
        },
        { text: 'Porque botões são mais bonitos.', explanation: 'O visual é o mesmo; a diferença é para onde o link levaria.' },
      ],
    },
    {
      prompt: 'Depois de navegar, o Passaporte leva o foco ao `h1` da página nova. Por que não nas abas do país?',
      alternatives: [
        {
          text: 'Porque quem trocou de aba quer continuar nas abas; e a página, o país, é a mesma.',
          correct: true,
          explanation: 'Isso: o pageOf trata /paises/JP/clima e /paises/JP/anotacoes como a mesma página.',
        },
        { text: 'Porque as abas não disparam o NavigationEnd.', explanation: 'Disparam: cada aba é uma rota filha. A decisão é do código.' },
        { text: 'Porque a página do país não tem h1.', explanation: 'Tem: o nome do país.' },
      ],
    },
  ],
  links: [
    { label: 'Acessibilidade no Angular', url: 'https://angular.dev/best-practices/a11y' },
    { label: 'Angular Aria', url: 'https://angular.dev/guide/aria/overview' },
    { label: 'Listbox (Angular Aria)', url: 'https://angular.dev/guide/aria/listbox' },
    { label: 'WCAG 2.2, referência rápida (W3C)', url: 'https://www.w3.org/WAI/WCAG22/quickref/' },
    { label: 'Acessibilidade (MDN)', url: 'https://developer.mozilla.org/pt-BR/docs/Web/Accessibility' },
  ],
};
