import type { ChapterContent } from '../types';

export const CHAPTER_09: ChapterContent = {
  summary: [
    '`signal(valor)` cria o estado; `nome()` lê; `set` troca; `update` calcula a partir do atual.',
    '`computed(() => ...)` deriva um valor de outros signals e se recalcula sozinho.',
    'No template, signals e computed são lidos com parênteses: `{{ percent() }}`.',
    'O Angular anota quem depende de quem e atualiza só o que mudou.',
    'Computed não tem `set`; para mudar, mude o signal de que ele depende.',
  ],
  essentials: ['09/signal-basics', '09/etapa/src/app/world-progress/world-progress.ts'],
  stage: '09-signals',
  questions: [
    {
      prompt: 'Com `const visited = signal(2)`, como se lê o valor?',
      alternatives: [
        { text: '`visited.value`, como nas propriedades de um objeto.', explanation: 'Um signal do Angular não tem `.value`; ele é uma função.' },
        { text: '`visited()`', correct: true, explanation: 'Isso: o signal é uma função, e chamá-la devolve o valor atual.' },
        { text: '`visited.get()`, como nas classes de outras linguagens.', explanation: 'Não existe `get` no signal do Angular; basta chamá-lo.' },
      ],
    },
    {
      prompt: 'Qual linha soma 1 ao signal `visited`?',
      alternatives: [
        { text: '`visited++`', explanation: 'Um signal não é um número; `++` não funciona.' },
        { text: '`visited = visited() + 1`', explanation: 'Isso tentaria trocar o signal inteiro por um número, e não o valor dentro dele.' },
        { text: '`visited.update((n) => n + 1)`', correct: true, explanation: 'Isso: `update` calcula o valor novo a partir do atual.' },
      ],
    },
    {
      prompt: 'O `percent` é `computed(() => visited() / 195 * 100)`. O que acontece quando `visited` muda?',
      alternatives: [
        { text: 'O `percent` passa a valer o resultado novo, sem você escrever nada.', correct: true, explanation: 'Isso: o computed lê `visited()`, e o Angular sabe que precisa recalcular.' },
        { text: 'Nada, até você chamar `percent.set(...)` com o valor novo.', explanation: 'Computed não tem `set`; ele se recalcula sozinho.' },
        { text: 'O app recarrega a página para recalcular tudo.', explanation: 'Nada recarrega: só o que depende de `visited` é atualizado.' },
      ],
    },
    {
      prompt: 'No simulador, por que mudar o nome não fez o `percent` recalcular?',
      alternatives: [
        { text: 'Porque o simulador estava com defeito naquele momento.', explanation: 'Esse é exatamente o comportamento esperado dos signals.' },
        { text: 'Porque o `percent` não lê `name()`, então não depende dele.', correct: true, explanation: 'Isso: o Angular só recalcula o que depende do que mudou.' },
        { text: 'Porque textos nunca fazem um computed recalcular.', explanation: 'O tipo não importa: um computed que lesse `name()` recalcularia.' },
      ],
    },
    {
      prompt: 'No template, `{{ visitedCount }}`, sem parênteses, mostra…',
      alternatives: [
        { text: 'o número, normalmente, porque os parênteses são opcionais.', explanation: 'Sem parênteses, o template recebe o signal, e não o valor.' },
        { text: 'algo como `[Signal: 2]`, e o Angular avisa com NG8109.', correct: true, explanation: 'Isso: falta chamar o signal: `visitedCount()`.' },
        { text: 'um erro que impede o app de compilar.', explanation: 'É só um aviso; o app compila, mas mostra o texto errado.' },
      ],
    },
  ],
  links: [
    { label: 'Guia de signals', url: 'https://angular.dev/guide/signals' },
    { label: 'Tutorial interativo de signals', url: 'https://angular.dev/tutorials/signals' },
    { label: 'Aviso NG8109', url: 'https://angular.dev/extended-diagnostics/NG8109' },
    { label: 'Reatividade com signals, em detalhes', url: 'https://angular.dev/guide/signals#computed-signals' },
  ],
};
