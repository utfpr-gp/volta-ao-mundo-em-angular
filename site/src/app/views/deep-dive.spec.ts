import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DeepDive } from './deep-dive';

@Component({
  imports: [DeepDive],
  template: `<vm-deep-dive title="O motor Ivy"><p>texto escondido</p></vm-deep-dive>`,
})
class Host {}

describe('DeepDive', () => {
  it('is a closed <details> whose content is present in the DOM (prerender and search need it)', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const details = (fixture.nativeElement as HTMLElement).querySelector('details')!;
    expect(details.open).toBe(false);
    expect(details.querySelector('summary')?.textContent).toContain('Aprofundando: O motor Ivy');
    expect(details.textContent).toContain('texto escondido');
  });
});
