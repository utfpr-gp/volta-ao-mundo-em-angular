import { TestBed } from '@angular/core/testing';
import { Question } from '../chapters/types';
import { ProgressService } from '../progress/progress';
import { Challenge } from './challenge';

const QUESTIONS: Question[] = [
  {
    prompt: 'O que a SPA pede ao servidor depois do primeiro acesso?',
    alternatives: [
      { text: 'A página inteira', explanation: 'Isso era o site tradicional.' },
      { text: 'Só os dados, em `JSON`', correct: true, explanation: 'Isso: o resto já está na tela.' },
    ],
  },
  {
    prompt: 'O React é…',
    alternatives: [
      { text: 'uma biblioteca de interface', correct: true, explanation: 'Isso.' },
      { text: 'um framework completo', explanation: 'Ele mesmo se apresenta como biblioteca.' },
    ],
  },
];

describe('Challenge', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(Challenge);
    fixture.componentRef.setInput('slug', '01-o-que-e-o-angular');
    fixture.componentRef.setInput('questions', QUESTIONS);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const choose = async (question: number, alternative: number) => {
      element.querySelectorAll('[role="listbox"]')[question].querySelectorAll<HTMLElement>('[role="option"]')[alternative].click();
      await fixture.whenStable();
    };
    const check = async () => {
      element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
      await fixture.whenStable();
    };
    return { fixture, element, choose, check };
  };

  afterEach(() => localStorage.clear());

  it('renders one single-selection listbox per question, labelled by the prompt', async () => {
    const { element } = await render();
    const listboxes = element.querySelectorAll('[role="listbox"]');
    expect(listboxes.length).toBe(2);
    expect(listboxes[0].getAttribute('aria-multiselectable')).not.toBe('true');
    const labelId = listboxes[0].getAttribute('aria-labelledby')!;
    expect(element.querySelector(`#${labelId}`)?.textContent).toContain('O que a SPA pede');
    expect(listboxes[0].querySelector('code')?.textContent).toBe('JSON');
  });

  it('clicking an option selects it', async () => {
    const { element, choose } = await render();
    await choose(0, 1);
    const options = element.querySelectorAll('[role="listbox"]')[0].querySelectorAll('[role="option"]');
    expect(options[1].getAttribute('aria-selected')).toBe('true');
    expect(options[0].getAttribute('aria-selected')).not.toBe('true');
  });

  it('focus alone does not choose an answer (arrows move, space chooses)', async () => {
    const { fixture, element } = await render();
    const options = element.querySelectorAll('[role="listbox"]')[1].querySelectorAll<HTMLElement>('[role="option"]');
    options[0].focus();
    options[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fixture.whenStable();
    expect(options[0].getAttribute('aria-selected')).not.toBe('true');
    expect(options[1].getAttribute('aria-selected')).not.toBe('true');
    options[1].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await fixture.whenStable();
    expect(options[1].getAttribute('aria-selected')).toBe('true');
  });

  it('arrow keys move the focus between alternatives', async () => {
    const { fixture, element } = await render();
    const listbox = element.querySelectorAll<HTMLElement>('[role="listbox"]')[0];
    const options = listbox.querySelectorAll<HTMLElement>('[role="option"]');
    options[0].focus();
    options[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fixture.whenStable();
    expect(document.activeElement).toBe(options[1]);
  });

  it('unanswered questions get "Escolha uma alternativa." and no stamp', async () => {
    const { element, choose, check } = await render();
    await choose(0, 1);
    await check();
    expect(element.textContent).toContain('Escolha uma alternativa.');
    expect(TestBed.inject(ProgressService).hasStamp('01-o-que-e-o-angular')).toBe(false);
  });

  it('a wrong answer shows its explanation and the score, without stamping', async () => {
    const { element, choose, check } = await render();
    await choose(0, 0);
    await choose(1, 0);
    await check();
    expect(element.textContent).toContain('Isso era o site tradicional.');
    expect(element.querySelector('[aria-live="polite"]')?.textContent).toContain('1 de 2');
    expect(TestBed.inject(ProgressService).hasStamp('01-o-que-e-o-angular')).toBe(false);
  });

  it('all correct stamps the chapter once and announces it', async () => {
    const { element, choose, check } = await render();
    const progress = TestBed.inject(ProgressService);
    const stamp = vi.spyOn(progress, 'stamp');
    await choose(0, 1);
    await choose(1, 0);
    await check();
    expect(stamp).toHaveBeenCalledTimes(1);
    expect(progress.hasStamp('01-o-que-e-o-angular')).toBe(true);
    expect(element.querySelector('[aria-live="polite"]')?.textContent).toContain('Carimbo conquistado');
    expect(element.querySelector('vm-stamp [data-stamped]')).toBeTruthy();
  });

  it('changing an answer after checking clears the result', async () => {
    const { element, choose, check } = await render();
    await choose(0, 0);
    await check();
    expect(element.textContent).toContain('Isso era o site tradicional.');
    await choose(0, 1);
    expect(element.textContent).not.toContain('Isso era o site tradicional.');
  });

  it('a stamped chapter shows "Carimbo conquistado em dd/MM/yyyy" and still allows retrying', async () => {
    const { fixture, element } = await render();
    TestBed.inject(ProgressService).stamp('01-o-que-e-o-angular');
    await fixture.whenStable();
    expect(element.textContent).toMatch(/Carimbo conquistado em \d{2}\/\d{2}\/\d{4}/);
    expect(element.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('is left out of the search index', async () => {
    const { element } = await render();
    expect(element.querySelector('[data-pagefind-ignore]')).toBeTruthy();
  });
});
