import type { ChapterContent } from '../types';

export const CHAPTER_05: ChapterContent = {
  summary: [
    'O Angular CLI (`ng`) cria, liga, testa e prepara o projeto pelo terminal.',
    '`ng new passaporte` cria o projeto; `ng serve` liga o app em `http://localhost:4200/` e recarrega a cada mudança.',
    'O `index.html` tem o `<app-root>`; o `main.ts` liga o app a partir do componente `App`.',
    'O template `app.html` é o que aparece na tela; a classe `app.ts` guarda os dados.',
    'Comandos do `ng` só funcionam dentro da pasta do projeto.',
  ],
  essentials: ['05/ng-new', '05/etapa/src/main.ts'],
  stage: '05-angular-cli',
  questions: [
    {
      prompt: 'Em que ordem o app liga?',
      alternatives: [
        { text: '`app.html` → `app.ts` → `main.ts` → `index.html`', explanation: 'É o caminho ao contrário: tudo começa pela única página, o index.html.' },
        { text: '`index.html` → `main.ts` → componente `App` → template `app.html`', correct: true, explanation: 'Isso: a página traz o `<app-root>`, o main.ts liga o App, e o template dele é desenhado ali dentro.' },
        { text: '`main.ts` → `app.html` → `index.html` → `app.ts`', explanation: 'O navegador sempre começa pelo index.html, a única página da SPA.' },
      ],
    },
    {
      prompt: 'Para que serve o `ng serve`?',
      alternatives: [
        { text: 'Para publicar o app na internet.', explanation: 'Ele roda o app só no seu computador. Publicar é com `ng build` e um serviço de hospedagem.' },
        { text: 'Para ligar o app no seu computador e recarregar o navegador a cada arquivo salvo.', correct: true, explanation: 'Isso: é o servidor de desenvolvimento, em `localhost:4200`.' },
        { text: 'Para criar um projeto novo.', explanation: 'Quem cria é o `ng new`.' },
      ],
    },
    {
      prompt: 'Você rodou `ng serve` e apareceu "This command is not available when running the Angular CLI outside a workspace". O que fazer?',
      alternatives: [
        { text: 'Reinstalar o Node.js.', explanation: 'O Node.js e o CLI estão funcionando: o CLI respondeu. O problema é a pasta.' },
        { text: 'Entrar na pasta do projeto com `cd` e rodar de novo.', correct: true, explanation: 'Isso: comandos como `ng serve` só funcionam dentro de um projeto Angular.' },
        { text: 'Rodar de novo com `--port 4300`, porque a porta padrão pode estar ocupada.', explanation: 'Esse é o caminho para o erro de porta ocupada, não para este.' },
      ],
    },
    {
      prompt: 'Qual arquivo você edita para mudar o que aparece na tela do componente `App`?',
      alternatives: [
        { text: '`src/app/app.html`', correct: true, explanation: 'Isso: é o template do App, o HTML desenhado dentro do `<app-root>`.' },
        { text: '`angular.json`', explanation: 'Ele configura o CLI; não tem o conteúdo da tela.' },
        { text: '`package.json`', explanation: 'Ele lista os pacotes do projeto; não tem o conteúdo da tela.' },
      ],
    },
    {
      prompt: 'O `ng serve` está rodando e você precisa digitar outro comando no terminal. O que fazer?',
      alternatives: [
        { text: 'Apertar `Ctrl` + `C` para copiar o endereço e colar o comando.', explanation: 'No terminal, `Ctrl` + `C` interrompe o programa: o servidor desligaria.' },
        { text: 'Fechar o VS Code e abrir de novo, para liberar o terminal.', explanation: 'Isso desligaria o servidor também. Não é preciso fechar nada.' },
        { text: 'Abrir um segundo terminal e deixar o servidor rodando no primeiro.', correct: true, explanation: 'Isso: o terminal do `ng serve` fica ocupado enquanto o servidor roda.' },
      ],
    },
  ],
  links: [
    { label: 'Instalação e primeiro projeto', url: 'https://angular.dev/installation' },
    { label: 'Visão geral do Angular CLI', url: 'https://angular.dev/tools/cli' },
    { label: 'Referência do ng new', url: 'https://angular.dev/cli/new' },
    { label: 'Referência do ng serve', url: 'https://angular.dev/cli/serve' },
    { label: 'Estrutura de arquivos de um projeto', url: 'https://angular.dev/reference/configs/file-structure' },
  ],
};
