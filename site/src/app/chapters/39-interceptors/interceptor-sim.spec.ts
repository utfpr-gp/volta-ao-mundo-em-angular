import { TestBed } from '@angular/core/testing';
import { InterceptorSim } from './interceptor-sim';

describe('InterceptorSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(InterceptorSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const send = async () => {
      element.querySelector<HTMLButtonElement>('button')!.click();
      await fixture.whenStable();
    };
    const click = async (selector: string) => {
      element.querySelector<HTMLInputElement>(selector)!.click();
      await fixture.whenStable();
    };
    const trace = () => [...element.querySelectorAll('[data-trace] li')].map((li) => li.textContent!.trim());
    const headers = () => element.querySelector('[data-headers]')?.textContent?.trim() ?? null;
    const announced = () => element.querySelector('[data-announce]')!.textContent!.trim();
    return { send, click, trace, headers, announced };
  };

  it('puts the token on a request to the Passport API, and the way back runs in reverse', async () => {
    const { send, trace, headers, announced } = await render();
    await send();
    expect(trace()[0]).toContain('loadingInterceptor: start()');
    expect(trace()[1]).toContain('clone com Authorization');
    expect(trace()).toContain('● servidor: 200 OK');
    expect(trace().at(-2)).toContain('loadingInterceptor: finalize');
    expect(headers()).toContain('Authorization: Bearer');
    expect(announced()).toBe('quem pediu recebe a resposta');
  });

  it('never sends the token to another site', async () => {
    const { send, click, trace, headers } = await render();
    await click('input[value="get-countries"]');
    await send();
    expect(trace()[1]).toContain('não é a API do Passaporte; passa sem token');
    expect(headers()).toBeNull();
  });

  it('sends no token when nobody signed in', async () => {
    const { send, click, trace, headers } = await render();
    await click('#sim-signed-in');
    await send();
    expect(trace()[1]).toContain('ninguém entrou: passa sem token');
    expect(headers()).toBeNull();
  });

  it('with the server off, the errorInterceptor raises the warning and passes the error on, and the bar still goes away', async () => {
    const { send, click, trace, announced } = await render();
    await click('input[value="put-passport"]');
    await click('#sim-server');
    await send();
    expect(trace()).toContain('● servidor: ninguém respondeu (status 0)');
    expect(trace()).toContain('← errorInterceptor: failed = true, o aviso aparece; repassa o erro (throwError)');
    expect(trace().at(-2)).toContain('a barra some');
    expect(announced()).toBe('quem pediu recebe o erro');
  });
});
