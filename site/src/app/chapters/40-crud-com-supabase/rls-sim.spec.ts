import { TestBed } from '@angular/core/testing';
import { RlsSim } from './rls-sim';

describe('RlsSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(RlsSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (selector: string) => {
      element.querySelector<HTMLInputElement>(selector)!.click();
      await fixture.whenStable();
    };
    const send = async () => {
      [...element.querySelectorAll('button')].find((b) => b.textContent!.includes('Enviar'))!.click();
      await fixture.whenStable();
    };
    const answer = () => [...element.querySelectorAll('[data-answer] p')].map((p) => p.textContent!.trim()).join(' ');
    const explain = () => element.querySelector('[data-explain]')!.textContent!.trim();
    const rows = () => [...element.querySelectorAll('[data-row]')].map((tr) => [...tr.querySelectorAll('td')].map((td) => td.textContent!.trim()).join(' '));
    const announced = () => element.querySelector('[data-announce]')!.textContent!.trim();
    return { click, send, answer, explain, rows, announced };
  };

  it('lets Ana read only her own trips', async () => {
    const { send, answer, announced } = await render();
    await send();
    expect(answer()).toContain('200 OK');
    expect(answer()).toContain('"country":"JP"');
    expect(answer()).toContain('"country":"PT"');
    expect(answer()).not.toContain('"country":"IT"');
    expect(announced()).toContain('200 OK');
  });

  it('gives an empty list, with no error, to whoever did not sign in', async () => {
    const { click, send, answer, explain } = await render();
    await click('input[value="ninguem"]');
    await send();
    expect(answer()).toContain('200 OK []');
    expect(explain()).toContain('sem erro nenhum');
  });

  it('refuses a new row from whoever did not sign in, with the real message', async () => {
    const { click, send, answer } = await render();
    await click('input[value="ninguem"]');
    await click('input[value="insert"]');
    await send();
    expect(answer()).toContain('401 Unauthorized');
    expect(answer()).toContain('new row violates row-level security policy for table \\"trips\\"');
  });

  it('answers 204 to Bruno, but keeps the trip of Ana', async () => {
    const { click, send, answer, rows } = await render();
    await click('input[value="bruno"]');
    await click('input[value="delete"]');
    await send();
    expect(answer()).toContain('204 No Content');
    expect(rows()).toHaveLength(3);
  });

  it('without RLS, anyone reads everything and Bruno changes the trip of Ana', async () => {
    const { click, send, answer, rows } = await render();
    await click('#sim-rls');
    await click('input[value="ninguem"]');
    await send();
    expect(answer()).toContain('"country":"IT"');
    expect(answer()).toContain('"country":"JP"');
    await click('input[value="bruno"]');
    await click('input[value="update"]');
    await send();
    expect(rows()[0]).toBe('1 Ana JP 1');
  });

  it('creates a row with the user_id of whoever asked', async () => {
    const { click, send, rows } = await render();
    await click('input[value="bruno"]');
    await click('input[value="insert"]');
    await send();
    expect(rows().at(-1)).toBe('4 Bruno CA 4');
  });
});
