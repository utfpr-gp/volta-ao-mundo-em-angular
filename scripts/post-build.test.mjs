import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SITE_URL, buildSitemap, canonicalUrl, copyNotFound, listPages, robotsTxt } from './post-build.mjs';

const page = (extra = '') => `<!doctype html><html lang="pt-BR"><head>${extra}</head><body></body></html>`;

function fakeSite() {
  const root = mkdtempSync(join(tmpdir(), 'site-'));
  const write = (path, html) => {
    mkdirSync(join(root, path), { recursive: true });
    writeFileSync(join(root, path, 'index.html'), html);
  };
  write('', page());
  write('sobre', page());
  write('capitulos/01-o-que-e-o-angular', page());
  write('capitulos/50-pwabuilder', page('<meta name="robots" content="noindex">').replace('<body>', '<body><div data-coming-soon>'));
  write('404', page('<meta name="robots" content="noindex">') + '<!-- 404 -->');
  return root;
}

test('canonicalUrl matches the site version (trailing slash, home = SITE_URL/)', () => {
  assert.equal(canonicalUrl(''), `${SITE_URL}/`);
  assert.equal(canonicalUrl('capitulos/09-signals'), `${SITE_URL}/capitulos/09-signals/`);
});

test('listPages finds every index.html as a site path', () => {
  const pages = listPages(fakeSite()).map((p) => p.path).sort();
  assert.deepEqual(pages, ['', '404', 'capitulos/01-o-que-e-o-angular', 'capitulos/50-pwabuilder', 'sobre']);
});

test('sitemap lists every index.html except 404 and noindex / coming-soon pages, as canonical URLs', () => {
  const xml = buildSitemap(listPages(fakeSite()));
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
  assert.deepEqual(urls, [`${SITE_URL}/`, `${SITE_URL}/capitulos/01-o-que-e-o-angular/`, `${SITE_URL}/sobre/`]);
});

test('robots.txt allows all and points to the sitemap URL', () => {
  assert.equal(robotsTxt(), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
});

test('404.html is a copy of 404/index.html', () => {
  const root = fakeSite();
  copyNotFound(root);
  assert.equal(readFileSync(join(root, '404.html'), 'utf8'), readFileSync(join(root, '404', 'index.html'), 'utf8'));
});
