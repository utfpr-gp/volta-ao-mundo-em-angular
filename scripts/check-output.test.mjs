import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkPage } from './check-output.mjs';

const VIEW_IDS = ['missao', 'ideia', 'por-dentro', 'mao-no-codigo', 'armadilhas', 'desafio', 'para-ir-alem'];
const HEAD = `<title>Capítulo · Volta ao Mundo em Angular</title>
<meta name="description" content="Uma descrição.">
<link rel="canonical" href="https://utfpr-gp.github.io/volta-ao-mundo-em-angular/capitulos/x/">
<meta property="og:image" content="https://utfpr-gp.github.io/volta-ao-mundo-em-angular/og.png">`;

const html = ({ head = HEAD, body = '', lang = 'pt-BR' } = {}) =>
  `<!doctype html><html lang="${lang}"><head>${head}</head><body>${body}</body></html>`;
const chapter = (ids = VIEW_IDS) =>
  `<article data-pagefind-body data-chapter="01-x">${ids.map((id) => `<section id="${id}"></section>`).join('')}</article>`;

test('a complete page has no problems', () => {
  assert.deepEqual(checkPage(html({ body: chapter() }), 'capitulos/01-x'), []);
});

test('checkPage flags a missing <title>, meta description, canonical, og:image or lang="pt-BR"', () => {
  const problems = checkPage(html({ head: '', lang: 'en' }), 'sobre');
  for (const expected of ['<title>', 'description', 'canonical', 'og:image', 'lang="pt-BR"']) {
    assert.ok(problems.some((p) => p.includes(expected)), `faltou acusar ${expected}: ${problems}`);
  }
});

test('checkPage flags a published chapter missing any of the 7 view ids', () => {
  const problems = checkPage(html({ body: chapter(VIEW_IDS.filter((id) => id !== 'armadilhas')) }), 'capitulos/01-x');
  assert.equal(problems.length, 1);
  assert.match(problems[0], /armadilhas/);
});

test('checkPage ignores the view rule on data-coming-soon pages', () => {
  assert.deepEqual(checkPage(html({ body: '<div data-coming-soon></div>' }), 'capitulos/50-x'), []);
});

test('checkPage flags forbidden words in visible text (vídeo, disciplina, aula, turma, ficha, checklist)', () => {
  for (const word of ['vídeo', 'Videos', 'disciplina', 'aula', 'turma', 'ficha', 'checklist']) {
    const problems = checkPage(html({ body: `<p>Veja a ${word} de hoje.</p>` }), 'sobre');
    assert.ok(problems.some((p) => p.toLowerCase().includes(word.toLowerCase())), word);
  }
});

test('forbidden words inside other words, scripts or attributes are fine', () => {
  const body = '<p>Uma saulada de paulada.</p><script>const aula = 1;</script><img alt="x" data-x="turma">';
  assert.deepEqual(checkPage(html({ body }), 'sobre'), []);
});
