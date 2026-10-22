# Volta ao Mundo em Angular

Um livro aberto, interativo e em português que ensina **Angular moderno, do zero ao deploy**.
Cada capítulo responde a uma pergunta, traz uma analogia do cotidiano, um simulador para ver o conceito funcionando,
prática guiada e um desafio que vale um carimbo no seu passaporte.

📖 **Leia em:** https://utfpr-gp.github.io/volta-ao-mundo-em-angular

Material do Prof. Roni Fabio Banaszewski · Tecnologia em Sistemas para Internet · UTFPR Guarapuava.

## Como rodar no seu computador

Você precisa do Node.js 24 ou mais recente.

```bash
npm install
npm start          # abre em http://localhost:4200
```

Outros comandos:

| Comando | O que faz |
|---|---|
| `npm test` | Roda os testes do site (Vitest) e dos scripts (node:test) |
| `npm run build` | Gera o site estático em `site/dist/site/browser/`, com o índice da busca |
| `npm run check` | Confere contraste das cores, a saída gerada e os links internos |

## Organização

| Pasta | Conteúdo |
|---|---|
| `site/` | O site do livro, uma aplicação Angular gerada como site estático |
| `site/snippets/` | Os trechos de código mostrados nos capítulos |
| `passaporte/etapas/` | Uma pasta por etapa do app de exemplo, o Passaporte |
| `scripts/` | Scripts de build e de verificação |
| `docs/` | O projeto do livro e os planos de construção |

Quem mantém o livro (pessoa ou agente de IA) segue as regras do [AGENTS.md](AGENTS.md).

## Licenças

- Texto e ilustrações: [CC BY 4.0](LICENSE-CONTEUDO.md)
- Código: [MIT](LICENSE)
