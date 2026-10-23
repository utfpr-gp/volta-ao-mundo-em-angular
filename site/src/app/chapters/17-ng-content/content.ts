import type { ChapterContent } from '../types';

export const CHAPTER_17: ChapterContent = {
  summary: [
    '`<ng-content />` marca onde entra o conteúdo que o pai escreve entre as tags do componente.',
    '`select="[atributo]"` cria encaixes com nome; o `<ng-content />` sem `select` recebe o resto.',
    'O conteúdo projetado continua sendo do pai, com os dados do pai.',
    'Sem `ng-content`, o conteúdo some em silêncio.',
  ],
  essentials: ['17/etapa/src/app/panel/panel.html'],
  stage: '17-ng-content',
  questions: [
    {
      prompt: 'O que o `<ng-content />` faz num componente?',
      alternatives: [
        { text: 'Marca o lugar onde entra o conteúdo que o pai escreveu entre as tags do componente.', correct: true, explanation: 'Isso: é o espaço da foto no porta-retrato.' },
        { text: 'Carrega o conteúdo de um arquivo HTML externo.', explanation: 'Quem aponta para um arquivo é o `templateUrl`.' },
        { text: 'Mostra o conteúdo só quando o componente está visível na tela.', explanation: 'O ng-content não tem condição; ele só marca o lugar.' },
      ],
    },
    {
      prompt: 'Com `<ng-content select="[panel-title]" />`, o que vai para esse encaixe?',
      alternatives: [
        { text: 'Qualquer elemento que tenha a classe `panel-title`.', explanation: 'Colchetes no seletor querem dizer atributo; para classe seria `.panel-title`.' },
        { text: 'Os elementos que o pai marcou com o atributo `panel-title`.', correct: true, explanation: 'Isso: o select usa um seletor de CSS.' },
        { text: 'O primeiro elemento do conteúdo, seja qual for.', explanation: 'O select escolhe pelo seletor, e não pela posição.' },
      ],
    },
    {
      prompt: 'No conteúdo projetado, `{{ country.name }}` usa o `country` de quem?',
      alternatives: [
        { text: 'Do componente moldura, que recebeu o conteúdo.', explanation: 'A moldura só mostra; o conteúdo continua sendo do pai.' },
        { text: 'De um serviço compartilhado, que guarda os dados dos dois.', explanation: 'Não há serviço envolvido; a projeção não muda de quem são os dados.' },
        { text: 'Do componente pai, que escreveu o conteúdo.', correct: true, explanation: 'Isso: os bindings usam os dados de quem escreveu o template.' },
      ],
    },
  ],
  links: [
    { label: 'Projeção de conteúdo com ng-content', url: 'https://angular.dev/guide/components/content-projection' },
  ],
};
