import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ChapterPage } from './chapter-page';
import { View } from './view';

@Component({
  imports: [ChapterPage, View],
  template: `
    <vm-chapter-page slug="09-signals">
      <vm-view kind="mission" title="Missão">m</vm-view>
      <vm-view kind="idea" title="Ideia">i</vm-view>
      <vm-view kind="inside" title="Por dentro">d</vm-view>
      <vm-view kind="code" title="Código">c</vm-view>
      <vm-view kind="pitfalls" title="Armadilhas">a</vm-view>
      <vm-view kind="challenge" title="Desafio">q</vm-view>
      <vm-view kind="further" title="Além">l</vm-view>
    </vm-chapter-page>
  `,
})
class Host {}

describe('ChapterPage', () => {
  const render = async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  it('renders the header with the chapter question as h1', async () => {
    const element = await render();
    expect(element.querySelector('h1')?.textContent).toContain('Como guardar estado que atualiza a tela com');
  });

  it('renders the 7 view sections in the fixed order inside the searchable article', async () => {
    const element = await render();
    const ids = [...element.querySelectorAll('article[data-pagefind-body] section')].map((section) => section.id);
    expect(ids).toEqual(['missao', 'ideia', 'por-dentro', 'mao-no-codigo', 'armadilhas', 'desafio', 'para-ir-alem']);
    expect(element.querySelector('article')?.getAttribute('data-chapter')).toBe('09-signals');
  });

  it('toc lists the 7 views and links to #missao … #para-ir-alem', async () => {
    const element = await render();
    const toc = element.querySelector('nav[aria-label="Neste capítulo"]')!;
    const fragments = [...toc.querySelectorAll('a')].map((link) => link.getAttribute('href')?.split('#')[1]);
    expect(fragments).toEqual(['missao', 'ideia', 'por-dentro', 'mao-no-codigo', 'armadilhas', 'desafio', 'para-ir-alem']);
  });

  it('shows the passport of the track in the side column', async () => {
    const element = await render();
    expect(element.querySelectorAll('aside vm-stamp').length).toBe(9);
  });

  it('shows previous and next chapters at the end', async () => {
    const element = await render();
    const nav = element.querySelector('nav[aria-label="Capítulos vizinhos"]')!;
    expect(nav.textContent).toContain('Capítulo 8');
    expect(nav.textContent).toMatch(/Próxima parada: capítulo 10/);
  });

  it('links to the Passaporte stage on GitHub and StackBlitz when the chapter has one', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ChapterPage);
    fixture.componentRef.setInput('slug', '05-angular-cli');
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const hrefs = [...element.querySelectorAll('[data-stage] a')].map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual([
      'https://github.com/utfpr-gp/volta-ao-mundo-em-angular/tree/main/passaporte/etapas/05-angular-cli',
      'https://stackblitz.com/github/utfpr-gp/volta-ao-mundo-em-angular/tree/main/passaporte/etapas/05-angular-cli',
    ]);
  });

  it('has no stage card when the chapter has no stage', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ChapterPage);
    fixture.componentRef.setInput('slug', '01-o-que-e-o-angular');
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('[data-stage]')).toBeNull();
  });
});
