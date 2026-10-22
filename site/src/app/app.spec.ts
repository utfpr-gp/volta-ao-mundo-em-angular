import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { ProgressService } from './progress/progress';

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn() }));
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('renders the skip link, the top bar with the 9 tracks, the main area and the footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('a[href="#conteudo"]')?.textContent).toContain('Pular para o conteúdo');
    expect(element.querySelectorAll('nav[aria-label="Trilhas"] a').length).toBe(9);
    expect(element.querySelector('main#conteudo')).toBeTruthy();
    expect(element.querySelector('vm-footer')).toBeTruthy();
  });

  it('shows the stamp count in the top bar, linking to the passport', async () => {
    const fixture = TestBed.createComponent(App);
    TestBed.inject(ProgressService).stamp('09-signals');
    await fixture.whenStable();
    const link = (fixture.nativeElement as HTMLElement).querySelector('vm-top-bar a[href="/passaporte"]');
    expect(link?.textContent?.replace(/\s+/g, ' ')).toContain('1/50');
    expect(link?.getAttribute('aria-label')).toBe('Meu passaporte: 1 de 50 carimbos');
  });
});
