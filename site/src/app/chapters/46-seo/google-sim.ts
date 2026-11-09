import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Version = 'spa' | 'prerendered';

/** O que chega a quem pede /paises/JP sem rodar JavaScript, nas etapas 45 (SPA) e 46 (pré-renderizada), resumido. */
const HTML: Record<Version, string> = {
  spa: `<title>Passaporte</title>
…
<body>
  <app-root></app-root>
  <script src="main-GNQA6SXN.js" type="module"></script>
</body>`,
  prerendered: `<title>Japão · Passaporte</title>
<meta name="description" content="Japão: capital Tóquio, 123.802.000 habitantes. …">
<meta property="og:title" content="Japão · Passaporte">
<meta property="og:image" content="https://SEU-PASSAPORTE.onrender.com/og.png">
…
<body>
  <app-root ng-version="22.2.3" ngh="4" ng-server-context="ssg">
    …
    <h1 class="text-3xl font-extrabold">Japão</h1>
    …
    <dt class="font-bold">Capital</dt><dd>Tóquio</dd>
    …`,
};

/** Simulador do capítulo 46: o HTML que o robô recebe, e a prévia que título e descrição produzem. */
@Component({
  selector: 'vm-google-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">O que o Google vê</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Compare o HTML que um robô recebe ao pedir /paises/JP, antes e depois da pré-renderização. Depois, edite o título e a
          descrição e veja a prévia na busca e no cartão de um link compartilhado.
        </span>
      </figcaption>

      <fieldset class="flex flex-wrap gap-4 text-ink">
        <legend class="mb-1 text-sm font-bold">O Passaporte</legend>
        <label class="flex items-center gap-2">
          <input type="radio" name="sim-version" value="spa" [checked]="version() === 'spa'" (change)="version.set('spa')" />
          SPA (etapa 45)
        </label>
        <label class="flex items-center gap-2">
          <input type="radio" name="sim-version" value="prerendered" [checked]="version() === 'prerendered'" (change)="version.set('prerendered')" />
          Pré-renderizado (etapa 46)
        </label>
      </fieldset>
      <pre data-html class="mt-3 overflow-x-auto rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink"><code>{{ html() }}</code></pre>
      <p data-verdict aria-live="polite" class="mt-2 text-sm font-bold text-ink">{{ verdict() }}</p>

      <div class="mt-5 grid gap-3 text-ink sm:grid-cols-2 [&>*]:min-w-0">
        <label class="flex flex-col gap-1 text-sm font-bold">
          Título ({{ title().length }} letras)
          <input class="rounded-lg border border-line bg-surface px-3 py-2 font-normal" [value]="title()" (input)="title.set($any($event.target).value)" />
        </label>
        <label class="flex flex-col gap-1 text-sm font-bold">
          Descrição ({{ description().length }} letras)
          <textarea rows="3" class="rounded-lg border border-line bg-surface px-3 py-2 font-normal" (input)="description.set($any($event.target).value)">{{ description() }}</textarea>
        </label>
      </div>

      <div class="mt-4 grid gap-4 sm:grid-cols-2 [&>*]:min-w-0">
        <div data-search class="rounded-2xl border border-line bg-card p-4">
          <p class="text-xs font-bold uppercase tracking-wider text-ink-muted">Na busca</p>
          <p class="mt-2 text-xs text-ink-muted">seu-passaporte.onrender.com › paises › JP</p>
          <p class="text-lg text-link">{{ shortTitle() }}</p>
          <p class="text-sm text-ink">{{ shortDescription() }}</p>
        </div>
        <div data-card class="overflow-hidden rounded-2xl border border-line bg-card">
          <img src="imagens/capitulo-46/og.png" width="1200" height="630" alt="" class="block aspect-[1200/630] w-full object-cover" />
          <div class="p-3">
            <p class="text-xs uppercase text-ink-muted">seu-passaporte.onrender.com</p>
            <p class="font-bold text-ink">{{ title() }}</p>
            <p class="text-sm text-ink-muted">{{ shortDescription() }}</p>
          </div>
        </div>
      </div>
      <p class="mt-2 text-xs text-ink-muted">
        Prévias aproximadas: cada buscador e cada aplicativo de mensagem corta o texto do seu jeito. Na busca, títulos de até uns
        60 caracteres e descrições de até uns 155 costumam aparecer inteiros.
      </p>
    </figure>
  `,
})
export class GoogleSim {
  protected readonly version = signal<Version>('spa');
  protected readonly html = computed(() => HTML[this.version()]);
  protected readonly verdict = computed(() =>
    this.version() === 'spa'
      ? 'Sem rodar JavaScript, o robô vê o título "Passaporte" e um <app-root> vazio, igual para todas as páginas.'
      : 'O robô vê o título, a descrição, as tags de compartilhamento e o texto da página, como uma pessoa veria.',
  );

  protected readonly title = signal('Japão · Passaporte');
  protected readonly description = signal(
    'Japão: capital Tóquio, 123.802.000 habitantes. Marque como visitado, anote os planos e veja o tempo agora no Passaporte.',
  );
  protected readonly shortTitle = computed(() => cut(this.title(), 60));
  protected readonly shortDescription = computed(() => cut(this.description(), 155));
}

function cut(text: string, size: number): string {
  return text.length > size ? text.slice(0, size - 1).trimEnd() + '…' : text;
}
