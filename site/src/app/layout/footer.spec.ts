import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';

describe('Footer', () => {
  it('shows the exact credit line and both licenses', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Footer);
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent!.replace(/\s+/g, ' ');
    expect(text).toContain(
      'Volta ao Mundo em Angular · Prof. Roni Fabio Banaszewski · Tecnologia em Sistemas para Internet · UTFPR Guarapuava',
    );
    expect(text).toContain('CC BY 4.0');
    expect(text).toContain('MIT');
  });
});
