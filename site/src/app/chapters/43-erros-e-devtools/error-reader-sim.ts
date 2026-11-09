import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Kind = 'code' | 'problem' | 'hint' | 'place' | 'link';

interface Part {
  text: string;
  kind?: Kind;
}

interface Sample {
  id: string;
  label: string;
  where: string;
  parts: Part[];
  reading: string;
}

const KIND_LABELS: Record<Kind, string> = {
  code: 'O código do erro',
  problem: 'O problema',
  hint: 'A dica',
  place: 'Onde, no seu código',
  link: 'A explicação completa',
};

/** Mensagens reais, copiadas do terminal e do console ao construir o Passaporte. */
const SAMPLES: Sample[] = [
  {
    id: 'ts2551',
    label: 'Um nome errado no template',
    where: 'Terminal do ng serve',
    parts: [
      { text: '✘ [ERROR] ' },
      { text: 'TS2551', kind: 'code' },
      { text: ': ' },
      { text: "Property 'countrie' does not exist on type 'CountryCard'.", kind: 'problem' },
      { text: ' ' },
      { text: "Did you mean 'country'?", kind: 'hint' },
      { text: '\n    ' },
      { text: 'src/app/features/countries/country-card/country-card.html:3:28', kind: 'place' },
      { text: '\n      3 │   <span class="text-3xl">{{ countrie().code | flag }}</span>\n        ╵                             ~~~~~~~~' },
    ],
    reading: 'TS é do TypeScript: o erro foi achado antes de o app rodar. Arquivo, linha 3, coluna 28, e o til embaixo do nome. A dica já é a correção.',
  },
  {
    id: 'ng8001',
    label: 'Um componente que não foi importado',
    where: 'Terminal do ng serve',
    parts: [
      { text: '✘ [ERROR] ' },
      { text: 'NG8001', kind: 'code' },
      { text: ': ' },
      { text: "'app-trip-form' is not a known element:", kind: 'problem' },
      { text: '\n' },
      { text: "1. If 'app-trip-form' is an Angular component, then verify that it is included in the '@Component.imports' of this component.", kind: 'hint' },
      { text: "\n2. If 'app-trip-form' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@Component.schemas' of this component to suppress this message. " },
      { text: 'Find more at https://next.angular.dev/errors/NG8001', kind: 'link' },
      { text: '\n    ' },
      { text: 'src/app/features/passport/passport-page/passport-page.html:4:2', kind: 'place' },
    ],
    reading: 'NG8 é do compilador do Angular, que lê os templates. Das duas hipóteses, a primeira é a sua: falta o TripForm no imports.',
  },
  {
    id: 'ng0203',
    label: 'Um inject() fora de hora',
    where: 'Console do navegador (desenvolvimento)',
    parts: [
      { text: 'ERROR RuntimeError: ' },
      { text: 'NG0203', kind: 'code' },
      { text: ': ' },
      { text: 'The `Router` token injection failed.', kind: 'problem' },
      { text: ' ' },
      { text: '`inject()` function must be called from an injection context such as a constructor, a factory function, a field initializer, or a function used with `runInInjectionContext`.', kind: 'hint' },
      { text: ' ' },
      { text: 'Find more at https://v22.angular.dev/errors/NG0203', kind: 'link' },
      { text: '\n    at ' },
      { text: 'authGuard (http://localhost:4200/main.js:25:18)', kind: 'place' },
    ],
    reading: 'NG0 é de quando o app já está rodando. A primeira linha "at" com um nome seu (authGuard) diz onde procurar.',
  },
  {
    id: 'ng0203-prod',
    label: 'O mesmo erro, num build de produção',
    where: 'Console do navegador (produção)',
    parts: [
      { text: 'ERROR C: ' },
      { text: 'NG0203', kind: 'code' },
      { text: '\n    at qh (http://localhost:4310/chunk-C2sPKfOb.js:4:2216)\n    at be (http://localhost:4310/chunk-C2sPKfOb.js:4:2385)\n    at pe (http://localhost:4310/main-UEEAXIXU.js:30:121036)' },
    ],
    reading: 'Em produção, o texto some para o app ficar menor, e os nomes viram letras. Sobra o código: procure-o em angular.dev/errors e reproduza o erro no ng serve.',
  },
  {
    id: 'ng8118',
    label: 'Um input lido cedo demais',
    where: 'Terminal do ng serve',
    parts: [
      { text: '✘ [ERROR] ' },
      { text: 'NG8118', kind: 'code' },
      { text: ': ' },
      { text: '`country` is a required `input` and does not have a value in this context.', kind: 'problem' },
      { text: '\n    ' },
      { text: 'src/app/features/countries/country-card/country-card.ts:19:32', kind: 'place' },
      { text: "\n      19 │     console.log('Novo cartão:', this.country().name);" },
    ],
    reading: 'No construtor, o pai ainda não entregou o input. O compilador do Angular 22 percebe isso antes de o app rodar.',
  },
];

/** Simulador do capítulo 43: as partes de uma mensagem de erro real, uma por uma. */
@Component({
  selector: 'vm-error-reader-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">O leitor de mensagens de erro</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Mensagens de verdade, copiadas enquanto o Passaporte era construído (só os caminhos foram encurtados, a partir de
          <code>src/</code>). Escolha uma e marque o que procurar: cada parte da mensagem acende no texto.
        </span>
      </figcaption>

      <div class="grid gap-4 text-ink sm:grid-cols-2 [&>*]:min-w-0">
        <fieldset class="flex flex-col gap-1">
          <legend class="mb-1 text-sm font-bold">A mensagem</legend>
          @for (sample of samples; track sample.id) {
            <label class="flex items-center gap-2">
              <input type="radio" name="sim-sample" [value]="sample.id" [checked]="selected() === sample.id" (change)="selected.set(sample.id)" />
              {{ sample.label }}
            </label>
          }
        </fieldset>
        <fieldset class="flex flex-col gap-1">
          <legend class="mb-1 text-sm font-bold">O que procurar</legend>
          @for (kind of kinds; track kind) {
            <label class="flex items-center gap-2">
              <input type="radio" name="sim-kind" [value]="kind" [checked]="focus() === kind" (change)="focus.set(kind)" />
              {{ kindLabels[kind] }}
            </label>
          }
        </fieldset>
      </div>

      <p class="mt-4 text-xs font-bold uppercase tracking-wider text-ink-muted">{{ sample().where }}</p>
      <pre data-message class="mt-1 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink wrap-anywhere"><code>@for (part of sample().parts; track $index) {@if (part.kind === focus()) {<mark class="rounded bg-highlight px-0.5 text-primary">{{ part.text }}</mark>} @else {{{ part.text }}}}</code></pre>
      <p data-found aria-live="polite" class="mt-3 text-sm text-ink">{{ found() }}</p>
      <p data-reading class="mt-2 text-sm text-ink"><strong>Como ler:</strong> {{ sample().reading }}</p>
    </figure>
  `,
})
export class ErrorReaderSim {
  protected readonly samples = SAMPLES;
  protected readonly kinds = Object.keys(KIND_LABELS) as Kind[];
  protected readonly kindLabels = KIND_LABELS;
  protected readonly selected = signal('ts2551');
  protected readonly focus = signal<Kind>('code');
  protected readonly sample = computed(() => SAMPLES.find((s) => s.id === this.selected())!);

  protected readonly found = computed(() => {
    const part = this.sample().parts.find((p) => p.kind === this.focus());
    const label = KIND_LABELS[this.focus()];
    return part ? `${label}: ${part.text}` : `${label}: esta mensagem não tem.`;
  });
}
