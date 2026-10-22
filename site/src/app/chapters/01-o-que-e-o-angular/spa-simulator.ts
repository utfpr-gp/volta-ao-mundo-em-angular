import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export type Mode = 'traditional' | 'spa';
export type Section = 'paises' | 'visitados' | 'desejados';
export type Region = 'header' | 'content' | 'footer';

export interface Request {
  path: string;
  kind: string;
  kb: number;
}

export interface Side {
  mode: Mode;
  section: Section;
  requests: Request[];
  redrawn: Region[];
  totalKb: number;
  clicks: number;
}

/** Tamanhos ilustrativos: uma página HTML inteira, a primeira carga de uma SPA e uma resposta em JSON. */
const PAGE_KB = 48;
const SPA_FIRST_LOAD_KB = 210;
const JSON_KB = 2;

const SECTIONS: { id: Section; label: string; countries: string[] }[] = [
  { id: 'paises', label: 'Países', countries: ['🇧🇷 Brasil', '🇯🇵 Japão', '🇵🇹 Portugal'] },
  { id: 'visitados', label: 'Visitados', countries: ['🇧🇷 Brasil', '🇦🇷 Argentina', '🇵🇹 Portugal'] },
  { id: 'desejados', label: 'Desejados', countries: ['🇯🇵 Japão', '🇮🇹 Itália', '🇨🇦 Canadá'] },
];

export function initialSide(mode: Mode): Side {
  const request: Request =
    mode === 'traditional'
      ? { path: '/paises', kind: 'HTML', kb: PAGE_KB }
      : { path: '/', kind: 'HTML + JavaScript do app', kb: SPA_FIRST_LOAD_KB };
  return { mode, section: 'paises', requests: [request], redrawn: [], totalKb: request.kb, clicks: 0 };
}

/** O que acontece quando alguém clica num link do menu, em cada tipo de site. */
export function navigate(side: Side, section: Section): Side {
  const request: Request =
    side.mode === 'traditional'
      ? { path: `/${section}`, kind: 'HTML', kb: PAGE_KB }
      : { path: `/api/${section}`, kind: 'JSON', kb: JSON_KB };
  return {
    ...side,
    section,
    requests: [...side.requests, request],
    redrawn: side.mode === 'traditional' ? ['header', 'content', 'footer'] : ['content'],
    totalKb: side.totalKb + request.kb,
    clicks: side.clicks + 1,
  };
}

const REGION_BASE = 'transition-shadow duration-300';
const REDRAWN = 'ring-4 ring-highlight motion-safe:animate-redraw';

/**
 * Simulador do capítulo 1: o mesmo app de países como site tradicional (cada clique baixa a
 * página inteira) e como SPA (cada clique pede só os dados e troca só o miolo da tela).
 */
@Component({
  selector: 'vm-spa-simulator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5 flex flex-wrap items-start justify-between gap-3">
        <span>
          <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
          <span class="block text-xl font-extrabold text-ink">Do clique à página nova × SPA</span>
          <span class="mt-1 block max-w-2xl text-ink-muted">
            Clique no menu de cada lado e compare o que é redesenhado e o que viaja pela rede. Os tamanhos são ilustrativos.
          </span>
        </span>
        <button
          type="button"
          class="rounded-full border border-line bg-surface-raised px-4 py-2 text-sm font-bold text-ink hover:border-link"
          (click)="reset()"
        >
          ↺ Recomeçar
        </button>
      </figcaption>

      <div class="grid gap-6 lg:grid-cols-2">
        @for (side of sides(); track side.mode) {
          <section [attr.data-side]="side.mode" [attr.aria-labelledby]="'sim-' + side.mode">
            <h4 [id]="'sim-' + side.mode" class="mb-2 flex items-center gap-2 font-extrabold text-ink">
              <span aria-hidden="true">{{ side.mode === 'traditional' ? '🐢' : '⚡' }}</span>
              {{ side.mode === 'traditional' ? 'Site tradicional' : 'Aplicação de página única (SPA)' }}
            </h4>

            <div class="overflow-hidden rounded-2xl border border-line bg-surface-raised shadow-sm">
              <div class="flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
                <span aria-hidden="true" class="flex gap-1">
                  <span class="size-2 rounded-full bg-stamp/60"></span>
                  <span class="size-2 rounded-full bg-highlight/70"></span>
                  <span class="size-2 rounded-full bg-code/60"></span>
                </span>
                <span class="flex-1 truncate rounded-full bg-surface-raised px-3 py-0.5 font-mono text-xs text-ink-muted">
                  passaporte.app/{{ side.section }}
                </span>
              </div>

              @for (render of [side.clicks]; track render) {
                <div class="flex flex-col gap-2 p-3">
                  <div data-region="header" [attr.data-redrawn]="redrawn(side, 'header')" [class]="regionClass(side, 'header')" class="rounded-xl bg-primary px-3 py-2 text-on-primary">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="font-extrabold">🛂 Passaporte</span>
                      <nav class="ml-auto flex gap-1" [attr.aria-label]="'Menu do ' + (side.mode === 'traditional' ? 'site tradicional' : 'app SPA')">
                        @for (section of sections; track section.id) {
                          <button
                            type="button"
                            class="rounded-full px-2.5 py-1 text-xs font-bold"
                            [class]="side.section === section.id ? 'bg-highlight text-primary' : 'bg-primary-soft text-on-primary-muted hover:text-on-primary'"
                            [attr.aria-current]="side.section === section.id ? 'true' : null"
                            (click)="go(side.mode, section.id)"
                          >
                            {{ section.label }}
                          </button>
                        }
                      </nav>
                    </div>
                  </div>
                  <div data-region="content" [attr.data-redrawn]="redrawn(side, 'content')" [class]="regionClass(side, 'content')" class="min-h-28 rounded-xl border border-line px-3 py-2">
                    <p class="text-xs font-extrabold uppercase tracking-wider text-ink-muted">{{ labelOf(side.section) }}</p>
                    <ul class="mt-1 flex flex-col gap-1 text-sm font-semibold text-ink">
                      @for (country of countriesOf(side.section); track country) {
                        <li>{{ country }}</li>
                      }
                    </ul>
                  </div>
                  <div data-region="footer" [attr.data-redrawn]="redrawn(side, 'footer')" [class]="regionClass(side, 'footer')" class="rounded-xl bg-surface px-3 py-1.5 text-xs text-ink-muted">
                    Passaporte · 195 países para conhecer
                  </div>
                </div>
              }
            </div>

            <dl class="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div class="rounded-xl bg-surface-raised px-3 py-2">
                <dt class="text-xs font-bold text-ink-muted">Redesenhado no último clique</dt>
                <dd class="text-lg font-extrabold text-ink">{{ side.clicks ? side.redrawn.length + ' de 3 partes' : '—' }}</dd>
              </div>
              <div class="rounded-xl bg-surface-raised px-3 py-2">
                <dt class="text-xs font-bold text-ink-muted">Total baixado</dt>
                <dd class="text-lg font-extrabold text-ink">{{ side.totalKb }} KB</dd>
              </div>
            </dl>

            <p class="mt-3 text-xs font-extrabold uppercase tracking-wider text-ink-muted">Pedidos ao servidor</p>
            <ol class="mt-1 flex max-h-40 flex-col-reverse gap-1 overflow-y-auto font-mono text-xs">
              @for (request of side.requests; track $index) {
                <li class="rounded-lg bg-surface-raised px-2.5 py-1.5 text-ink">
                  GET {{ request.path }} → <strong>{{ request.kind }}</strong> · {{ request.kb }} KB
                </li>
              }
            </ol>
          </section>
        }
      </div>

      <p aria-live="polite" class="mt-5 min-h-6 rounded-xl bg-surface-raised px-4 py-2 font-semibold text-ink empty:hidden">{{ announcement() }}</p>
    </figure>
  `,
})
export class SpaSimulator {
  protected readonly sections = SECTIONS;
  private readonly traditional = signal(initialSide('traditional'));
  private readonly spa = signal(initialSide('spa'));
  protected readonly sides = computed(() => [this.traditional(), this.spa()]);
  protected readonly announcement = signal('');

  protected go(mode: Mode, section: Section): void {
    const label = this.labelOf(section);
    if (mode === 'traditional') {
      this.traditional.update((side) => navigate(side, section));
      this.announcement.set(
        `Site tradicional: o navegador baixou a página inteira de novo (${PAGE_KB} KB) e redesenhou cabeçalho, lista e rodapé para mostrar ${label}.`,
      );
    } else {
      this.spa.update((side) => navigate(side, section));
      this.announcement.set(
        `SPA: o navegador pediu só os dados (${JSON_KB} KB, em JSON) e redesenhou só a lista para mostrar ${label}. Cabeçalho e rodapé ficaram onde estavam.`,
      );
    }
  }

  protected reset(): void {
    this.traditional.set(initialSide('traditional'));
    this.spa.set(initialSide('spa'));
    this.announcement.set('Simulador recomeçado: os dois lados voltaram ao primeiro acesso.');
  }

  protected redrawn(side: Side, region: Region): '' | null {
    return side.redrawn.includes(region) ? '' : null;
  }

  protected regionClass(side: Side, region: Region): string {
    return side.redrawn.includes(region) ? `${REGION_BASE} ${REDRAWN}` : REGION_BASE;
  }

  protected labelOf(section: Section): string {
    return SECTIONS.find((item) => item.id === section)!.label;
  }

  protected countriesOf(section: Section): string[] {
    return SECTIONS.find((item) => item.id === section)!.countries;
  }
}
