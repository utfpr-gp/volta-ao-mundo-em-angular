import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SeeChapter } from './see-chapter';

describe('SeeChapter', () => {
  it('links to capitulos/<slug> with the plain question', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(SeeChapter);
    fixture.componentRef.setInput('number', 9);
    await fixture.whenStable();
    const link = (fixture.nativeElement as HTMLElement).querySelector('a')!;
    expect(link.getAttribute('href')).toBe('/capitulos/09-signals');
    expect(link.textContent).toContain('capítulo 9');
    expect(link.getAttribute('title')).toBe('Como guardar estado que atualiza a tela com signal() e computed()?');
  });
});
