import { TestBed } from '@angular/core/testing';
import { answer, HostSim } from './host-sim';

describe('answer', () => {
  it('serves the prerendered folder only when no rule takes the address', () => {
    expect(answer('nenhuma', '/sobre')).toMatchObject({ status: 200 });
    expect(answer('passaporte', '/paises/JP/visao-geral').result).toContain('pronta do build');
    expect(answer('csr', '/sobre').result).toContain('casco vazio');
  });

  it('gives Not Found without rules, and the 404.html with the setup of the Passaporte', () => {
    expect(answer('nenhuma', '/passaporte')).toMatchObject({ status: 404, result: 'Chega só o texto "Not Found". O app nem abre.' });
    expect(answer('passaporte', '/passaporte')).toMatchObject({ status: 200 });
    expect(answer('passaporte', '/paises/ZZ')).toMatchObject({ status: 404 });
    expect(answer('passaporte', '/paises/ZZ').result).toContain('Esta página não existe');
  });

  it('loops with the rule to /index.html', () => {
    expect(answer('index', '/paises/JP/clima').result).toContain('recarrega sem parar');
  });
});

describe('HostSim', () => {
  it('announces the answer and follows the chosen setup and address', async () => {
    const fixture = TestBed.createComponent(HostSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const result = () => element.querySelector('[data-result]')!.textContent!.trim();
    expect(element.querySelector('[data-result]')!.getAttribute('aria-live')).toBe('polite');
    expect(result()).toContain('HTTP 404');
    element.querySelector<HTMLInputElement>('input[value="passaporte"]')!.click();
    await fixture.whenStable();
    expect(result()).toContain('HTTP 200');
    element.querySelector<HTMLInputElement>('input[value="/paises/ZZ"]')!.click();
    await fixture.whenStable();
    expect(result()).toContain('HTTP 404');
    expect(element.querySelectorAll('[data-steps] li').length).toBe(4);
  });
});
