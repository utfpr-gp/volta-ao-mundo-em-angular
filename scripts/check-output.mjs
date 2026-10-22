// Confere cada página gerada: tags de SEO, idioma, as sete visões dos capítulos publicados
// e palavras que não devem aparecer no livro (ele serve a qualquer pessoa, não a uma turma).
import { fileURLToPath } from 'node:url';
import { OUTPUT, listPages } from './post-build.mjs';

const VIEW_IDS = ['missao', 'ideia', 'por-dentro', 'mao-no-codigo', 'armadilhas', 'desafio', 'para-ir-alem'];
const FORBIDDEN = /(?<!\p{L})(v[íi]deos?|disciplinas?|aulas?|turmas?|fichas?|checklists?)(?!\p{L})/giu;

const REQUIRED_HEAD = [
  ['<title>', /<title>[^<]+<\/title>/],
  ['meta description', /<meta name="description" content="[^"]+"/],
  ['link canonical', /<link rel="canonical" href="https:\/\/[^"]+"/],
  ['og:image', /<meta property="og:image" content="https:\/\/[^"]+"/],
  ['lang="pt-BR"', /<html[^>]* lang="pt-BR"/],
];

function visibleText(html) {
  return html
    .replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
}

export function checkPage(html, path) {
  const problems = [];
  for (const [name, pattern] of REQUIRED_HEAD) {
    if (!pattern.test(html)) problems.push(`${path || '/'}: falta ${name}`);
  }
  if (html.includes('data-chapter=') && !html.includes('data-coming-soon')) {
    const missing = VIEW_IDS.filter((id) => !html.includes(`id="${id}"`));
    if (missing.length) problems.push(`${path}: capítulo sem as visões ${missing.join(', ')}`);
  }
  const words = new Set([...visibleText(html).matchAll(FORBIDDEN)].map((match) => match[1].toLowerCase()));
  if (words.size) problems.push(`${path || '/'}: palavras proibidas no texto: ${[...words].join(', ')}`);
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pages = listPages(OUTPUT);
  const problems = pages.flatMap(({ html, path }) => checkPage(html, path));
  if (problems.length) {
    console.error(`Problemas em ${problems.length} verificação(ões):\n${problems.join('\n')}`);
    process.exit(1);
  }
  console.log(`Saída ok: ${pages.length} páginas conferidas.`);
}
