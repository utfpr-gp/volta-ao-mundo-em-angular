import type { ChapterContent } from '../types';

export const CHAPTER_42: ChapterContent = {
  summary: [
    'Um arquivo `.spec.ts` agrupa testes com `describe`; cada `it` é um teste, e o `expect` confere. O `ng test` roda tudo com o Vitest.',
    'Desenho de quase todo teste: preparar (Arrange), agir (Act) e conferir (Assert).',
    'Vermelho, verde, refatorar: o teste primeiro diz o que falta, o mínimo de código o faz passar, e os testes protegem a melhoria.',
    'Componente: `TestBed.createComponent`, uma ação, `await fixture.whenStable()` e a leitura do HTML.',
    'HTTP: `provideHttpClientTesting()` troca a rede, e o `HttpTestingController` responde com `expectOne` e `flush`.',
  ],
  essentials: ['42/trip-stats.spec', '42/service-no-teste'],
  stage: '42-testes-com-vitest',
  questions: [
    {
      prompt: 'Com a `tripStats` devolvendo só zeros, dois dos cinco testes passaram. O que isso ensina?',
      alternatives: [
        { text: 'Que esses dois testes estão errados e devem sair.', explanation: 'Eles conferem casos reais (diário vazio, empate); só não bastam sozinhos.' },
        {
          text: 'Que um teste passando não prova nada sozinho: é o conjunto que pega os defeitos.',
          correct: true,
          explanation: 'Isso: a mentira acerta por acaso o que esperava zero e null. Os outros três é que a desmascaram.',
        },
        { text: 'Que o Vitest tem um erro.', explanation: 'O Vitest fez a conta certa: o valor era mesmo zero.' },
      ],
    },
    {
      prompt: 'Num teste de componente, depois de `button.click()`, o que vem antes do `expect`?',
      alternatives: [
        { text: 'Nada: o clique já atualizou o HTML.', explanation: 'O clique muda o estado, mas o HTML só muda quando o Angular redesenha.' },
        {
          text: '`await fixture.whenStable()`.',
          correct: true,
          explanation: 'Isso: ele espera o Angular terminar de atualizar a tela.',
        },
        { text: 'Um `setTimeout` de um segundo.', explanation: 'Funciona às vezes e deixa o teste lento. O whenStable espera o tempo exato.' },
      ],
    },
    {
      prompt: 'Um teste usa o `HttpClient` sem `provideHttpClientTesting()`, e passa. Qual é o problema?',
      alternatives: [
        { text: 'Nenhum: se passou, está certo.', explanation: 'Passou porque foi à internet: depende da rede e dos dados lá fora.' },
        {
          text: 'Ele busca a API de verdade: fica lento e falha quando a rede ou os dados mudarem.',
          correct: true,
          explanation: 'Isso: no Angular 22 o HttpClient já vem pronto, e sem o provider de teste a requisição é real.',
        },
        { text: 'O Angular lança um erro dizendo que falta o provider.', explanation: 'Não lança: desde a 22, o HttpClient é provido por padrão.' },
      ],
    },
    {
      prompt: 'O `whenStable()` está esperando para sempre, e o teste estoura os 5 segundos. Por quê?',
      alternatives: [
        {
          text: 'Há uma requisição pendente, e quem a responde é o próprio teste, que está parado no `await`.',
          correct: true,
          explanation: 'Isso: com requisição pendente, TestBed.tick(), depois flush, e só então whenStable().',
        },
        { text: 'O computador está lento.', explanation: 'Mais tempo não ajudaria: a resposta nunca chega sozinha.' },
        { text: 'Faltou o `describe`.', explanation: 'O describe só agrupa os testes; não tem relação com a espera.' },
      ],
    },
  ],
  links: [
    { label: 'Testes no Angular', url: 'https://angular.dev/guide/testing' },
    { label: 'O básico de testar componentes', url: 'https://angular.dev/guide/testing/components-basics' },
    { label: 'Testar requisições HTTP', url: 'https://angular.dev/guide/http/testing' },
    { label: 'Cobertura de código', url: 'https://angular.dev/guide/testing/code-coverage' },
    { label: 'As conferências do expect (Vitest)', url: 'https://vitest.dev/api/expect.html' },
  ],
};
