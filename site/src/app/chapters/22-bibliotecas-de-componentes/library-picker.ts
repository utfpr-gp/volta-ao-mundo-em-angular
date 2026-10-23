import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type LibraryId = 'material' | 'primeng' | 'daisyui' | 'spartan' | 'aria';

interface Need {
  id: string;
  label: string;
  short: string;
  fits: LibraryId[];
  warns?: Partial<Record<LibraryId, string>>;
}

const NEEDS: Need[] = [
  { id: 'pronto', label: 'Quero o visual pronto, sem desenhar nada', short: 'visual pronto', fits: ['material', 'primeng'] },
  { id: 'tailwind', label: 'O projeto já usa Tailwind e tokens próprios', short: 'Tailwind', fits: ['daisyui', 'spartan', 'aria'] },
  {
    id: 'complexos',
    label: 'Preciso de componentes complexos, como tabela com filtros e calendário',
    short: 'componentes complexos',
    fits: ['primeng', 'material'],
  },
  { id: 'codigo', label: 'Quero editar o código dos componentes', short: 'código no projeto', fits: ['spartan'] },
  { id: 'leve', label: 'O app precisa carregar pouca coisa', short: 'leve', fits: ['daisyui', 'aria', 'spartan'] },
  {
    id: 'empresa',
    label: 'O app é de uma empresa grande',
    short: 'empresa grande',
    fits: [],
    warns: { primeng: 'Numa empresa grande, a licença paga é obrigatória, por pessoa desenvolvedora.' },
  },
];

const LIBRARIES: { id: LibraryId; name: string; kind: string; license: string; size: string }[] = [
  { id: 'material', name: 'Angular Material', kind: 'Componentes prontos, no visual Material Design do Google', license: 'MIT, gratuita', size: '+84 kB' },
  { id: 'primeng', name: 'PrimeNG', kind: 'Componentes prontos, com temas, e a maior coleção', license: 'Chave de licença, gratuita para estudantes e equipes pequenas', size: '+320 kB' },
  { id: 'daisyui', name: 'daisyUI', kind: 'Só classes CSS, por cima do Tailwind', license: 'MIT, gratuita', size: '+33 kB' },
  { id: 'spartan', name: 'Spartan', kind: 'Comportamento pronto e o código do visual copiado para o seu projeto', license: 'MIT, gratuita', size: '+73 kB' },
  { id: 'aria', name: 'Angular Aria', kind: 'Só comportamento e acessibilidade, sem nenhum visual', license: 'MIT, gratuita', size: '+45 kB' },
];

/** Simulador do capítulo 22: marque o que o projeto precisa e veja quais bibliotecas combinam, e por quê. */
@Component({
  selector: 'vm-library-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Qual biblioteca combina com o projeto?</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Não existe a melhor biblioteca; existe a que combina com o que o projeto precisa. Marque as necessidades e veja a lista se reordenar.
        </span>
      </figcaption>

      <div class="grid gap-5 lg:grid-cols-[20rem_1fr]">
        <fieldset class="flex flex-col gap-2 text-ink">
          <legend class="mb-2 font-extrabold">O projeto…</legend>
          @for (need of needs; track need.id) {
            <label class="flex cursor-pointer items-start gap-2 rounded-xl border border-line bg-surface-raised px-3 py-2 text-sm">
              <input type="checkbox" class="mt-0.5 size-4 shrink-0 accent-challenge" [checked]="checked().has(need.id)" (change)="toggle(need.id)" />
              {{ need.label }}
            </label>
          }
        </fieldset>

        <div>
          <p data-hint class="mb-3 text-sm text-ink-muted">
            {{ checked().size ? 'As que mais combinam aparecem primeiro.' : 'Marque o que o seu projeto precisa.' }}
          </p>
          <ol class="flex flex-col gap-2">
            @for (item of ranking(); track item.library.id; let first = $first) {
              <li
                [attr.data-library]="item.library.id"
                class="rounded-2xl border-2 bg-surface-raised px-4 py-3 text-ink"
                [class]="first && item.matches.length ? 'border-challenge' : 'border-line'"
              >
                <p class="flex flex-wrap items-baseline justify-between gap-2">
                  <strong class="text-lg">{{ item.library.name }}</strong>
                  <span class="font-mono text-xs text-ink-muted">{{ item.library.size }}</span>
                </p>
                <p class="text-sm">{{ item.library.kind }}</p>
                <p class="text-sm text-ink-muted">Licença: {{ item.library.license }}</p>
                @if (item.matches.length) {
                  <p class="mt-1 text-sm font-bold text-challenge">Combina: {{ item.matches.join(', ') }}</p>
                }
                @for (warning of item.warnings; track warning) {
                  <p class="mt-1 text-sm font-bold text-pitfall">⚠ {{ warning }}</p>
                }
              </li>
            }
          </ol>
        </div>
      </div>
      <p class="mt-4 text-xs text-ink-muted">
        Tamanhos medidos num app vazio do Angular 22, com o cartão do capítulo (no Aria, o filtro). daisyUI, Spartan e Aria incluem o CSS do Tailwind.
      </p>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class LibraryPicker {
  protected readonly needs = NEEDS;
  protected readonly checked = signal(new Set<string>());

  protected readonly ranking = computed(() => {
    const active = NEEDS.filter((need) => this.checked().has(need.id));
    return LIBRARIES.map((library) => ({
      library,
      matches: active.filter((need) => need.fits.includes(library.id)).map((need) => need.short),
      warnings: active.map((need) => need.warns?.[library.id]).filter((warning): warning is string => !!warning),
    })).sort((a, b) => b.matches.length - b.warnings.length - (a.matches.length - a.warnings.length));
  });

  protected readonly announcement = computed(() => {
    const [top] = this.ranking();
    return this.checked().size ? `A que mais combina agora: ${top.library.name}.` : '';
  });

  protected toggle(id: string): void {
    this.checked.update((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
}
