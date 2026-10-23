import { TestBed } from '@angular/core/testing';
import { ProtoInspector } from './proto-inspector';

describe('ProtoInspector', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ProtoInspector);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const select = async (layer: string) => {
      element.querySelector<HTMLButtonElement>(`[data-layer="${layer}"]`)!.click();
      await fixture.whenStable();
    };
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    const angular = () => element.querySelector('[data-angular]')!.textContent!;
    return { element, select, click, angular };
  };

  it('translates the auto layout of the card into flexbox classes of a molecule', async () => {
    const { select, angular } = await render();
    await select('cartao');
    expect(angular()).toContain('StampCard');
    expect(angular()).toContain('molécula');
    expect(angular()).toContain('flex flex-col items-center gap-2');
  });

  it('finds the tokens of the stamp, including a new one', async () => {
    const { element, select } = await render();
    await select('carimbo');
    const tokens = element.querySelector('[data-tokens]')!.textContent!;
    expect(tokens).toContain('#C8102E');
    expect(tokens).toContain('--color-stamp');
    expect(tokens).toContain('--font-stamp');
  });

  it('turns the Figma variant into an input', async () => {
    const { element, select, click, angular } = await render();
    await select('carimbo');
    expect(angular()).toContain('[stamped]="true"');
    await click('Carimbado: não');
    expect(angular()).toContain('[stamped]="false"');
    expect(element.querySelector<HTMLElement>('[data-stamp-preview]')!.dataset['stamped']).toBe('false');
  });

  it('says when a layer is only layout and does not become a component', async () => {
    const { select, angular } = await render();
    await select('grade');
    expect(angular()).toContain('não vira componente');
    expect(angular()).toContain('grid grid-cols-3 gap-3');
  });
});
