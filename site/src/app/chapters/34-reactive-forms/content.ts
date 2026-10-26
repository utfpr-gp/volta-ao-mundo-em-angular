import type { ChapterContent } from '../types';

export const CHAPTER_34: ChapterContent = {
  summary: [
    'Nos Reactive Forms, o formulário é um `FormGroup` na classe, com um `FormControl` para cada campo e o seu valor inicial.',
    '`[formGroup]` liga o `<form>` ao modelo; `formControlName` liga cada campo; `(ngSubmit)` é o envio, sem recarregar a página.',
    'Com o `NonNullableFormBuilder`, os tipos vêm dos valores iniciais e o `reset()` volta a eles.',
    '`getRawValue()` entrega um objeto com todos os campos, pronto para ir ao service.',
  ],
  essentials: ['34/etapa/src/app/features/passport/trip-form/trip-form.ts', '34/etapa/src/app/features/passport/trip-form/trip-form.html'],
  stage: '34-reactive-forms',
  questions: [
    {
      prompt: 'Onde fica o modelo de um formulário com Reactive Forms?',
      alternatives: [
        { text: 'No HTML, com `[(ngModel)]` em cada campo.', explanation: 'Esses são os formulários template-driven.' },
        { text: 'Na classe, num `FormGroup` com um `FormControl` por campo.', correct: true, explanation: 'Isso: o HTML só liga os campos ao modelo.' },
        { text: 'No service, que guarda os valores digitados.', explanation: 'O service recebe a viagem pronta, no envio.' },
      ],
    },
    {
      prompt: 'O que o `reset()` faz num formulário criado com o `NonNullableFormBuilder`?',
      alternatives: [
        { text: 'Põe `null` em todos os campos.', explanation: 'Isso acontece com o FormBuilder comum.' },
        { text: 'Volta cada campo ao seu valor inicial.', correct: true, explanation: 'Isso: 7 dias, de avião, hoje.' },
        { text: 'Apaga o formulário da tela.', explanation: 'Ele só limpa os valores e o estado.' },
      ],
    },
    {
      prompt: 'O campo de dias tem `type="text"`. O que chega ao `getRawValue().days` quando se digita 12?',
      alternatives: [
        { text: 'O texto "12".', correct: true, explanation: 'Isso: o campo de texto entrega texto, mesmo com o FormControl criado com um número.' },
        { text: 'O número 12, porque o FormControl é do tipo number.', explanation: 'O tipo do TypeScript não converte nada; quem converte é o type="number".' },
        { text: 'Um erro, porque o tipo não bate.', explanation: 'Não há erro: é justamente por isso que é perigoso.' },
      ],
    },
  ],
  links: [
    { label: 'Reactive Forms', url: 'https://angular.dev/guide/forms/reactive-forms' },
    { label: 'Formulários tipados', url: 'https://angular.dev/guide/forms/typed-forms' },
  ],
};
