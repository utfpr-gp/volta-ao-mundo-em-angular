// Confere o contraste (WCAG 2.x, mínimo AA de 4,5:1) entre os tokens de cor do site,
// no modo claro e no modo escuro. Os tokens vêm de site/src/styles.css.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const MINIMUM = 4.5;

const VIEW_COLORS = ['mission', 'idea', 'inside', 'code', 'pitfall', 'challenge'];

export const PAIRS = [
  ['--color-ink', '--color-surface'],
  ['--color-ink', '--color-surface-raised'],
  ['--color-ink-muted', '--color-surface'],
  ['--color-ink-muted', '--color-surface-raised'],
  ['--color-link', '--color-surface'],
  ['--color-link', '--color-surface-raised'],
  ['--color-on-primary', '--color-primary'],
  ['--color-on-primary', '--color-primary-soft'],
  ['--color-on-primary-muted', '--color-primary'],
  ['--color-on-primary-muted', '--color-primary-soft'],
  ['--color-primary', '--color-highlight'],
  ...VIEW_COLORS.map((view) => [`--color-${view}`, '--color-surface']),
];

function luminance(hex) {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

function colorTokens(block) {
  const tokens = {};
  for (const [, name, value] of block.matchAll(/(--color-[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens[name] = value.toUpperCase();
  }
  return tokens;
}

function blockAfter(css, opener) {
  const start = css.indexOf(opener);
  if (start === -1) return '';
  let depth = 0;
  for (let i = css.indexOf('{', start); i < css.length; i++) {
    if (css[i] === '{') depth++;
    if (css[i] === '}' && --depth === 0) return css.slice(start, i);
  }
  return '';
}

export function readTokens(css) {
  const light = colorTokens(blockAfter(css, '@theme'));
  const dark = { ...light, ...colorTokens(blockAfter(css, '[data-theme="dark"]')) };
  return { light, dark };
}

export function checkPairs(tokens, pairs) {
  const problems = [];
  for (const [foreground, background] of pairs) {
    const missing = [foreground, background].filter((name) => !tokens[name]);
    if (missing.length) {
      problems.push(`token ausente: ${missing.join(', ')}`);
      continue;
    }
    const ratio = contrast(tokens[foreground], tokens[background]);
    if (ratio < MINIMUM) {
      problems.push(
        `${foreground} (${tokens[foreground]}) sobre ${background} (${tokens[background]}): ${ratio.toFixed(2)}:1, mínimo ${MINIMUM}:1`,
      );
    }
  }
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const css = readFileSync('site/src/styles.css', 'utf8');
  const { light, dark } = readTokens(css);
  const problems = [
    ...checkPairs(light, PAIRS).map((p) => `[claro] ${p}`),
    ...checkPairs(dark, PAIRS).map((p) => `[escuro] ${p}`),
  ];
  if (problems.length) {
    console.error(`Contraste insuficiente em ${problems.length} par(es):\n${problems.join('\n')}`);
    process.exit(1);
  }
  console.log(`Contraste ok: ${PAIRS.length} pares conferidos nos modos claro e escuro.`);
}
