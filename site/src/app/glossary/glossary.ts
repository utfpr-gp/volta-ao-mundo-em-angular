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
  angularjs: {
    term: 'AngularJS',
    definition:
      'A primeira versão do Angular, de 2010, escrita em JavaScript. Foi reescrita do zero em 2016 e não recebe mais atualizações desde 2021. Exemplos com ng-controller e $scope são dela.',
    chapter: 1,
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
  estado: {
    term: 'Estado',
    definition:
      'Um valor que muda enquanto o app roda, como o número de cliques ou a lista de países visitados. Quando o estado muda, a tela precisa mostrar o valor novo.',
    chapter: 1,
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
  promise: {
    term: 'Promise',
    definition:
      'Um objeto que representa um valor que vai chegar depois, como a resposta de um servidor. Com await, o código espera esse valor chegar.',
    chapter: 3,
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
