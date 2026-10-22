import { TestBed } from '@angular/core/testing';
import { BindingFlow } from './binding-flow';

describe('BindingFlow', () => {
  const render = async (mode: 'property' | 'event') => {
    const fixture = TestBed.createComponent(BindingFlow);
    fixture.componentRef.setInput('mode', mode);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const preview = () => element.querySelector('[data-preview]')!;
    const announce = () => element.querySelector('[data-announce]')!.textContent!;
    return { fixture, element, preview, announce };
  };

  it('property mode: editing the class value updates the screen and highlights the binding', async () => {
    const { fixture, element, preview, announce } = await render('property');
    const name = element.querySelector<HTMLInputElement>('input#classe-name')!;
    name.value = 'Peru';
    name.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(preview().querySelector('h2')!.textContent).toBe('Peru');
    expect(element.querySelector('[data-line="name"]')!.hasAttribute('data-active')).toBe(true);
    expect(announce()).toContain('classe → tela');
  });

  it('property mode: the visited checkbox disables the preview button through [disabled]', async () => {
    const { fixture, element, preview } = await render('property');
    element.querySelector<HTMLInputElement>('input#classe-visited')!.click();
    await fixture.whenStable();
    expect(preview().querySelector<HTMLButtonElement>('button')!.disabled).toBe(true);
  });

  it('event mode: clicking the preview button runs the method and changes the class', async () => {
    const { fixture, element, preview, announce } = await render('event');
    preview().querySelector<HTMLButtonElement>('button')!.click();
    await fixture.whenStable();
    expect(element.querySelector('[data-class]')!.textContent).toContain('visited: true');
    expect(element.querySelector('[data-line="click"]')!.hasAttribute('data-active')).toBe(true);
    expect(announce()).toContain('tela → classe');
  });

  it('event mode: typing in the preview field sends the text to the class and back to the screen', async () => {
    const { fixture, preview } = await render('event');
    const field = preview().querySelector<HTMLInputElement>('input')!;
    field.value = 'Lima';
    field.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(preview().textContent).toContain('Você digitou: Lima');
  });

  it('property mode has no clickable preview button behavior in the template lines', async () => {
    const { element } = await render('property');
    expect(element.querySelector('[data-line="click"]')).toBeNull();
  });
});
