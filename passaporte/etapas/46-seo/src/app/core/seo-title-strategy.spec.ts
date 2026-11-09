import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { startPassport } from '../../testing/passport-testing';
import { routes } from '../app.routes';
import { BRAZILIAN_LOCALE } from './locale';
import { SeoTitleStrategy } from './seo-title-strategy';
import { DEFAULT_DESCRIPTION, SITE_URL } from './site';

describe('SeoTitleStrategy', () => {
  let harness: RouterTestingHarness;
  const meta = (selector: string) => TestBed.inject(Meta).getTag(selector)?.content;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: TitleStrategy, useClass: SeoTitleStrategy },
        BRAZILIAN_LOCALE,
        provideHttpClientTesting(),
      ],
    });
    await startPassport();
    harness = await RouterTestingHarness.create();
  });

  it('writes the title, the description of the route and the sharing tags', async () => {
    await harness.navigateByUrl('/sobre');
    expect(TestBed.inject(Title).getTitle()).toBe('Sobre · Passaporte');
    expect(meta('name="description"')).toContain('app de exemplo do livro');
    expect(meta('property="og:title"')).toBe('Sobre · Passaporte');
    expect(meta('property="og:url"')).toBe(`${SITE_URL}/sobre`);
    expect(meta('property="og:image"')).toBe(`${SITE_URL}/og.png`);
  });

  it('describes each country with the data that came from the API', async () => {
    await harness.navigateByUrl('/paises/JP');
    expect(TestBed.inject(Title).getTitle()).toBe('Japão · Passaporte');
    expect(meta('name="description"')).toBe(
      'Japão: capital Tóquio, 123.802.000 habitantes. Marque como visitado, anote os planos e veja o tempo agora no Passaporte.',
    );
    expect(meta('property="og:url"')).toBe(`${SITE_URL}/paises/JP/visao-geral`);
  });

  it('falls back to the default description on a page without one', async () => {
    await harness.navigateByUrl('/caminho-que-nao-existe');
    expect(meta('name="description"')).toBe(DEFAULT_DESCRIPTION);
  });
});
