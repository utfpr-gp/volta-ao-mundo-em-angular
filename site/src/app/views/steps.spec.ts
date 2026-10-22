import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StepDirective, Steps } from './steps';

@Component({
  imports: [Steps, StepDirective],
  template: `
    <vm-steps>
      <ng-template vmStep="Angular"><p>conteúdo angular</p></ng-template>
      <ng-template vmStep="React"><p>conteúdo react</p></ng-template>
      <ng-template vmStep="Vue"><p>conteúdo vue</p></ng-template>
    </vm-steps>
  `,
})
class Host {}

describe('Steps', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return fixture;
  };

  it('renders one tab per vmStep, numbered, with the first one selected', async () => {
    const element = (await render()).nativeElement as HTMLElement;
    const tabs = [...element.querySelectorAll('[role="tab"]')];
    expect(tabs.map((tab) => tab.textContent!.replace(/\s+/g, ' ').trim())).toEqual(['1 Angular', '2 React', '3 Vue']);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(element.textContent).toContain('conteúdo angular');
  });

  it('clicking a tab shows its content', async () => {
    const fixture = await render();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelectorAll<HTMLElement>('[role="tab"]')[1].click();
    await fixture.whenStable();
    expect(element.querySelectorAll('[role="tab"]')[1].getAttribute('aria-selected')).toBe('true');
    expect(element.querySelector('[role="tabpanel"]:not([inert])')?.textContent).toContain('conteúdo react');
  });

  it('arrow keys move between tabs', async () => {
    const fixture = await render();
    const element = fixture.nativeElement as HTMLElement;
    const tabs = element.querySelectorAll<HTMLElement>('[role="tab"]');
    tabs[0].focus();
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    expect(document.activeElement).toBe(tabs[1]);
  });
});
