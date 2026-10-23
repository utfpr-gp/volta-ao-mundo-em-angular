import type { ChapterContent } from '../types';

export const CHAPTER_33: ChapterContent = {
  summary: [
    '`effect(() => ...)` roda de novo sempre que um signal lido dentro dele muda; serve para efeitos fora do Angular, como gravar no `localStorage`.',
    'O effect roda depois, uma vez por rodada: três mudanças seguidas viram uma execução, com o último valor.',
    'Para um valor calculado a partir de signals, `computed`: ele está sempre certo; um signal copiado por effect fica atrasado.',
    'Um effect não deve escrever nos signals que lê: o app entra num laço e trava.',
  ],
  essentials: ['33/etapa/src/app/core/passport.ts'],
  stage: '33-effect',
  questions: [
    {
      prompt: 'O placar precisa do número de países visitados. O que usar?',
      alternatives: [
        { text: 'Um signal, atualizado por um effect sempre que o passaporte mudar.', explanation: 'Funciona, mas o valor chega atrasado e o código fica maior.' },
        { text: 'Um `computed` que conta os visitados.', correct: true, explanation: 'Isso: é um valor calculado a partir de outro.' },
        { text: 'Um `setInterval` que recalcula a cada segundo.', explanation: 'Recalcularia à toa e ainda ficaria atrasado.' },
      ],
    },
    {
      prompt: 'O signal muda três vezes seguidas, no mesmo clique. Quantas vezes o effect que o lê roda?',
      alternatives: [
        { text: 'Três, uma para cada mudança.', explanation: 'O effect espera a rodada terminar.' },
        { text: 'Nenhuma: mudanças rápidas são ignoradas.', explanation: 'O último valor sempre chega ao effect.' },
        { text: 'Uma, com o último valor.', correct: true, explanation: 'Isso: o effect roda depois, uma vez por rodada.' },
      ],
    },
    {
      prompt: 'Qual destes é um bom uso para `effect`?',
      alternatives: [
        { text: 'Gravar o passaporte no `localStorage` quando ele muda.', correct: true, explanation: 'Isso: um efeito fora do Angular, que reage a um signal.' },
        { text: 'Calcular a porcentagem do mundo já visitada.', explanation: 'Isso é um valor: computed.' },
        { text: 'Marcar um país quando a pessoa clica em Visitar.', explanation: 'Isso é a reação a um clique: um método.' },
      ],
    },
  ],
  links: [
    { label: 'Effects', url: 'https://angular.dev/guide/signals/effect' },
    { label: 'localStorage (MDN)', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage' },
  ],
};
