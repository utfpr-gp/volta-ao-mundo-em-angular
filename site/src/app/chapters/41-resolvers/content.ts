import type { ChapterContent } from '../types';

export const CHAPTER_41: ChapterContent = {
  summary: [
    'Um resolver é uma função do tipo `ResolveFn` que o roteador chama antes de abrir a rota, e que entrega dados à tela.',
    'Na rota, `resolve: { country: countryResolver }`; com o `withComponentInputBinding()`, a chave vira o input de mesmo nome.',
    'A navegação espera o resolver: a tela anterior fica, e a nova abre pronta, com título e endereço certos.',
    'Para desviar, devolva um `RedirectCommand`; o `browserUrl` mantém na barra o endereço pedido.',
    'O resolver precisa responder também quando dá errado, e o que ele entrega é uma foto: o que muda depois vem de um signal.',
  ],
  essentials: ['41/etapa/src/app/features/country-detail/country-resolvers.ts', '41/etapa/src/app/features/country-detail/country.routes.ts'],
  stage: '41-resolvers',
  questions: [
    {
      prompt: 'Com um resolver na rota do país, o que a pessoa vê logo depois de clicar no Japão, se os países ainda não chegaram?',
      alternatives: [
        { text: 'A página do país, com "Carregando o país…".', explanation: 'Isso é o que acontece quando o componente busca os dados.' },
        {
          text: 'A tela anterior, com a barra de carregamento, até os países chegarem.',
          correct: true,
          explanation: 'Isso: o roteador só troca de tela quando o resolver termina.',
        },
        { text: 'Uma tela em branco.', explanation: 'A tela anterior continua; ela só sai quando a nova está pronta.' },
      ],
    },
    {
      prompt: 'A rota tem `resolve: { pais: countryResolver }`, e a tela tem `country = input<Country>()`. O que acontece?',
      alternatives: [
        { text: 'O Angular avisa no console que o input não existe.', explanation: 'Não há aviso: o dado só não chega a lugar nenhum.' },
        {
          text: 'O input fica `undefined`, sem erro, porque a chave e o input têm nomes diferentes.',
          correct: true,
          explanation: 'Isso: o withComponentInputBinding() liga pelo nome. Ou a chave vira country, ou o input vira pais.',
        },
        { text: 'O input recebe o país, porque só existe um resolver.', explanation: 'A ligação é pelo nome, e não pela posição.' },
      ],
    },
    {
      prompt: 'O código no endereço não existe. O que o `countryResolver` devolve para mostrar a página de "não encontrado"?',
      alternatives: [
        { text: '`false`.', explanation: 'false é resposta de guard. Num resolver, viraria o dado entregue à tela.' },
        { text: '`router.navigate([\'/nao-encontrado\'])`.', explanation: 'Isso começaria outra navegação no meio desta. O jeito do resolver é devolver o desvio.' },
        {
          text: 'Um `RedirectCommand` para `/nao-encontrado`, com o `browserUrl` do endereço pedido.',
          correct: true,
          explanation: 'Isso: o roteador troca a navegação, e a barra continua mostrando o que a pessoa pediu.',
        },
      ],
    },
    {
      prompt: 'Para qual destes dados um resolver é a melhor escolha?',
      alternatives: [
        {
          text: 'O país da página do país: rápido, e sem ele a tela não faz sentido.',
          correct: true,
          explanation: 'Isso: dado indispensável e rápido é o caso do resolver.',
        },
        { text: 'A previsão do tempo, que às vezes demora alguns segundos.', explanation: 'Esperar segundos sem nada mudar parece clique perdido. Melhor abrir a tela e mostrar o carregando na aba.' },
        { text: 'Os carimbos que mudam quando a pessoa marca um país.', explanation: 'O dado resolvido é uma foto; o que muda com a tela aberta vem de um signal.' },
      ],
    },
  ],
  links: [
    { label: 'Data resolvers', url: 'https://angular.dev/guide/routing/data-resolvers' },
    { label: 'ResolveFn', url: 'https://angular.dev/api/router/ResolveFn' },
    { label: 'RedirectCommand', url: 'https://angular.dev/api/router/RedirectCommand' },
    { label: 'A opção browserUrl da navegação', url: 'https://angular.dev/api/router/NavigationBehaviorOptions#browserUrl' },
  ],
};
