import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProgressService } from '../progress/progress';
import { Home } from './home';

describe('Home', () => {
  const render = async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    return fixture;
  };
  afterEach(() => localStorage.clear());

  it('has the book title as h1 and a "Começar a viagem" link to chapter 1', async () => {
    const element = (await render()).nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain('Volta ao Mundo em Angular');
    const start = [...element.querySelectorAll('a')].find((link) => link.textContent?.includes('Começar a viagem'));
    expect(start?.getAttribute('href')).toBe('/capitulos/01-o-que-e-o-angular');
  });

  it('shows one card per track, linking to its page', async () => {
    const element = (await render()).nativeElement as HTMLElement;
    const cards = element.querySelectorAll('[data-track-card]');
    expect(cards.length).toBe(9);
    expect(cards[0].querySelector('a')?.getAttribute('href')).toBe('/trilhas/embarque');
  });

  it('explains the 7 views with their icons', async () => {
    const element = (await render()).nativeElement as HTMLElement;
    const views = element.querySelectorAll('[data-view-card]');
    expect(views.length).toBe(7);
    expect(views[0].textContent).toContain('🎯');
    expect(views[0].textContent).toContain('A missão');
  });

  it('shows the "Para ir além" topics', async () => {
    const text = ((await render()).nativeElement as HTMLElement).textContent!;
    expect(text).toContain('Para ir além');
    expect(text).toContain('Animações');
  });

  it('offers to continue from the first chapter without a stamp once there is progress', async () => {
    const fixture = await render();
    TestBed.inject(ProgressService).stamp('01-o-que-e-o-angular');
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const resume = [...element.querySelectorAll('a')].find((link) => link.textContent?.includes('Continuar a viagem'));
    expect(resume?.getAttribute('href')).toBe('/capitulos/02-preparando-o-ambiente');
  });
});
