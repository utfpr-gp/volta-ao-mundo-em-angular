import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type Approach = 'component' | 'resolver';
type Api = 'fast' | 'slow' | 'fail';

interface Moment {
  when: string;
  address: string;
  title: string;
  screen: string;
  bar: boolean;
}

const API_LABELS: Record<Api, string> = { fast: 'responde em 0,2 s', slow: 'responde em 3 s', fail: 'falha' };

/** Simulador do capítulo 41: o que a pessoa vê ao abrir um país, buscando os dados no componente ou com um resolver. */
@Component({
  selector: 'vm-resolver-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Abrir o Japão, com e sem resolver</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Você está na lista de países, e os países ainda não chegaram da API. Escolha a abordagem e como a API se comporta, e
          clique no Japão. Cada linha é um momento: o endereço, o título da aba e o que a tela mostra.
        </span>
      </figcaption>

      <div class="grid gap-4 text-ink sm:grid-cols-2">
        <fieldset class="flex flex-col gap-1">
          <legend class="mb-1 text-sm font-bold">A abordagem</legend>
          <label class="flex items-center gap-2">
            <input type="radio" name="sim-approach" value="component" [checked]="approach() === 'component'" (change)="approach.set('component')" />
            O componente busca (capítulo 40)
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" name="sim-approach" value="resolver" [checked]="approach() === 'resolver'" (change)="approach.set('resolver')" />
            Um resolver espera antes
          </label>
        </fieldset>
        <fieldset class="flex flex-col gap-1">
          <legend class="mb-1 text-sm font-bold">A API de países</legend>
          @for (option of apis; track option) {
            <label class="flex items-center gap-2">
              <input type="radio" name="sim-api" [value]="option" [checked]="api() === option" (change)="api.set(option)" />
              {{ apiLabels[option] }}
            </label>
          }
        </fieldset>
      </div>
      <div class="mt-3">
        <button type="button" class="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-on-primary" (click)="open()">Clicar no Japão</button>
      </div>

      @if (moments().length) {
        <ol data-moments class="mt-4 flex flex-col gap-3">
          @for (moment of moments(); track $index) {
            <li class="rounded-2xl border border-line bg-surface-raised p-3 text-sm text-ink">
              <p class="font-extrabold">{{ moment.when }}</p>
              <dl class="mt-1 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-0.5">
                <dt class="text-ink-muted">Endereço</dt>
                <dd class="font-mono text-xs wrap-anywhere">{{ moment.address }}</dd>
                <dt class="text-ink-muted">Título da aba</dt>
                <dd>{{ moment.title }}</dd>
                <dt class="text-ink-muted">Na tela</dt>
                <dd>{{ moment.screen }}{{ moment.bar ? ' · a barra de carregamento corre' : '' }}</dd>
              </dl>
            </li>
          }
        </ol>
      }
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class ResolverSim {
  protected readonly apis: Api[] = ['fast', 'slow', 'fail'];
  protected readonly apiLabels = API_LABELS;
  protected readonly approach = signal<Approach>('component');
  protected readonly api = signal<Api>('slow');
  protected readonly moments = signal<Moment[]>([]);
  protected readonly announcement = signal('');

  protected open(): void {
    const api = this.api();
    const later = api === 'fast' ? 'Depois de 0,2 s' : api === 'slow' ? 'Depois de 3 s' : 'Quando a API falha';
    const address = '/paises/JP/visao-geral';
    const moments: Moment[] =
      this.approach() === 'component'
        ? [
            { when: 'No clique', address, title: 'JP · Passaporte', screen: 'A página do país, com "Carregando o país…"', bar: true },
            api === 'fail'
              ? { when: later, address, title: 'JP · Passaporte', screen: '"Não encontramos o país JP", embora o país exista', bar: false }
              : { when: later, address, title: 'JP · Passaporte (o título não muda mais)', screen: 'O Japão', bar: false },
          ]
        : [
            { when: 'No clique', address: '/paises', title: 'Países · Passaporte', screen: 'Ainda a lista de países: a navegação espera o resolver', bar: true },
            api === 'fail'
              ? { when: later, address, title: 'JP · Passaporte', screen: '"Não foi possível carregar os países"', bar: false }
              : { when: later, address, title: 'Japão · Passaporte', screen: 'O Japão, pronto de uma vez', bar: false },
          ];
    this.moments.set(moments);
    const last = moments.at(-1)!;
    this.announcement.set(`${last.when}: ${last.screen}. Título: ${last.title}.`);
  }
}
