import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkPairs, contrast, readTokens } from './check-contrast.mjs';

const CSS_FIXTURE = `
@import "tailwindcss";
@theme {
  --color-surface: #FBF8F1;
  --color-ink: #1E2430;
  --font-sans: "Nunito Sans Variable", system-ui;
}
@layer base {
  [data-theme="dark"] {
    --color-surface: #0F1C2B;
  }
}
`;

const round = (n) => Math.round(n * 10) / 10;

test('contrast ratio of black on white is 21', () => {
  assert.equal(round(contrast('#000000', '#FFFFFF')), 21);
});

test('contrast is symmetric and 1 for equal colors', () => {
  assert.equal(round(contrast('#FFFFFF', '#000000')), 21);
  assert.equal(contrast('#12263A', '#12263A'), 1);
});

test('reads light tokens from @theme and dark tokens from [data-theme="dark"]', () => {
  const { light, dark } = readTokens(CSS_FIXTURE);
  assert.equal(light['--color-surface'], '#FBF8F1');
  assert.equal(dark['--color-surface'], '#0F1C2B');
});

test('dark falls back to light when a token is not overridden', () => {
  const { dark } = readTokens(CSS_FIXTURE);
  assert.equal(dark['--color-ink'], '#1E2430');
});

test('ignores tokens that are not colors', () => {
  const { light } = readTokens(CSS_FIXTURE);
  assert.equal(light['--font-sans'], undefined);
});

test('reports a failing pair with both colors and the ratio', () => {
  const problems = checkPairs(
    { '--color-ink': '#AAAAAA', '--color-surface': '#FFFFFF' },
    [['--color-ink', '--color-surface']],
  );
  assert.equal(problems.length, 1);
  assert.match(problems[0], /--color-ink.*--color-surface.*2\.\d/);
});

test('reports a missing token instead of throwing', () => {
  const problems = checkPairs({ '--color-surface': '#FFFFFF' }, [['--color-ink', '--color-surface']]);
  assert.match(problems[0], /--color-ink/);
});

test('passing pairs produce no problems', () => {
  assert.deepEqual(checkPairs({ '--a': '#000000', '--b': '#FFFFFF' }, [['--a', '--b']]), []);
});
