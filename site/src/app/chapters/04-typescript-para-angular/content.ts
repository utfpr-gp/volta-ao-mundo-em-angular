import type { ChapterContent } from '../types';

export const CHAPTER_04: ChapterContent = {
  summary: [
    'TypeScript é JavaScript com tipos; o compilador confere os tipos e os apaga, gerando JavaScript.',
    'Tipos básicos: `string`, `number`, `boolean` e arrays como `string[]`; muitos são deduzidos pelo valor inicial.',
    'Uma interface descreve o formato de um objeto; `?` marca uma propriedade opcional.',
    'Uniões como `\'visited\' | \'wishlist\'` só aceitam os valores listados.',
    'Componentes são classes; `@Component` é um decorator; `signal<number>` usa um genérico.',
  ],
  essentials: ['04/interface', '04/class'],
  questions: [
    {
      prompt: 'O que acontece com os tipos do TypeScript quando o app vai para o navegador?',
      alternatives: [
        { text: 'O navegador confere os tipos enquanto o app roda.', explanation: 'O navegador não entende TypeScript; quem confere é o compilador, antes.' },
        { text: 'Eles são conferidos pelo compilador e apagados, e o navegador recebe JavaScript comum.', correct: true, explanation: 'Isso: os tipos servem enquanto você escreve; o navegador nunca os vê.' },
        { text: 'Eles viram comentários no JavaScript.', explanation: 'Eles somem de vez, como você viu na saída do tsc.' },
      ],
    },
    {
      prompt: 'Na interface `Country`, o que quer dizer `rating?: number`?',
      alternatives: [
        { text: 'Que rating pode ser número ou texto.', explanation: 'Para aceitar texto, seria `number | string`. O `?` fala de outra coisa.' },
        { text: 'Que rating é obrigatório e começa vazio.', explanation: 'É o contrário: o `?` torna a propriedade opcional.' },
        { text: 'Que o objeto pode ter ou não ter rating; se tiver, é um número.', correct: true, explanation: 'Isso: um país desejado, por exemplo, ainda não tem nota.' },
      ],
    },
    {
      prompt: 'Com `type Status = \'visited\' | \'wishlist\'`, qual linha o TypeScript recusa?',
      alternatives: [
        { text: "`let s: Status = 'visitado';`", correct: true, explanation: 'Isso: só valem exatamente os textos do tipo. O compilador até sugere `visited`.' },
        { text: "`let s: Status = 'wishlist';`", explanation: 'Esse é um dos dois valores permitidos.' },
        { text: "`let s: Status = 'visited';`", explanation: 'Esse é um dos dois valores permitidos.' },
      ],
    },
    {
      prompt: 'Num componente Angular, o que é o `@Component({...})` em cima da classe?',
      alternatives: [
        { text: 'Um comentário especial que o Angular lê.', explanation: 'Não é comentário: é código, um decorator.' },
        { text: 'Um decorator: informações extras que transformam a classe num componente.', correct: true, explanation: 'Isso: sem ele, é só uma classe comum.' },
        { text: 'Uma interface que a classe precisa seguir.', explanation: 'Interfaces descrevem formatos de objetos; o `@` indica um decorator.' },
      ],
    },
    {
      prompt: 'Por que evitar `: any`?',
      alternatives: [
        { text: 'Porque deixa o app mais lento no navegador.', explanation: 'Os tipos somem antes de rodar; o `any` não muda a velocidade.' },
        { text: 'Porque é proibido no Angular.', explanation: 'Não é proibido; é desaconselhado, pelo motivo da outra alternativa.' },
        { text: 'Porque desliga a conferência de tipos, e os erros voltam a aparecer só no navegador.', correct: true, explanation: 'Isso: você perde exatamente a ajuda que o TypeScript dá.' },
      ],
    },
  ],
  links: [
    { label: 'TypeScript Playground', url: 'https://www.typescriptlang.org/pt/play' },
    { label: 'TypeScript para quem já sabe JavaScript', url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html' },
    { label: 'O manual do TypeScript', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
    { label: 'Guia de estilo do Angular', url: 'https://angular.dev/style-guide' },
    { label: 'Componentes no Angular', url: 'https://angular.dev/guide/components' },
  ],
};
