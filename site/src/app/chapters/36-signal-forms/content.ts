import type { ChapterContent } from '../types';

export const CHAPTER_36: ChapterContent = {
  summary: [
    'O modelo do formulário é um `signal` comum; o `form()` cria, a partir dele, um campo para cada propriedade.',
    'O formulário não guarda cópia: digitar num campo muda o signal, e mudar o signal muda o campo.',
    'As regras e as frases de erro ficam juntas no schema: `required(path.days, { message: \'…\' })`.',
    '`[formField]` liga um campo do HTML ao formulário, e `[formRoot]` liga o `<form>` ao envio.',
    '`tripForm.days` é o campo; `tripForm.days()` é o estado dele: `value()`, `valid()`, `touched()`, `errors()`.',
  ],
  essentials: [
    '36/etapa/src/app/features/passport/trip-form/trip-form.ts',
    '36/etapa/src/app/features/passport/trip-form/trip-validators.ts',
  ],
  stage: '36-signal-forms',
  questions: [
    {
      prompt: 'Com `tripForm = form(trip)`, a pessoa digita 12 no campo de dias. O que acontece com o signal `trip`?',
      alternatives: [
        { text: 'Passa a valer `{ …, days: 12 }`.', correct: true, explanation: 'Isso: o form() escreve direto no signal que recebeu.' },
        { text: 'Nada, até alguém chamar `getRawValue()`.', explanation: 'Isso é dos Reactive Forms, que guardam o valor no FormGroup.' },
        { text: 'Nada, até o formulário ser enviado.', explanation: 'O envio não copia nada: o signal já está atualizado a cada tecla.' },
      ],
    },
    {
      prompt: 'O que vai no `[formField]` do campo de dias?',
      alternatives: [
        { text: '`tripForm.days`', correct: true, explanation: 'Isso: o campo, sem parênteses.' },
        { text: '`tripForm.days()`', explanation: 'Com parênteses é o estado do campo, e o compilador recusa (TS2322).' },
        { text: '`trip().days`', explanation: 'Isso é só o número 7: o [formField] precisa do campo do formulário.' },
      ],
    },
    {
      prompt: 'O campo de dias tem `min(path.days, 1)`. Por que escrever `min="1"` no `<input>` dá o erro NG8022?',
      alternatives: [
        { text: 'Porque o `[formField]` já põe o `min` no HTML a partir do schema.', correct: true, explanation: 'Isso: a regra fica num lugar só.' },
        { text: 'Porque campo de número não aceita `min`.', explanation: 'Aceita; quem escreve o atributo agora é o [formField].' },
        { text: 'Porque o `min` precisa vir entre colchetes.', explanation: 'Com [min] o erro é o mesmo: Binding to \'[min]\' is not allowed.' },
      ],
    },
    {
      prompt: 'A pessoa tenta enviar o formulário com o país em branco. O que o `submit()` faz?',
      alternatives: [
        { text: 'Envia assim mesmo e deixa o servidor reclamar.', explanation: 'O action só roda quando todas as regras passam.' },
        {
          text: 'Marca os campos como tocados, não roda o action e devolve `false`.',
          correct: true,
          explanation: 'Isso: com os campos tocados, as mensagens aparecem.',
        },
        { text: 'Apaga o formulário.', explanation: 'Quem volta ao começo é o reset(), e só quando você chama.' },
      ],
    },
  ],
  links: [
    { label: 'Signal Forms: visão geral', url: 'https://angular.dev/guide/forms/signals/overview' },
    { label: 'Validação com Signal Forms', url: 'https://angular.dev/guide/forms/signals/validation' },
    { label: 'Envio do formulário', url: 'https://angular.dev/guide/forms/signals/form-submission' },
    { label: 'Signal, Reactive e template-driven comparados', url: 'https://angular.dev/guide/forms/signals/comparison' },
  ],
};
