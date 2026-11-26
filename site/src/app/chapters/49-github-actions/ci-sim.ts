import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Push = 'verde' | 'teste' | 'sem-ci';
type Trigger = 'commit' | 'checksPass';
type Mark = 'ok' | 'falhou' | 'pulado';

interface Step {
  label: string;
  mark: Mark;
}

interface Outcome {
  steps: Step[];
  render: string;
  /** O que fica no ar depois do push. */
  live: 'nova' | 'anterior' | 'com defeito';
}

const CI_STEPS = ['actions/checkout', 'actions/setup-node', 'npm ci', 'npm test', 'npm run build'];

/**
 * Simulador do capítulo 49: um push passa pelo GitHub Actions e chega (ou não) ao Render. Segue o que o livro viu num
 * site de verdade com "After CI Checks Pass": o commit vermelho é pulado sem aviso, o verde é publicado logo depois do CI,
 * e um commit sem nenhum check também não é publicado. Com "On Commit", o Render publica assim que recebe o push.
 */
export function outcome(push: Push, trigger: Trigger): Outcome {
  const steps: Step[] =
    push === 'sem-ci'
      ? []
      : CI_STEPS.map((label) => {
          if (push === 'teste' && label === 'npm test') return { label, mark: 'falhou' };
          if (push === 'teste' && label === 'npm run build') return { label, mark: 'pulado' };
          return { label, mark: 'ok' };
        });
  if (trigger === 'commit') {
    const live = push === 'teste' ? 'com defeito' : 'nova';
    const warning = push === 'teste' ? ' O defeito que o teste achou vai junto: o Render não olha o CI.' : '';
    return { steps, live, render: `O Render publica assim que recebe o push, sem esperar o CI.${warning}` };
  }
  if (push === 'verde') return { steps, live: 'nova', render: 'Todos os checks passaram: o Render publica a versão nova.' };
  if (push === 'teste') return { steps, live: 'anterior', render: 'Um check falhou: o Render pula esse commit, sem aviso. A versão anterior continua no ar.' };
  return { steps, live: 'anterior', render: 'Nenhum check rodou: o Render não publica nada, e nada avisa. A versão anterior continua no ar.' };
}

@Component({
  selector: 'vm-ci-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Do push ao ar</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Escolha o que o push leva e como o Render publica. Veja os passos do workflow e o que fica no ar.
        </span>
      </figcaption>

      <div class="grid gap-4 text-ink sm:grid-cols-2 [&>*]:min-w-0">
        <fieldset class="flex flex-col gap-1">
          <legend class="mb-1 text-sm font-bold">O push</legend>
          @for (option of pushes; track option.value) {
            <label class="flex items-center gap-2 text-sm">
              <input type="radio" name="ci-push" [value]="option.value" [checked]="push() === option.value" (change)="push.set(option.value)" />
              {{ option.label }}
            </label>
          }
        </fieldset>
        <fieldset class="flex flex-col gap-1">
          <legend class="mb-1 text-sm font-bold">O Auto-Deploy do Render</legend>
          @for (option of triggers; track option.value) {
            <label class="flex items-center gap-2 text-sm">
              <input type="radio" name="ci-trigger" [value]="option.value" [checked]="trigger() === option.value" (change)="trigger.set(option.value)" />
              {{ option.label }}
            </label>
          }
        </fieldset>
      </div>

      <div class="mt-4 rounded-2xl border border-line bg-surface-raised p-4 text-sm text-ink">
        <p class="mb-2 font-bold">GitHub Actions</p>
        @if (result().steps.length) {
          <ol data-steps class="flex flex-col gap-1 font-mono text-xs">
            @for (step of result().steps; track step.label) {
              <li [attr.data-mark]="step.mark">
                {{ step.mark === 'ok' ? '✓' : step.mark === 'falhou' ? '✗' : '–' }} {{ step.label }}
                <span class="text-ink-muted">({{ step.mark === 'ok' ? 'passou' : step.mark === 'falhou' ? 'falhou' : 'não rodou' }})</span>
              </li>
            }
          </ol>
        } @else {
          <p data-steps class="text-ink-muted">Nenhum workflow rodou para este commit.</p>
        }
      </div>

      <p data-result aria-live="polite" class="mt-3 min-h-12 rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">
        Render: {{ result().render }} No ar: {{ liveLabel() }}.
      </p>
    </figure>
  `,
})
export class CiSim {
  protected readonly pushes: readonly { value: Push; label: string }[] = [
    { value: 'verde', label: 'Código certo, testes passando' },
    { value: 'teste', label: 'Um defeito que um teste pega' },
    { value: 'sem-ci', label: 'Um commit sem nenhum workflow' },
  ];
  protected readonly triggers: readonly { value: Trigger; label: string }[] = [
    { value: 'commit', label: 'On Commit' },
    { value: 'checksPass', label: 'After CI Checks Pass' },
  ];
  protected readonly push = signal<Push>('teste');
  protected readonly trigger = signal<Trigger>('commit');
  protected readonly result = computed(() => outcome(this.push(), this.trigger()));
  protected readonly liveLabel = computed(() => {
    const live = this.result().live;
    return live === 'nova' ? 'a versão nova' : live === 'anterior' ? 'a versão anterior' : 'a versão nova, com o defeito';
  });
}
