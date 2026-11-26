import type { ChapterContent } from '../types';

export const CHAPTER_49: ChapterContent = {
  summary: [
    'Integração contínua (CI): a cada push, uma máquina limpa baixa o código, instala tudo, roda os testes e o build.',
    'No GitHub Actions, um workflow é um arquivo YAML em `.github/workflows`, com `on` (quando), `jobs`, `runs-on` (a máquina) e `steps`.',
    'Um passo que falha deixa o check vermelho e os passos seguintes nem rodam; o log mostra a mensagem do teste, igual à do seu terminal.',
    '`npm ci` no CI exige um `package-lock.json` em dia com o `package.json`: dependência nova vai com o lock no mesmo commit.',
    'No Render, o Auto-Deploy "After CI Checks Pass" (`autoDeployTrigger: checksPass`) só publica commits com todos os checks verdes.',
    'Commit vermelho ou sem nenhum check não vai ao ar, e nada avisa: o site continua na versão anterior.',
  ],
  essentials: ['49/etapa/.github/workflows/ci.yml', '49/etapa/render.yaml'],
  stage: '49-github-actions',
  questions: [
    {
      prompt: 'Você fez push de um commit que quebra um teste. O Render está em "After CI Checks Pass". O que acontece com o site?',
      alternatives: [
        { text: 'O Render publica e mostra um aviso vermelho no site.', explanation: 'O site nem recebe o commit: o Render espera os checks antes de publicar.' },
        {
          text: 'O check fica vermelho, o Render pula o commit, e a versão anterior continua no ar.',
          correct: true,
          explanation: 'Isso: foi o que aconteceu no teste do livro. O Render não registra nada; o aviso está no GitHub, no ✗ ao lado do commit.',
        },
        { text: 'O Render roda os testes de novo e publica se passarem na segunda vez.', explanation: 'O Render não roda testes: o build dele é só npm ci && npm run build. Quem testa é o GitHub Actions.' },
      ],
    },
    {
      prompt: 'Na sua máquina, `npm install canvas-confetti` funcionou e o app roda. No GitHub Actions, o passo `npm ci` falha. O que faltou?',
      alternatives: [
        {
          text: 'Mandar o package-lock.json junto: o npm ci recusa um lock que não bate com o package.json.',
          correct: true,
          explanation: 'Isso: a mensagem diz "can only install packages when your package.json and package-lock.json … are in sync" e aponta o pacote que falta no lock.',
        },
        { text: 'Trocar npm ci por npm install no workflow.', explanation: 'Funcionaria, mas o CI deixaria de instalar exatamente as versões que você testou. O certo é commitar o lock.' },
        { text: 'Instalar o pacote também no runner, com um passo a mais.', explanation: 'O runner instala tudo pelo package-lock.json; não há o que instalar à mão.' },
      ],
    },
    {
      prompt: 'Num workflow, o passo `npm test` falhou. O que acontece com o passo `npm run build`, logo depois?',
      alternatives: [
        { text: 'Roda normalmente, porque os passos são independentes.', explanation: 'Os passos de um job rodam em sequência, e uma falha interrompe o job.' },
        {
          text: 'Nem roda: o job para no primeiro passo que falha.',
          correct: true,
          explanation: 'Isso: na página da execução, o build aparece sem marca, como passo que não rodou.',
        },
        { text: 'Roda, mas o resultado é descartado.', explanation: 'Ele não chega a rodar.' },
      ],
    },
    {
      prompt: 'Com "After CI Checks Pass", você faz um commit com `[skip ci]` na mensagem. O que o Render faz?',
      alternatives: [
        { text: 'Publica, porque nenhum check falhou.', explanation: 'Sem nenhum check, o Render também não publica: ele precisa de checks, e todos verdes.' },
        {
          text: 'Nada: sem nenhum check no commit, ele não publica, e não registra nenhum evento.',
          correct: true,
          explanation: 'Isso: foi o que o livro viu. A documentação do Render diz que zero checks também não disparam o deploy.',
        },
        { text: 'Roda o workflow ele mesmo.', explanation: 'O Render não roda workflows do GitHub Actions.' },
      ],
    },
  ],
  links: [
    { label: 'Testes do Angular na integração contínua', url: 'https://angular.dev/guide/testing#testing-in-continuous-integration' },
    { label: 'Sintaxe dos workflows do GitHub Actions', url: 'https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions' },
    { label: 'Pular uma execução ([skip ci])', url: 'https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/skipping-workflow-runs' },
    { label: 'Proteger a main com checks obrigatórios', url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches' },
    { label: 'Deploys no Render (Auto-Deploy e CI)', url: 'https://render.com/docs/deploys' },
    { label: 'A action setup-node', url: 'https://github.com/actions/setup-node' },
  ],
};
