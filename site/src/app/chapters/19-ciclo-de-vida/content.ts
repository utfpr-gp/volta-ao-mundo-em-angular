import type { ChapterContent } from '../types';

export const CHAPTER_19: ChapterContent = {
  summary: [
    'Um componente é criado (`constructor`), inicializado (`ngOnInit`, já com os inputs) e destruído quando sai da tela.',
    'O que o componente liga ao nascer, ele desliga ao ser destruído: `inject(DestroyRef).onDestroy(...)`.',
    'Intervalo sem limpeza continua rodando: é um vazamento de memória.',
    '`afterNextRender` roda depois que a tela foi atualizada, só no navegador.',
  ],
  essentials: ['19/etapa/src/app/local-clock/local-clock.ts'],
  stage: '19-ciclo-de-vida',
  questions: [
    {
      prompt: 'Onde ligar um relógio que depende do fuso recebido por input?',
      alternatives: [
        { text: 'No `constructor`, porque ele roda primeiro.', explanation: 'No constructor, os inputs ainda não chegaram.' },
        { text: 'No `ngOnInit`, quando os inputs já chegaram.', correct: true, explanation: 'Isso: é o momento de começar trabalhos que dependem dos inputs.' },
        { text: 'No template, com um `setInterval` dentro de uma interpolação.', explanation: 'O template não é lugar para ligar temporizadores.' },
      ],
    },
    {
      prompt: 'O que acontece se o componente liga um `setInterval` e não o desliga?',
      alternatives: [
        { text: 'O Angular desliga sozinho quando o componente some.', explanation: 'O Angular não sabe do seu intervalo; desligar é com você.' },
        { text: 'O app dá erro e para de funcionar na hora.', explanation: 'Não há erro: o intervalo continua rodando, em silêncio.' },
        { text: 'O intervalo continua rodando depois que o componente some.', correct: true, explanation: 'Isso: um vazamento de memória.' },
      ],
    },
    {
      prompt: 'Como o relógio desliga o intervalo ao ser destruído?',
      alternatives: [
        { text: 'Registrando `clearInterval` no `onDestroy` do `DestroyRef`.', correct: true, explanation: 'Isso: o Angular chama o que foi registrado quando o componente sai.' },
        { text: 'Chamando `clearInterval` no `ngOnInit`, logo depois de ligar.', explanation: 'Assim o relógio pararia logo depois de começar.' },
        { text: 'Pondo o relógio dentro de um `@if`, que limpa tudo sozinho.', explanation: 'O `@if` destrói o componente, mas o intervalo é seu; precisa ser desligado.' },
      ],
    },
  ],
  links: [
    { label: 'Ciclo de vida de componentes', url: 'https://angular.dev/guide/components/lifecycle' },
    { label: 'DestroyRef', url: 'https://angular.dev/api/core/DestroyRef' },
    { label: 'Intl.DateTimeFormat (MDN)', url: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat' },
  ],
};
