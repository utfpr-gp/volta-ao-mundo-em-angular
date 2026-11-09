import type { ChapterContent } from '../types';

export const CHAPTER_45: ChapterContent = {
  summary: [
    'O `@defer` põe uma parte do template, e tudo que só ela usa, num pedaço de JavaScript separado, baixado quando um gatilho dispara.',
    'Gatilhos: `on idle` (o padrão), `on viewport`, `on interaction`, `on hover`, `on timer`, `on immediate` e `when`.',
    '`@placeholder` antes do gatilho (o `on viewport` observa ele), `@loading` enquanto baixa, `@error` se falhar.',
    '`prefetch on idle` baixa antes e mostra só no gatilho.',
    'O componente adiado só pode aparecer dentro do bloco: citá-lo fora, até num `viewChild`, desfaz o adiamento sem aviso.',
  ],
  essentials: ['45/etapa/src/app/features/passport/passport-page/passport-page.html', '45/build-com-defer'],
  stage: '45-defer',
  questions: [
    {
      prompt: 'Um `@defer` sem gatilho, só `@defer { … }`. Quando o conteúdo carrega?',
      alternatives: [
        { text: 'Junto com a página.', explanation: 'Isso seria não adiar nada; o @defer sempre separa o conteúdo.' },
        {
          text: 'Quando o navegador fica ocioso: o padrão é `on idle`.',
          correct: true,
          explanation: 'Isso: sem gatilho, o Angular espera o navegador terminar o que tinha para fazer.',
        },
        { text: 'Nunca: o gatilho é obrigatório.', explanation: 'Não é: sem ele, vale o on idle.' },
      ],
    },
    {
      prompt: 'O gráfico fica no fim da página, e muita gente nem rola até lá. Qual gatilho combina?',
      alternatives: [
        {
          text: '`on viewport`.',
          correct: true,
          explanation: 'Isso: quem não chega ao fim da página nunca baixa o Chart.js.',
        },
        { text: '`on immediate`.', explanation: 'Baixaria logo ao abrir a página: o adiamento serviria de pouco.' },
        { text: '`on hover`.', explanation: 'Num celular não há mouse passando por cima; e quem só quer ver o gráfico teria de apontar para ele.' },
      ],
    },
    {
      prompt: 'Depois de pôr um `viewChild(TripChart)` na página, o pedaço `trip-chart` sumiu do build. Por quê?',
      alternatives: [
        { text: 'O build falhou em silêncio.', explanation: 'O build terminou bem: o gráfico só foi junto com a página.' },
        {
          text: 'O componente passou a ser citado fora do `@defer`, e o Angular o carrega com a página.',
          correct: true,
          explanation: 'Isso: para ficar num pedaço separado, ele só pode aparecer dentro do bloco.',
        },
        { text: 'O viewChild desliga todos os @defer do app.', explanation: 'Só o adiamento do componente citado é desfeito.' },
      ],
    },
    {
      prompt: 'Para que serve o `prefetch on idle` em `@defer (on interaction; prefetch on idle)`?',
      alternatives: [
        { text: 'Para mostrar o conteúdo quando o navegador fica ocioso.', explanation: 'Mostrar continua sendo no clique; o prefetch só antecipa o download.' },
        {
          text: 'Para baixar o código cedo, quando o navegador fica ocioso, e mostrar sem espera no clique.',
          correct: true,
          explanation: 'Isso: baixar e mostrar viram dois momentos diferentes.',
        },
        { text: 'Para guardar o conteúdo no localStorage.', explanation: 'O prefetch só baixa o JavaScript antes; não guarda nada.' },
      ],
    },
  ],
  links: [
    { label: 'Carregar partes do template com @defer', url: 'https://angular.dev/guide/templates/defer' },
    { label: 'DeferBlockBehavior (testes)', url: 'https://angular.dev/api/core/testing/DeferBlockBehavior' },
    { label: 'Chart.js: integração e tree-shaking', url: 'https://www.chartjs.org/docs/latest/getting-started/integration.html' },
  ],
};
