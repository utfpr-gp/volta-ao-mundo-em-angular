import { TestBed } from '@angular/core/testing';
import { Passport } from '../../../core/passport';
import { PassportPage } from './passport-page';

describe('PassportPage', () => {
  it('shows the stamps of the passport, and follows its changes', async () => {
    const fixture = TestBed.createComponent(PassportPage);
    await fixture.whenStable();
    const footer = () => (fixture.nativeElement as HTMLElement).querySelector('footer')!.textContent!;
    expect(footer()).toContain('3 de 6 carimbos');
    TestBed.inject(Passport).toggleVisited('JP');
    await fixture.whenStable();
    expect(footer()).toContain('4 de 6 carimbos');
  });
});
