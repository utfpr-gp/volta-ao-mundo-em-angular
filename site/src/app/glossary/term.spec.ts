import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GLOSSARY } from './glossary';
import { Term } from './term';

@Component({
  imports: [Term],
  template: `<p>Uma <vm-term name="spa">aplicação de página única</vm-term> carrega uma vez.</p>`,
})
class Host {}

describe('Term', () => {
  it('renders a link to /glossario#<name> with the definition as accessible description', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const link = element.querySelector('a')!;
    expect(link.getAttribute('href')).toBe('/glossario#spa');
    expect(link.textContent).toContain('aplicação de página única');
    const description = element.querySelector(`#${link.getAttribute('aria-describedby')}`);
    expect(description?.textContent).toContain(GLOSSARY.spa.definition);
    expect(description?.getAttribute('role')).toBe('tooltip');
  });
});
