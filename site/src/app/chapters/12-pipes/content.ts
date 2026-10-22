import type { ChapterContent } from '../types';

export const CHAPTER_12: ChapterContent = {
  summary: [
    'Um pipe formata um valor no template: `{{ valor | pipe: opcao }}`, sem mudar a classe.',
    'Prontos: `number`, `percent`, `currency`, `date`, `uppercase`, `titlecase`; cada um precisa estar no `imports`.',
    'Formato brasileiro: `registerLocaleData(localePt)` e `LOCALE_ID` igual a `pt-BR`.',
    'Pipe próprio: classe com `@Pipe` e um método `transform`; `ng generate pipe nome`.',
    'Pipes são puros por padrão: só recalculam quando o valor de entrada muda.',
  ],
  essentials: ['12/pipe-syntax', '12/etapa/src/app/flag-pipe.ts', '12/etapa/src/app/locale.ts'],
  stage: '12-pipes',
  questions: [
    {
      prompt: 'Com o idioma `pt-BR` configurado, o que `{{ 0.0513 | percent: \'1.0-2\' }}` mostra?',
      alternatives: [
        { text: '`0,0513%`, porque o pipe só acrescenta o símbolo.', explanation: 'O `percent` multiplica por 100 antes de mostrar.' },
        { text: '`5,13%`', correct: true, explanation: 'Isso: multiplica por 100, usa vírgula e até duas casas decimais.' },
        { text: '`5.13%`, com ponto, porque números sempre usam ponto.', explanation: 'Com `pt-BR`, o separador decimal é a vírgula.' },
      ],
    },
    {
      prompt: 'O template usa `| number` e apareceu o erro NG8004. O que falta?',
      alternatives: [
        { text: 'Pôr `DecimalPipe` no `imports` do componente.', correct: true, explanation: 'Isso: o nome no template é `number`, mas a classe é `DecimalPipe`.' },
        { text: 'Pôr `NumberPipe` no `imports`, porque o nome do pipe é `number`.', explanation: 'Não existe `NumberPipe`; a classe do pipe `number` se chama `DecimalPipe`.' },
        { text: 'Converter o valor para texto antes de usar o pipe.', explanation: 'O `number` recebe um número; o problema é o import.' },
      ],
    },
    {
      prompt: 'O que acontece com o valor na classe depois de passar por um pipe no template?',
      alternatives: [
        { text: 'Ele é trocado pelo valor formatado, para todo o componente.', explanation: 'O pipe não altera a classe; formata só o que vai para a tela.' },
        { text: 'Ele vira texto para sempre, e contas com ele deixam de funcionar.', explanation: 'A classe continua com o número original.' },
        { text: 'Nada: ele continua igual; só a tela mostra o valor formatado.', correct: true, explanation: 'Isso: como a água na chaleira, que não muda por causa do filtro.' },
      ],
    },
    {
      prompt: 'Qual é o método que todo pipe próprio precisa ter?',
      alternatives: [
        { text: '`format(valor)`, que formata o valor recebido.', explanation: 'O nome do método exigido é outro.' },
        { text: '`transform(valor)`', correct: true, explanation: 'Isso: o Angular chama o `transform` com o valor da esquerda da barra.' },
        { text: '`ngOnPipe(valor)`, como os outros ganchos do Angular.', explanation: 'Esse método não existe.' },
      ],
    },
  ],
  links: [
    { label: 'Pipes: visão geral', url: 'https://angular.dev/guide/templates/pipes' },
    { label: 'Criando pipes próprios', url: 'https://angular.dev/guide/templates/pipes#creating-custom-pipes' },
    { label: 'Internacionalização: definindo o idioma', url: 'https://angular.dev/guide/i18n/locale-id' },
    { label: 'Referência do DatePipe (formatos de data)', url: 'https://angular.dev/api/common/DatePipe' },
  ],
};
