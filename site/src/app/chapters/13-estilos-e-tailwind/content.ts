import type { ChapterContent } from '../types';

export const CHAPTER_13: ChapterContent = {
  summary: [
    'O CSS de um componente só vale para ele (encapsulamento); `:host` estiliza a própria tag do componente.',
    '`[class.nome]="condicao"` liga uma classe; `[style.width.%]="valor"` dá valor a um estilo.',
    '`ng add tailwindcss` instala o Tailwind; as classes utilitárias vão direto no template.',
    'Prefixos como `hover:` e `sm:` mudam quando a classe vale.',
    'O Tailwind só gera classes escritas inteiras no código.',
  ],
  essentials: ['13/etapa/src/app/country-list/country-list.html', '13/etapa/src/styles.css'],
  stage: '13-estilos-e-tailwind',
  questions: [
    {
      prompt: 'Por que uma regra `.card` no `country-list.css` não afeta um `.card` de outro componente?',
      alternatives: [
        { text: 'Porque o Angular marca os elementos com um atributo único e limita a regra a eles.', correct: true, explanation: 'Isso: é o encapsulamento.' },
        { text: 'Porque o CSS de componente só é carregado quando o componente aparece pela primeira vez.', explanation: 'O isolamento vem da reescrita das regras com o atributo, e não do momento em que o CSS carrega.' },
        { text: 'Porque o navegador ignora classes repetidas em arquivos diferentes.', explanation: 'O navegador aplicaria as duas; quem isola é o Angular.' },
      ],
    },
    {
      prompt: 'O que a classe `sm:grid-cols-2` faz?',
      alternatives: [
        { text: 'Duas colunas só em telas pequenas, como no celular.', explanation: 'É o contrário: `sm:` quer dizer "a partir do tamanho pequeno para cima".' },
        { text: 'Duas colunas a partir de telas de 640 px; abaixo disso, vale a regra sem prefixo.', correct: true, explanation: 'Isso: o Tailwind pensa do menor para o maior.' },
        { text: 'Colunas pequenas, com metade da largura normal em qualquer tela.', explanation: '`sm` é o tamanho da tela a partir do qual a classe vale, e não o tamanho da coluna.' },
      ],
    },
    {
      prompt: 'Por que `[class]="\'text-\' + color + \'-700\'"` não pinta o texto?',
      alternatives: [
        { text: 'Porque o Tailwind só gera classes que aparecem inteiras no código, e essa só existe com o app rodando.', correct: true, explanation: 'Isso: escreva as classes completas e escolha entre elas.' },
        { text: 'Porque o `[class]` não aceita textos montados com `+`.', explanation: 'O Angular aplica a classe montada; o problema é que o Tailwind não a gerou.' },
        { text: 'Porque `text-` só funciona com cores escritas em inglês dentro do HTML.', explanation: 'O nome da cor está certo; o problema é como a classe foi escrita.' },
      ],
    },
    {
      prompt: 'Para estilizar a própria tag `<app-featured-country>`, qual seletor usar no CSS do componente?',
      alternatives: [
        { text: '`app-featured-country { ... }`, o nome da tag.', explanation: 'Por causa do encapsulamento, o jeito certo é outro.' },
        { text: '`body > * { ... }`, que pega todos os componentes da página.', explanation: 'Isso não funciona dentro do CSS de um componente, e pegaria tudo.' },
        { text: '`:host { ... }`', correct: true, explanation: 'Isso: `:host` é o elemento do próprio componente.' },
      ],
    },
  ],
  links: [
    { label: 'Estilos de componentes', url: 'https://angular.dev/guide/components/styling' },
    { label: 'Usando Tailwind com Angular', url: 'https://angular.dev/guide/tailwind' },
    { label: 'Documentação do Tailwind CSS', url: 'https://tailwindcss.com/docs/styling-with-utility-classes' },
    { label: 'Ligando classes e estilos no template', url: 'https://angular.dev/guide/templates/binding#css-class-and-style-property-bindings' },
  ],
};
