import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Setup = 'nenhuma' | 'index' | 'csr' | 'passaporte';
type Address = '/paises/JP/visao-geral' | '/sobre' | '/passaporte' | '/paises/JP/clima' | '/paises/ZZ';

interface Place {
  /** O build gerou uma pasta com index.html para esse endereço (página pré-renderizada). */
  folder: boolean;
  /** Uma tela montada no navegador (RenderMode.Client), com regra própria na configuração do Passaporte. */
  client: boolean;
  /** O que o app mostra quando o casco abre nesse endereço. */
  screen: string;
}

const PLACES: Record<Address, Place> = {
  '/paises/JP/visao-geral': { folder: true, client: false, screen: 'a página do Japão' },
  '/sobre': { folder: true, client: false, screen: 'a página Sobre' },
  '/passaporte': { folder: false, client: true, screen: 'a tela de entrar (o guard pede login)' },
  '/paises/JP/clima': { folder: false, client: true, screen: 'o clima no Japão' },
  '/paises/ZZ': { folder: false, client: false, screen: '"Esta página não existe"' },
};

interface Answer {
  steps: string[];
  status: number;
  result: string;
}

/**
 * Simulador do capítulo 48: o que o Render responde a cada endereço do Passaporte. Segue a ordem observada num site
 * estático de verdade no Render: um arquivo com o nome exato, depois as regras, depois a pasta com index.html, depois o
 * 404.html, e por fim o "Not Found".
 */
export function answer(setup: Setup, address: Address): Answer {
  const place = PLACES[address];
  const steps = [`Existe um arquivo chamado ${address}? Não.`];
  const ruleMatches = setup === 'index' || setup === 'csr' || (setup === 'passaporte' && place.client);
  if (ruleMatches) {
    const destination = setup === 'index' ? '/index.html' : '/index.csr.html';
    steps.push(`Alguma regra vale para ${address}? Sim: rewrite para ${destination}.`);
    if (setup === 'index') {
      return {
        steps,
        status: 200,
        result:
          'Chega a página "Redirecting to /paises", que leva a /paises. Lá, a mesma regra entrega a mesma página: o navegador recarrega sem parar.',
      };
    }
    const hidden = place.folder ? ' A página pronta da pasta ficou de lado: quem lê o HTML, como o Google, recebe o casco vazio.' : '';
    return { steps, status: 200, result: `Chega o casco, e o Angular desenha ${place.screen}.${hidden}` };
  }
  steps.push(`Alguma regra vale para ${address}? Não.`);
  if (place.folder) {
    steps.push(`Existe a pasta ${address}/ com um index.html? Sim.`);
    return { steps, status: 200, result: `Chega ${place.screen}, pronta do build, com o conteúdo no HTML.` };
  }
  steps.push(`Existe a pasta ${address}/ com um index.html? Não.`);
  if (setup === 'passaporte') {
    steps.push('Existe um 404.html? Sim.');
    return { steps, status: 404, result: `Chega o 404.html (o casco), e o Angular desenha ${place.screen}.` };
  }
  steps.push('Existe um 404.html? Não.');
  return { steps, status: 404, result: 'Chega só o texto "Not Found". O app nem abre.' };
}

@Component({
  selector: 'vm-host-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">O que o Render responde</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Escolha as regras do site e um endereço digitado na barra do navegador. Veja as perguntas que o servidor faz, na
          ordem, e o que chega ao navegador.
        </span>
      </figcaption>

      <div class="grid gap-4 text-ink sm:grid-cols-2 [&>*]:min-w-0">
        <fieldset class="flex flex-col gap-1">
          <legend class="mb-1 text-sm font-bold">As regras do site</legend>
          @for (option of setups; track option.value) {
            <label class="flex items-center gap-2 text-sm">
              <input type="radio" name="host-setup" [value]="option.value" [checked]="setup() === option.value" (change)="setup.set(option.value)" />
              {{ option.label }}
            </label>
          }
        </fieldset>
        <fieldset class="flex flex-col gap-1">
          <legend class="mb-1 text-sm font-bold">O endereço</legend>
          @for (option of addresses; track option) {
            <label class="flex items-center gap-2 font-mono text-sm">
              <input type="radio" name="host-address" [value]="option" [checked]="address() === option" (change)="address.set(option)" />
              {{ option }}
            </label>
          }
        </fieldset>
      </div>

      <ol data-steps class="mt-4 flex flex-col gap-1 rounded-2xl border border-line bg-surface-raised p-4 text-sm text-ink">
        @for (step of result().steps; track $index) {
          <li>{{ $index + 1 }}. {{ step }}</li>
        }
      </ol>

      <p data-result aria-live="polite" class="mt-3 min-h-12 rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">
        HTTP {{ result().status }} · {{ result().result }}
      </p>
    </figure>
  `,
})
export class HostSim {
  protected readonly setups: readonly { value: Setup; label: string }[] = [
    { value: 'nenhuma', label: 'Nenhuma regra' },
    { value: 'index', label: '/* → /index.html' },
    { value: 'csr', label: '/* → /index.csr.html' },
    { value: 'passaporte', label: 'A do Passaporte: regras para as telas do navegador e o 404.html' },
  ];
  protected readonly addresses = Object.keys(PLACES) as Address[];
  protected readonly setup = signal<Setup>('nenhuma');
  protected readonly address = signal<Address>('/passaporte');
  protected readonly result = computed(() => answer(this.setup(), this.address()));
}
