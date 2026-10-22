import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { SeoService } from './seo';
import { SITE_URL, canonicalUrl } from './site';

const page = {
  title: 'Signals · Volta ao Mundo em Angular',
  description: 'Uma descrição de teste.',
  path: 'capitulos/09-signals',
  noindex: false,
  jsonLd: { '@type': 'LearningResource', name: 'Signals' },
};

describe('canonicalUrl', () => {
  it('adds the trailing slash and keeps the home at SITE_URL/', () => {
    expect(canonicalUrl('')).toBe(`${SITE_URL}/`);
    expect(canonicalUrl('capitulos/09-signals')).toBe(`${SITE_URL}/capitulos/09-signals/`);
    expect(canonicalUrl('/sobre/')).toBe(`${SITE_URL}/sobre/`);
  });
});

describe('SeoService', () => {
  let head: HTMLHeadElement;
  const meta = (selector: string) => head.querySelector(`meta[${selector}]`)?.getAttribute('content');

  beforeEach(() => {
    head = TestBed.inject(DOCUMENT).head;
  });

  it('sets <title>, description, Open Graph, Twitter card and canonical', () => {
    TestBed.inject(SeoService).apply(page);
    expect(TestBed.inject(DOCUMENT).title).toBe(page.title);
    expect(meta('name="description"')).toBe(page.description);
    expect(meta('property="og:title"')).toBe(page.title);
    expect(meta('property="og:description"')).toBe(page.description);
    expect(meta('property="og:url"')).toBe(`${SITE_URL}/capitulos/09-signals/`);
    expect(meta('property="og:image"')).toBe(`${SITE_URL}/og.png`);
    expect(meta('property="og:type"')).toBe('article');
    expect(meta('property="og:locale"')).toBe('pt_BR');
    expect(meta('property="og:site_name"')).toBe('Volta ao Mundo em Angular');
    expect(meta('name="twitter:card"')).toBe('summary_large_image');
    expect(head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${SITE_URL}/capitulos/09-signals/`);
  });

  it('uses og:type website for the home', () => {
    TestBed.inject(SeoService).apply({ ...page, path: '' });
    expect(meta('property="og:type"')).toBe('website');
  });

  it('replaces, never duplicates, the tags on a second call', () => {
    const seo = TestBed.inject(SeoService);
    seo.apply(page);
    seo.apply({ ...page, description: 'Outra.', path: 'sobre' });
    expect(head.querySelectorAll('meta[name="description"]').length).toBe(1);
    expect(head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
    expect(head.querySelectorAll('script[type="application/ld+json"]').length).toBe(1);
    expect(meta('name="description"')).toBe('Outra.');
  });

  it('noindex adds the robots tag and removes it on the next page', () => {
    const seo = TestBed.inject(SeoService);
    seo.apply({ ...page, noindex: true });
    expect(meta('name="robots"')).toBe('noindex');
    seo.apply(page);
    expect(head.querySelector('meta[name="robots"]')).toBeNull();
  });

  it('writes one JSON-LD script with the schema.org context', () => {
    TestBed.inject(SeoService).apply(page);
    const script = head.querySelector('script#jsonld[type="application/ld+json"]');
    expect(JSON.parse(script!.textContent!)).toEqual({ '@context': 'https://schema.org', ...page.jsonLd });
  });

  it('escapes "<" in JSON-LD so the script tag cannot be closed early', () => {
    TestBed.inject(SeoService).apply({ ...page, jsonLd: { name: '</script><b>' } });
    expect(head.querySelector('script#jsonld')!.textContent).not.toContain('</script>');
  });
});
