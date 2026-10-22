import type { ChapterContent } from '../types';

export const CHAPTER_02: ChapterContent = {
  summary: [
    'O terminal recebe comandos em texto e sempre age sobre a pasta atual: `pwd`, `ls`, `mkdir`, `cd`.',
    'O Node.js roda JavaScript fora do navegador; é nele que rodam as ferramentas do Angular.',
    'O npm vem com o Node.js e instala pacotes, como as partes do próprio Angular.',
    'Use uma versão LTS do Node.js aceita pelo Angular 22 e confira com `node -v` e `npm -v`.',
    'No VS Code, instale a extensão Angular Language Service.',
  ],
  essentials: ['02/navigate', '02/versions'],
  questions: [
    {
      prompt: 'Por que o Angular precisa do Node.js, se o app roda no navegador?',
      alternatives: [
        {
          text: 'Porque o app Angular só funciona em navegadores que têm o Node.js instalado.',
          explanation: 'Quem abre o app não precisa de Node.js: o app roda no navegador comum.',
        },
        {
          text: 'Porque as ferramentas que criam, montam e testam o projeto são programas em JavaScript que rodam no Node.js.',
          correct: true,
          explanation: 'Isso: o Node.js roda as ferramentas no seu computador; o app pronto roda no navegador de quem usa.',
        },
        {
          text: 'Porque o Node.js é o editor de código do Angular.',
          explanation: 'O editor é o VS Code (ou outro). O Node.js roda JavaScript fora do navegador.',
        },
      ],
    },
    {
      prompt: 'Você digitou `node -v` e apareceu `bash: node: comando não encontrado`. Qual é a primeira coisa a tentar?',
      alternatives: [
        {
          text: 'Fechar o terminal e abrir de novo, porque ele pode ter sido aberto antes da instalação.',
          correct: true,
          explanation: 'Isso: o terminal só lê a lista de lugares onde procurar programas quando abre.',
        },
        {
          text: 'Reinstalar o VS Code.',
          explanation: 'O VS Code não tem relação com o terminal achar o `node`.',
        },
        {
          text: 'Trocar para `Node -v`, com maiúscula.',
          explanation: 'O nome do comando é `node`, com minúscula; com maiúscula, o erro continua.',
        },
      ],
    },
    {
      prompt: 'Qual comando mostra em que pasta o terminal está agora?',
      alternatives: [
        { text: '`ls`', explanation: 'O `ls` mostra o que tem dentro da pasta, e não qual é a pasta.' },
        { text: '`cd`', explanation: 'O `cd` muda de pasta; ele não mostra onde você está.' },
        { text: '`pwd`', correct: true, explanation: 'Isso: `pwd` mostra o caminho da pasta atual.' },
      ],
    },
    {
      prompt: 'Para que serve o npm?',
      alternatives: [
        {
          text: 'Para baixar e instalar pacotes, que são códigos prontos publicados por outras pessoas.',
          correct: true,
          explanation: 'Isso: é a loja de pacotes do JavaScript. As partes do Angular também são pacotes.',
        },
        {
          text: 'Para criar telas arrastando componentes com o mouse.',
          explanation: 'O npm é usado no terminal e não desenha telas; ele baixa e instala pacotes.',
        },
        {
          text: 'Para rodar o app no celular.',
          explanation: 'O npm cuida dos pacotes do projeto. Levar o app ao celular é assunto dos últimos capítulos.',
        },
      ],
    },
  ],
  links: [
    { label: 'Instalar o ambiente local do Angular', url: 'https://angular.dev/tools/cli/setup-local' },
    { label: 'Versões de Node.js aceitas por cada Angular', url: 'https://angular.dev/reference/versions' },
    { label: 'Angular Language Service (extensão do editor)', url: 'https://angular.dev/tools/language-service' },
    { label: 'Baixar o Node.js', url: 'https://nodejs.org/pt/download' },
    { label: 'Pro Git, em português', url: 'https://git-scm.com/book/pt-br/v2' },
  ],
};
