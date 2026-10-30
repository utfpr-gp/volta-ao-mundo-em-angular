import type { ChapterContent } from '../types';

export const CHAPTER_35: ChapterContent = {
  summary: [
    'Cada campo do `group` recebe, ao lado do valor inicial, a lista das regras: `Validators.required`, `min`, `max`, `maxLength`, `pattern`.',
    'Um validador próprio é uma função que recebe o controle e devolve `null` (válido) ou um objeto com o nome do erro.',
    'No `Validators.pattern`, use uma regex com `^` e `$` e sem a flag `g`.',
    'A mensagem aparece quando o campo é inválido e já foi tocado; o `hasError` diz qual regra falhou.',
    'Com `[disabled]="form.invalid"`, o botão só liga quando tudo está certo, e um aviso diz o que falta.',
  ],
  essentials: [
    '35/etapa/src/app/features/passport/trip-form/trip-validators.ts',
    '35/etapa/src/app/features/passport/trip-form/trip-form.ts',
  ],
  stage: '35-validacao',
  questions: [
    {
      prompt: 'O campo "Com quem" usa `Validators.pattern(/[\\p{L} ]+/u)`, sem `^` e `$`. O que acontece com "Ana2"?',
      alternatives: [
        { text: 'Passa, porque a regex acha "Ana" dentro do texto.', correct: true, explanation: 'Isso: sem ^ e $, basta um pedaço combinar.' },
        { text: 'Falha, porque o 2 não é letra.', explanation: 'Seria assim com ^ e $, que obrigam o texto inteiro a combinar.' },
        { text: 'Dá erro de compilação.', explanation: 'A regex é válida; o problema é o que ela aceita.' },
      ],
    },
    {
      prompt: 'Um campo tem `[Validators.min(1), Validators.max(365)]` e a pessoa apaga o número. O campo fica…',
      alternatives: [
        { text: 'Inválido, com o erro `min`.', explanation: 'O min e o max não conferem campo vazio.' },
        { text: 'Válido, porque falta o `Validators.required`.', correct: true, explanation: 'Isso: o vazio é trabalho do required.' },
        { text: 'Com o valor 1, o mínimo.', explanation: 'O validador só confere; ele não muda o valor.' },
      ],
    },
    {
      prompt: 'O que um validador próprio devolve quando o valor está certo?',
      alternatives: [
        { text: '`true`.', explanation: 'Um validador não devolve booleano.' },
        { text: '`{}`, um objeto vazio.', explanation: 'Qualquer objeto, até o vazio, deixa o campo inválido.' },
        { text: '`null`.', correct: true, explanation: 'Isso: null quer dizer "nenhum erro".' },
      ],
    },
    {
      prompt: 'Por que a mensagem de erro espera o campo estar `touched`?',
      alternatives: [
        { text: 'Porque antes disso o Angular ainda não validou o campo.', explanation: 'O Angular valida desde o começo; o status já é INVALID.' },
        {
          text: 'Para não acusar um erro que a pessoa ainda nem teve a chance de cometer.',
          correct: true,
          explanation: 'Isso: a mensagem aparece quando ela sai do campo sem preencher.',
        },
        { text: 'Porque o `hasError` só funciona em campo tocado.', explanation: 'O hasError funciona sempre; o touched é uma escolha de quando mostrar.' },
      ],
    },
  ],
  links: [
    { label: 'Validação de formulários', url: 'https://angular.dev/guide/forms/form-validation' },
    { label: 'Validators', url: 'https://angular.dev/api/forms/Validators' },
    { label: 'Expressões regulares (MDN)', url: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_expressions' },
    { label: 'Mensagens de erro em formulários (W3C)', url: 'https://www.w3.org/WAI/tutorials/forms/notifications/' },
  ],
};
