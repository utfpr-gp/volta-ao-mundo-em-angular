import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export interface Item {
  code: string;
  name: string;
  flag: string;
}

export type Status = 'kept' | 'updated' | 'created';

export interface DomNode {
  id: number;
  item: Item;
  status: Status;
}

export type TrackMode = 'code' | 'index';

export interface Stats {
  kept: number;
  updated: number;
  created: number;
  removed: number;
}

const START: Item[] = [
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'JP', name: 'Japão', flag: '🇯🇵' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'IT', name: 'Itália', flag: '🇮🇹' },
];

const POOL: Item[] = [
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'EG', name: 'Egito', flag: '🇪🇬' },
];

export function initialNodes(): { nodes: DomNode[]; nextId: number } {
  return { nodes: START.map((item, i) => ({ id: i + 1, item, status: 'kept' })), nextId: START.length + 1 };
}

/**
 * Imita o que o @for faz com os elementos da página: para cada item novo, procura um nó antigo com a
 * mesma chave do track. Achou e é o mesmo país: reaproveita. Achou, mas é outro país: reescreve o conteúdo.
 * Não achou: cria um nó novo. Nós antigos sem chave correspondente são removidos.
 */
export function reconcile(previous: DomNode[], items: Item[], mode: TrackMode, nextId: number) {
  const key = (item: Item, index: number) => (mode === 'code' ? item.code : String(index));
  const oldByKey = new Map(previous.map((node, index) => [key(node.item, index), node]));
  const stats: Stats = { kept: 0, updated: 0, created: 0, removed: 0 };
  const used = new Set<number>();
  const nodes = items.map((item, index): DomNode => {
    const old = oldByKey.get(key(item, index));
    if (old && !used.has(old.id)) {
      used.add(old.id);
      const status: Status = old.item.code === item.code ? 'kept' : 'updated';
      stats[status]++;
      return { id: old.id, item, status };
    }
    stats.created++;
    return { id: nextId++, item, status: 'created' };
  });
  stats.removed = previous.filter((node) => !used.has(node.id)).length;
  return { nodes, nextId, stats };
}

const STATUS_CLASS: Record<Status, string> = {
  kept: 'border-code bg-code/10',
  updated: 'border-highlight bg-highlight/20',
  created: 'border-challenge bg-challenge/12',
};

/** Simulador do capítulo 11: o mesmo @for com track pelo código e com track $index. */
@Component({
  selector: 'vm-track-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">O que o track economiza</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Cada cartão é um nó da página, com um número que não muda enquanto ele existir. Mude a lista e compare os dois tipos de track.
        </span>
      </figcaption>

      <fieldset class="flex flex-wrap gap-4 text-ink">
        <legend class="sr-only">Tipo de track</legend>
        <label class="flex items-center gap-2 font-mono text-sm">
          <input type="radio" name="track" class="size-4 accent-challenge" [checked]="mode() === 'code'" (change)="setMode('code')" />
          track country.code
        </label>
        <label class="flex items-center gap-2 font-mono text-sm">
          <input type="radio" name="track" class="size-4 accent-challenge" [checked]="mode() === 'index'" (change)="setMode('index')" />
          track $index
        </label>
      </fieldset>

      <div class="mt-4 flex flex-wrap gap-2">
        <button type="button" class="rounded-full bg-primary px-4 py-2 text-sm font-bold text-on-primary" (click)="addFirst()">Adicionar no começo</button>
        <button type="button" class="rounded-full bg-primary px-4 py-2 text-sm font-bold text-on-primary" (click)="removeFirst()">Remover o primeiro</button>
        <button type="button" class="rounded-full bg-primary px-4 py-2 text-sm font-bold text-on-primary" (click)="reverse()">Inverter a ordem</button>
        <button type="button" class="rounded-full border border-line px-4 py-2 text-sm font-bold text-ink" (click)="reset()">↺ Recomeçar</button>
      </div>

      <ol class="mt-5 flex flex-wrap gap-2">
        @for (node of nodes(); track node.id) {
          <li data-node class="w-28 rounded-xl border-2 p-2 text-center text-sm" [class]="statusClass[node.status]">
            <span class="block font-mono text-xs text-ink-muted">nó #{{ node.id }}</span>
            <span class="block text-2xl">{{ node.item.flag }}</span>
            <span class="block font-bold text-ink">{{ node.item.name }}</span>
          </li>
        }
      </ol>

      <p data-stats class="mt-4 flex flex-wrap gap-3 text-sm font-bold">
        <span class="rounded-full bg-code/12 px-3 py-1 text-code">{{ stats().kept }} reaproveitado{{ stats().kept === 1 ? '' : 's' }}</span>
        <span class="rounded-full bg-highlight/25 px-3 py-1 text-ink">{{ stats().updated }} reescrito{{ stats().updated === 1 ? '' : 's' }}</span>
        <span class="rounded-full bg-challenge/12 px-3 py-1 text-challenge">{{ stats().created }} criado{{ stats().created === 1 ? '' : 's' }}</span>
        <span class="rounded-full bg-line px-3 py-1 text-ink">{{ stats().removed }} removido{{ stats().removed === 1 ? '' : 's' }}</span>
      </p>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class TrackLab {
  protected readonly statusClass = STATUS_CLASS;
  protected readonly mode = signal<TrackMode>('code');
  protected readonly nodes = signal<DomNode[]>(initialNodes().nodes);
  protected readonly stats = signal<Stats>({ kept: 4, updated: 0, created: 0, removed: 0 });
  private nextId = initialNodes().nextId;
  private poolIndex = 0;
  protected readonly announcement = computed(() => {
    const s = this.stats();
    const track = this.mode() === 'code' ? 'track country.code' : 'track $index';
    return `Com ${track}: ${s.kept} reaproveitados, ${s.updated} reescritos, ${s.created} criados e ${s.removed} removidos.`;
  });

  protected setMode(mode: TrackMode): void {
    this.mode.set(mode);
    this.reset();
  }

  protected addFirst(): void {
    const item = POOL[this.poolIndex++ % POOL.length];
    this.apply([{ ...item, code: `${item.code}${this.poolIndex > POOL.length ? this.poolIndex : ''}` }, ...this.items()]);
  }

  protected removeFirst(): void {
    this.apply(this.items().slice(1));
  }

  protected reverse(): void {
    this.apply([...this.items()].reverse());
  }

  protected reset(): void {
    const start = initialNodes();
    this.nodes.set(start.nodes);
    this.nextId = start.nextId;
    this.poolIndex = 0;
    this.stats.set({ kept: start.nodes.length, updated: 0, created: 0, removed: 0 });
  }

  private items(): Item[] {
    return this.nodes().map((node) => node.item);
  }

  private apply(items: Item[]): void {
    const result = reconcile(this.nodes(), items, this.mode(), this.nextId);
    this.nextId = result.nextId;
    this.nodes.set(result.nodes);
    this.stats.set(result.stats);
  }
}
