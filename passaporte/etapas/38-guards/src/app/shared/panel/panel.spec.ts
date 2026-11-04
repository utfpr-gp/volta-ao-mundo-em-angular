import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Panel } from './panel';

@Component({
  imports: [Panel],
  template: `
    <app-panel>
      <span panel-title>Título</span>
      <p class="body">Conteúdo</p>
      <span panel-footer>Rodapé</span>
    </app-panel>
  `,
})
class Host {}

describe('Panel', () => {
  it('projects the title, the content and the footer into their slots', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('header')?.textContent).toContain('Título');
    expect(element.querySelector('section > .body')?.textContent).toBe('Conteúdo');
    expect(element.querySelector('footer')?.textContent).toContain('Rodapé');
  });
});
