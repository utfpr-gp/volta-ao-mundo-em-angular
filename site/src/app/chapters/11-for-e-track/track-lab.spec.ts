import { TestBed } from '@angular/core/testing';
import { TrackLab, initialNodes, reconcile } from './track-lab';

const AR = { code: 'AR', name: 'Argentina', flag: '🇦🇷' };

describe('reconcile (modelo do track)', () => {
  it('track by code: adding at the top creates one node and keeps the others', () => {
    const start = initialNodes();
    const items = [AR, ...start.nodes.map((node) => node.item)];
    const result = reconcile(start.nodes, items, 'code', start.nextId);
    expect(result.stats).toEqual({ kept: 4, updated: 0, created: 1, removed: 0 });
  });

  it('track by $index: adding at the top rewrites every old node and creates one at the end', () => {
    const start = initialNodes();
    const items = [AR, ...start.nodes.map((node) => node.item)];
    const result = reconcile(start.nodes, items, 'index', start.nextId);
    expect(result.stats).toEqual({ kept: 0, updated: 4, created: 1, removed: 0 });
  });

  it('track by code: removing the first item removes exactly that node', () => {
    const start = initialNodes();
    const items = start.nodes.slice(1).map((node) => node.item);
    expect(reconcile(start.nodes, items, 'code', start.nextId).stats).toEqual({ kept: 3, updated: 0, created: 0, removed: 1 });
  });

  it('track by $index: removing the first item rewrites three nodes and removes the last one', () => {
    const start = initialNodes();
    const items = start.nodes.slice(1).map((node) => node.item);
    expect(reconcile(start.nodes, items, 'index', start.nextId).stats).toEqual({ kept: 0, updated: 3, created: 0, removed: 1 });
  });
});

describe('TrackLab', () => {
  it('shows the stats of the last operation and announces them', async () => {
    const fixture = TestBed.createComponent(TrackLab);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes('Adicionar no começo'))!.click();
    await fixture.whenStable();
    expect(element.querySelector('[data-stats]')!.textContent).toContain('1 criado');
    expect(element.querySelector('[data-announce]')!.textContent).toContain('track country.code');
    expect(element.querySelectorAll('[data-node]').length).toBe(5);
  });
});
