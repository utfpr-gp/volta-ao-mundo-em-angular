import type { ChapterContent } from '../types';

export const CHAPTER_08: ChapterContent = {
  summary: [
    'Event binding, com `( )`, chama um método da classe quando algo acontece na tela: `(click)="toggleVisited()"`.',
    'O ciclo: o evento sobe e muda a classe; a interpolação desce e mostra o valor novo.',
    'Uma variável de template, como `#note`, dá nome a um elemento; `note.value` é o texto do campo.',
    'Filtros de tecla, como `(keydown.enter)`, só chamam o método naquela tecla.',
    'Sem os parênteses, `(click)="metodo"` não chama nada; o Angular avisa com NG8111.',
  ],
  essentials: ['08/button', '08/note'],
  stage: '08-event-binding',
  questions: [
    {
      prompt: 'Qual linha chama `toggleVisited()` quando o botão é clicado?',
      alternatives: [
        { text: '`<button [click]="toggleVisited()">`', explanation: 'Colchetes são para dar valor a propriedades; eventos usam parênteses.' },
        { text: '`<button onclick="toggleVisited()">`', explanation: 'Esse é o atributo do HTML puro; ele não enxerga os métodos da classe do componente.' },
        { text: '`<button (click)="toggleVisited()">`', correct: true, explanation: 'Isso: parênteses em volta do nome do evento.' },
      ],
    },
    {
      prompt: 'Com `<input #note (input)="onType(note.value)">`, o que o método `onType` recebe?',
      alternatives: [
        { text: 'O texto que está no campo naquele momento.', correct: true, explanation: 'Isso: `note` é o próprio campo, e `value` é o texto dele.' },
        { text: 'A palavra "note", porque é o nome da variável.', explanation: '`note` é o elemento, e não um texto; `note.value` é o conteúdo digitado.' },
        { text: 'Só a última letra digitada, sem as anteriores.', explanation: '`value` é o texto inteiro do campo, não só a última tecla.' },
      ],
    },
    {
      prompt: 'Para salvar a anotação só quando a pessoa aperta Enter, qual evento usar?',
      alternatives: [
        { text: '`(input)`, que dispara a cada letra digitada.', explanation: 'Esse dispara a cada letra; salvaria o tempo todo.' },
        { text: '`(keydown.enter)`', correct: true, explanation: 'Isso: o `.enter` filtra o evento só para a tecla Enter.' },
        { text: '`(click)`, porque o Enter conta como um clique em qualquer campo.', explanation: 'Num campo de texto, o Enter não vira clique; use o filtro de tecla.' },
      ],
    },
    {
      prompt: 'Depois do clique, por que o texto do botão muda de "Marcar como visitado" para "Visitado ✓"?',
      alternatives: [
        { text: 'Porque o navegador troca o texto de botões clicados sozinho.', explanation: 'O navegador não sabe nada do texto; quem decide é o template.' },
        { text: 'Porque o método mudou `visited` na classe, e a interpolação mostra o valor novo.', correct: true, explanation: 'Isso: o evento sobe, a classe muda, a interpolação desce.' },
        { text: 'Porque o `(click)` reescreve o template inteiro a cada clique.', explanation: 'O template não é reescrito; só o trecho que depende de `visited` mostra o valor novo.' },
      ],
    },
  ],
  links: [
    { label: 'Adicionando event listeners', url: 'https://angular.dev/guide/templates/event-listeners' },
    { label: 'Variáveis no template (#referência)', url: 'https://angular.dev/guide/templates/variables' },
    { label: 'Aviso NG8111', url: 'https://angular.dev/extended-diagnostics/NG8111' },
    { label: 'Referência de eventos do navegador (MDN)', url: 'https://developer.mozilla.org/pt-BR/docs/Web/Events' },
  ],
};
