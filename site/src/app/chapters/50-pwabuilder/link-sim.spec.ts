import { TestBed } from '@angular/core/testing';
import { LinkSim, verify } from './link-sim';

describe('verify', () => {
  it('needs the file, the same package and the key that signed the installed app', () => {
    expect(verify({ file: false, samePackage: true, playKey: true, install: 'apk' }).trusted).toBe(false);
    expect(verify({ file: true, samePackage: false, playKey: true, install: 'apk' }).trusted).toBe(false);
    expect(verify({ file: true, samePackage: true, playKey: false, install: 'apk' }).trusted).toBe(true);
    expect(verify({ file: true, samePackage: true, playKey: false, install: 'loja' }).trusted).toBe(false);
    expect(verify({ file: true, samePackage: true, playKey: true, install: 'loja' }).trusted).toBe(true);
  });
});

describe('LinkSim', () => {
  it('announces when the address bar goes away', async () => {
    const fixture = TestBed.createComponent(LinkSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const result = () => element.querySelector('[data-result]')!.textContent!.trim();
    expect(element.querySelector('[data-result]')!.getAttribute('aria-live')).toBe('polite');
    expect(result()).toContain('barra de endereço do navegador');
    element.querySelector<HTMLInputElement>('[data-file]')!.click();
    await fixture.whenStable();
    expect(result()).toContain('sem barra de endereço');
    element.querySelector<HTMLInputElement>('input[value="loja"]')!.click();
    await fixture.whenStable();
    expect(result()).toContain('barra de endereço do navegador');
    expect(element.querySelectorAll('[data-ok="false"]').length).toBe(1);
  });
});
