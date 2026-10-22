export interface GlossaryEntry {
  term: string;
  definition: string;
  /** O capítulo onde o termo é explicado pela primeira vez. */
  chapter: number;
}

/**
 * Os termos técnicos do livro. A chave é usada no endereço (/glossario#chave) e no
 * componente <vm-term name="chave">; uma chave inexistente quebra o build.
 */
export const GLOSSARY = {
  'angular-cli': {
    term: 'Angular CLI',
    definition:
      'A ferramenta de terminal do Angular, usada pelo comando ng: cria projetos (ng new), liga o app (ng serve), roda testes (ng test) e gera a versão final (ng build).',
    chapter: 5,
  },
  angularjs: {
    term: 'AngularJS',
    definition:
      'A primeira versão do Angular, de 2010, escrita em JavaScript. Foi reescrita do zero em 2016 e não recebe mais atualizações desde 2021. Exemplos com ng-controller e $scope são dela.',
    chapter: 1,
  },
  'arrow-function': {
    term: 'Arrow function',
    definition: 'Um jeito curto de escrever uma função com a seta =>, como (c) => c.name. Aparece em todo lugar no Angular, dentro de filter, map e computed.',
    chapter: 3,
  },
  'atomic-design': {
    term: 'Atomic Design',
    definition: 'Um jeito de pensar telas em cinco níveis, inspirado na química: átomos, moléculas, organismos, templates e páginas. Criado pelo designer Brad Frost.',
    chapter: 6,
  },
  binding: {
    term: 'Binding',
    definition: 'A ligação entre um dado da classe e um lugar do template. Quando o dado muda, a tela acompanha; no event binding, o caminho é da tela para a classe.',
    chapter: 7,
  },
  biblioteca: {
    term: 'Biblioteca',
    definition:
      'Um conjunto de código pronto que você chama quando precisa, como uma caixa de ferramentas. Quem decide a hora de usar é o seu código.',
    chapter: 1,
  },
  classe: {
    term: 'Classe',
    definition:
      'Um molde que junta dados e funções num lugar só. No Angular, cada componente é uma classe em TypeScript que guarda o estado e as ações da tela.',
    chapter: 1,
  },
  compilador: {
    term: 'Compilador',
    definition: 'Um programa que transforma código de uma forma em outra. O do TypeScript confere os tipos e gera JavaScript; o do Angular transforma templates em JavaScript.',
    chapter: 4,
  },
  computed: {
    term: 'Computed',
    definition: 'Um signal calculado a partir de outros, como uma fórmula de planilha: computed(() => a() + b()). Recalcula sozinho quando o que ele lê muda.',
    chapter: 9,
  },
  'codigo-aberto': {
    term: 'Código aberto',
    definition:
      'Software cujo código-fonte qualquer pessoa pode ler, usar, modificar e compartilhar, de graça, respeitando a licença.',
    chapter: 1,
  },
  componente: {
    term: 'Componente',
    definition:
      'Um pedaço da tela com aparência (HTML), estilo (CSS) e comportamento (TypeScript) próprios. Uma tela inteira é uma árvore de componentes encaixados.',
    chapter: 1,
  },
  decorator: {
    term: 'Decorator',
    definition:
      'Uma marcação com @ em cima de uma classe, como @Component, que acrescenta informações e transforma a classe em algo especial para o Angular.',
    chapter: 4,
  },
  desestruturacao: {
    term: 'Desestruturação',
    definition: 'Um atalho do JavaScript para tirar valores de dentro de um objeto ou array e criar variáveis com eles numa linha, como const { name } = country.',
    chapter: 3,
  },
  estado: {
    term: 'Estado',
    definition:
      'Um valor que muda enquanto o app roda, como o número de cliques ou a lista de países visitados. Quando o estado muda, a tela precisa mostrar o valor novo.',
    chapter: 1,
  },
  'event-binding': {
    term: 'Event binding',
    definition: 'Os parênteses ( ) no template, como (click)="salvar()": chamam um método da classe quando um evento acontece na tela.',
    chapter: 8,
  },
  framework: {
    term: 'Framework',
    definition:
      'Uma estrutura pronta que organiza a aplicação e chama o seu código na hora certa. Você escreve as peças; o framework monta e faz funcionar.',
    chapter: 1,
  },
  lts: {
    term: 'LTS (suporte de longo prazo)',
    definition:
      'Uma versão estável de um software que recebe correções por bastante tempo. No Node.js, são as versões indicadas para estudar e trabalhar.',
    chapter: 2,
  },
  generico: {
    term: 'Genérico',
    definition: 'Um tipo que recebe outro tipo como parâmetro, entre < >. Array<string> é um array de textos; signal<number> é um signal de número.',
    chapter: 4,
  },
  inferencia: {
    term: 'Inferência de tipos',
    definition: 'Quando o TypeScript deduz o tipo sozinho, pelo valor inicial: em let capital = \'Brasília\', ele já sabe que capital é uma string.',
    chapter: 4,
  },
  interpolacao: {
    term: 'Interpolação',
    definition: 'As chaves duplas {{ }} no template: avaliam uma expressão da classe e mostram o resultado como texto.',
    chapter: 7,
  },
  interface: {
    term: 'Interface',
    definition:
      'No TypeScript, a descrição do formato de um objeto: quais propriedades ele tem e o tipo de cada uma. Some quando o código vira JavaScript.',
    chapter: 4,
  },
  json: {
    term: 'JSON',
    definition:
      'Um formato de texto para trocar dados, com chaves e valores, como {"nome": "Brasil"}. É o que o servidor costuma devolver para uma SPA.',
    chapter: 1,
  },
  nodejs: {
    term: 'Node.js',
    definition:
      'Um programa que roda JavaScript direto no computador, sem navegador. As ferramentas do Angular, como o Angular CLI, rodam nele.',
    chapter: 2,
  },
  npm: {
    term: 'npm',
    definition:
      'O gerenciador de pacotes que vem com o Node.js. Baixa e instala códigos prontos, como as partes do Angular, a partir do package.json.',
    chapter: 2,
  },
  opinativo: {
    term: 'Opinativo',
    definition:
      'Diz-se de um framework que já decide muita coisa por você: estrutura de pastas, linguagem, forma de testar. Menos liberdade, mais projetos parecidos entre si.',
    chapter: 1,
  },
  pacote: {
    term: 'Pacote',
    definition: 'Um código pronto publicado no npm para todo mundo usar. O próprio Angular é distribuído como um conjunto de pacotes.',
    chapter: 2,
  },
  pipe: {
    term: 'Pipe',
    definition: 'Um filtro do template, escrito com a barra vertical: {{ valor | number }}. Formata o valor para a tela sem mudar o dado na classe.',
    chapter: 12,
  },
  porta: {
    term: 'Porta',
    definition: 'Um número que identifica um programa que atende pedidos num computador, como o 4200 de http://localhost:4200. É como o número do apartamento num prédio.',
    chapter: 5,
  },
  'property-binding': {
    term: 'Property binding',
    definition: 'Os colchetes [ ] no template, como [src]="url": dão a uma propriedade do elemento o valor de uma expressão da classe.',
    chapter: 7,
  },
  promise: {
    term: 'Promise',
    definition:
      'Um objeto que representa um valor que vai chegar depois, como a resposta de um servidor. Com await, o código espera esse valor chegar.',
    chapter: 3,
  },
  seletor: {
    term: 'Seletor (selector)',
    definition: 'O nome da tag que representa um componente no HTML. Com selector: \'app-header\', o componente aparece onde estiver <app-header />.',
    chapter: 6,
  },
  servidor: {
    term: 'Servidor',
    definition:
      'O computador, em algum lugar da internet, que guarda o site e os dados e responde aos pedidos que o navegador faz.',
    chapter: 1,
  },
  signal: {
    term: 'Signal',
    definition:
      'Uma caixinha que guarda um valor e avisa o Angular quando ele muda, para que só a parte da tela que depende dele seja atualizada.',
    chapter: 9,
  },
  spa: {
    term: 'SPA (aplicação de página única)',
    definition:
      'Uma aplicação web que carrega a página uma vez e, depois, troca só partes da tela, pedindo ao servidor apenas os dados que faltam.',
    chapter: 1,
  },
  template: {
    term: 'Template',
    definition:
      'O HTML de um componente, com marcações do Angular como {{ }} para mostrar valores. É a parte do componente que vira tela.',
    chapter: 1,
  },
  'variavel-de-template': {
    term: 'Variável de template',
    definition: 'Um nome dado a um elemento com #, como <input #note>. Pode ser usado em outros pontos do mesmo template, como note.value.',
    chapter: 8,
  },
  'template-string': {
    term: 'Template string',
    definition: 'Um texto escrito entre crases, em que você encaixa valores com ${}, como `Olá, ${nome}`.',
    chapter: 3,
  },
  terminal: {
    term: 'Terminal',
    definition:
      'Um programa em que você conversa com o computador por comandos de texto, como pwd, cd e npm, em vez de clicar em ícones.',
    chapter: 2,
  },
  typescript: {
    term: 'TypeScript',
    definition:
      'JavaScript com tipos. Os tipos apontam erros enquanto você escreve, antes de o código rodar. O código é convertido em JavaScript para o navegador executar.',
    chapter: 1,
  },
} as const satisfies Record<string, GlossaryEntry>;

export type TermName = keyof typeof GLOSSARY;

export function sortedGlossary(): (GlossaryEntry & { name: TermName })[] {
  return (Object.keys(GLOSSARY) as TermName[])
    .map((name) => ({ name, ...GLOSSARY[name] }))
    .sort((a, b) => a.term.localeCompare(b.term, 'pt-BR', { sensitivity: 'base' }));
}
