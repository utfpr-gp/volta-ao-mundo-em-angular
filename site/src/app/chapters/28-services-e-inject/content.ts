import type { ChapterContent } from '../types';

export const CHAPTER_28: ChapterContent = {
  summary: [
    'Um service guarda dados e lógica do app inteiro; com `@Service()`, existe um objeto só, para todos.',
    'Os componentes pedem o service com `inject()`, num campo da classe, e nunca com `new`.',
    'O estado fica em signals privados; para fora, `asReadonly()`; para mudar, métodos do service.',
    'O que é só da tela (o filtro escolhido, o texto sendo digitado) pode continuar no componente.',
  ],
  essentials: ['28/etapa/src/app/core/passport.ts', '28/etapa/src/app/features/countries/country-list/country-list.ts'],
  stage: '28-services-e-inject',
  questions: [
    {
      prompt: 'A lista e o placar fazem `inject(Passport)`. O que cada um recebe?',
      alternatives: [
        { text: 'O mesmo objeto: o que um muda, o outro vê.', correct: true, explanation: 'Isso: com `@Service()`, há um Passport só para o app inteiro.' },
        { text: 'Um objeto novo cada um, como com `new`.', explanation: 'Isso aconteceria com `new` ou com o service nos `providers` do componente.' },
        { text: 'Uma cópia dos dados, que não muda mais.', explanation: 'Não é cópia: é o próprio service, com os signals dele.' },
      ],
    },
    {
      prompt: 'Por que o service expõe `countries` com `asReadonly()`?',
      alternatives: [
        { text: 'Para o app ficar mais rápido.', explanation: 'A velocidade é a mesma; o motivo é proteger o estado.' },
        { text: 'Para toda mudança passar pelos métodos do service, e ninguém dar `set` por fora.', correct: true, explanation: 'Isso: um lugar só muda os dados.' },
        { text: 'Porque signals de services não podem ser escritos.', explanation: 'Podem: o service escreve no signal privado dele.' },
      ],
    },
    {
      prompt: 'Onde chamar `inject(Passport)` num componente?',
      alternatives: [
        { text: 'Dentro do método do clique, na hora de usar.', explanation: 'Fora de um contexto de injeção, o Angular lança o NG0203.' },
        { text: 'No template, com `inject(Passport).countries()`.', explanation: 'O template só enxerga o que a classe expõe.' },
        { text: 'Num campo da classe: `private readonly passport = inject(Passport)`.', correct: true, explanation: 'Isso: na inicialização dos campos, o Angular sabe a quem entregar.' },
      ],
    },
  ],
  links: [
    { label: 'Criar e usar services', url: 'https://angular.dev/guide/di/creating-and-using-services' },
    { label: 'Injeção de dependência no Angular', url: 'https://angular.dev/guide/di' },
  ],
};
