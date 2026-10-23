import type { ChapterContent } from '../types';

export const CHAPTER_18: ChapterContent = {
  summary: [
    '`viewChild.required<ElementRef<HTMLInputElement>>(\'note\')` encontra o elemento `#note` do template.',
    'O resultado é um signal; `nativeElement` é o elemento de verdade, com `focus()`, `select()` e `value`.',
    'Passando a classe de um componente, `viewChild(WorldProgress)` devolve a instância dele.',
    'Use para o que só dá para fazer chamando o elemento; para o resto, prefira bindings, `@if`, inputs e outputs.',
  ],
  essentials: ['18/etapa/src/app/featured-country/featured-country.ts'],
  stage: '18-view-child',
  questions: [
    {
      prompt: 'Qual é o bom uso de `viewChild()`?',
      alternatives: [
        { text: 'Esconder um elemento mudando o `style.display` dele.', explanation: 'Para esconder, use `@if`; é declarativo e mais claro.' },
        { text: 'Dar foco a um campo depois de uma ação.', correct: true, explanation: 'Isso: só dá para fazer chamando o `focus()` do elemento.' },
        { text: 'Trocar o texto de um título pelo `textContent`.', explanation: 'Texto se muda com interpolação, e não mexendo no elemento.' },
      ],
    },
    {
      prompt: 'Por que `this.noteField().focus()` dá erro?',
      alternatives: [
        { text: 'Porque o `focus` é do elemento, que está em `nativeElement`.', correct: true, explanation: 'Isso: o `ElementRef` é um envelope; o elemento está dentro dele.' },
        { text: 'Porque campos de texto não aceitam foco pelo código.', explanation: 'Aceitam, sim; o problema é o caminho até o elemento.' },
        { text: 'Porque o `viewChild` só funciona com componentes, e não com elementos.', explanation: 'Funciona com os dois.' },
      ],
    },
    {
      prompt: 'O que o `.required` em `viewChild.required(...)` muda?',
      alternatives: [
        { text: 'Faz o campo ser obrigatório no formulário.', explanation: 'Não tem relação com validação de formulários.' },
        { text: 'Faz o Angular criar o elemento se ele não existir.', explanation: 'O Angular não cria elementos que o template não tem.' },
        { text: 'Garante que o resultado existe, e lê-lo sem valor vira o erro NG0951.', correct: true, explanation: 'Isso: sem `.required`, o resultado pode ser `undefined`.' },
      ],
    },
  ],
  links: [
    { label: 'Consultas a componentes (viewChild)', url: 'https://angular.dev/guide/components/queries' },
    { label: 'Erro NG0951', url: 'https://angular.dev/errors/NG0951' },
  ],
};
