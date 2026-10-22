import { ChangeDetectionStrategy, Component, ElementRef, computed, signal, viewChild } from '@angular/core';

/** Uma pasta de mentira: o nome de cada subpasta leva às subpastas dela. */
interface Folder {
  [name: string]: Folder;
}

export type MissionId = 'pwd' | 'ls' | 'mkdir' | 'cd' | 'node';

export interface TerminalState {
  tree: Folder;
  /** Caminho a partir da pasta pessoal (/home/voce); vazio quando está nela. */
  cwd: string[];
  done: MissionId[];
}

export interface CommandResult {
  state: TerminalState;
  output: string[];
  clear?: boolean;
}

const HOME = '/home/voce';

export const MISSIONS: { id: MissionId; command: string; goal: string }[] = [
  { id: 'pwd', command: 'pwd', goal: 'Descubra em que pasta você está' },
  { id: 'ls', command: 'ls', goal: 'Veja o que tem nesta pasta' },
  { id: 'mkdir', command: 'mkdir angular', goal: 'Crie uma pasta chamada angular' },
  { id: 'cd', command: 'cd angular', goal: 'Entre na pasta que você criou' },
  { id: 'node', command: 'node -v', goal: 'Confira a versão do Node.js' },
];

export function initialTerminal(): TerminalState {
  return { tree: { Documentos: {}, Downloads: {} }, cwd: [], done: [] };
}

function folderAt(tree: Folder, path: string[]): Folder {
  return path.reduce((folder, name) => folder[name], tree);
}

function withMission(state: TerminalState, mission: MissionId): TerminalState {
  return state.done.includes(mission) ? state : { ...state, done: [...state.done, mission] };
}

/** Executa um comando no terminal de treino. As mensagens de erro são as reais do bash em português. */
export function runCommand(state: TerminalState, line: string): CommandResult {
  const [command, ...args] = line.trim().split(/\s+/).filter(Boolean);
  const here = folderAt(state.tree, state.cwd);

  switch (command) {
    case undefined:
      return { state, output: [] };
    case 'pwd':
      return { state: withMission(state, 'pwd'), output: [[HOME, ...state.cwd].join('/')] };
    case 'ls':
      return { state: withMission(state, 'ls'), output: Object.keys(here).length ? [Object.keys(here).sort().join('  ')] : [] };
    case 'mkdir': {
      const name = args[0];
      if (!name) return { state, output: ['mkdir: falta o operando'] };
      if (name in here) return { state, output: [`mkdir: não foi possível criar o diretório “${name}”: Arquivo existe`] };
      const tree = structuredClone(state.tree);
      folderAt(tree, state.cwd)[name] = {};
      return { state: withMission({ ...state, tree }, 'mkdir'), output: [] };
    }
    case 'cd': {
      const target = args[0] ?? '~';
      if (target === '~') return { state: { ...state, cwd: [] }, output: [] };
      if (target === '..') return { state: { ...state, cwd: state.cwd.slice(0, -1) }, output: [] };
      if (!(target in here)) return { state, output: [`bash: cd: ${target}: Arquivo ou diretório inexistente`] };
      return { state: withMission({ ...state, cwd: [...state.cwd, target] }, 'cd'), output: [] };
    }
    case 'node':
      return args[0] === '-v' || args[0] === '--version'
        ? { state: withMission(state, 'node'), output: ['v24.20.0'] }
        : { state, output: ['Neste terminal de treino, use node -v.'] };
    case 'npm':
      return args[0] === '-v' || args[0] === '--version'
        ? { state, output: ['11.19.0'] }
        : { state, output: ['Neste terminal de treino, use npm -v.'] };
    case 'clear':
      return { state, output: [], clear: true };
    case 'help':
      return { state, output: ['Comandos deste treino: pwd, ls, mkdir <nome>, cd <pasta>, cd .., node -v, npm -v, clear'] };
    default:
      return { state, output: [`bash: ${command}: comando não encontrado`] };
  }
}

interface ScreenLine {
  prompt?: string;
  text: string;
}

/** Simulador do capítulo 2: um terminal de treino, com missões, para perder o medo da tela preta. */
@Component({
  selector: 'vm-terminal-trainer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Terminal de treino</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Um terminal de mentira, com pastas de mentira: pode errar à vontade. Cumpra as missões ao lado. Digite
          <code class="font-mono">help</code> para ver os comandos.
        </span>
      </figcaption>

      <div class="grid gap-5 lg:grid-cols-[1fr_17rem]">
        <div class="overflow-hidden rounded-2xl bg-terminal text-terminal-ink shadow-lg">
          <div class="flex items-center gap-1.5 border-b border-terminal-ink/15 px-4 py-2">
            <span class="size-2.5 rounded-full bg-stamp"></span>
            <span class="size-2.5 rounded-full bg-highlight"></span>
            <span class="size-2.5 rounded-full bg-terminal-prompt"></span>
            <span class="ml-2 font-mono text-xs text-terminal-ink/70">Terminal</span>
          </div>
          <div data-screen class="h-64 overflow-y-auto px-4 py-3 font-mono text-sm leading-relaxed" (click)="focus()">
            @for (line of screen(); track $index) {
              <p class="whitespace-pre-wrap break-all">
                @if (line.prompt) {<span class="text-terminal-prompt">{{ line.prompt }}</span>$ }{{ line.text }}
              </p>
            }
            <div class="flex items-center gap-1">
              <span class="shrink-0 text-terminal-prompt">{{ prompt() }}</span><span aria-hidden="true">$</span>
              <label for="terminal-treino" class="sr-only">Digite um comando e aperte Enter</label>
              <input
                #field
                id="terminal-treino"
                type="text"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
                class="min-w-0 flex-1 bg-transparent font-mono text-sm text-terminal-ink caret-terminal-prompt outline-none"
                [value]="draft()"
                (input)="draft.set($any($event.target).value)"
                (keydown)="key($event)"
              />
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-line bg-surface-raised p-4">
          <p class="text-sm font-extrabold text-ink">Missões · {{ state().done.length }}/{{ missions.length }}</p>
          <ol class="mt-3 flex flex-col gap-2 text-sm">
            @for (mission of missions; track mission.id) {
              <li
                class="flex items-start gap-2"
                [attr.data-mission]="mission.id"
                [attr.data-done]="state().done.includes(mission.id)"
              >
                <span
                  aria-hidden="true"
                  class="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 text-[11px] font-extrabold"
                  [class]="state().done.includes(mission.id) ? 'border-code bg-code text-on-primary' : 'border-line text-transparent'"
                >✓</span>
                <span>
                  <span class="block font-semibold text-ink">{{ mission.goal }}</span>
                  <code class="font-mono text-xs text-ink-muted">{{ mission.command }}</code>
                  <span class="sr-only">{{ state().done.includes(mission.id) ? '(feita)' : '(a fazer)' }}</span>
                </span>
              </li>
            }
          </ol>
          @if (state().done.length === missions.length) {
            <p class="mt-4 rounded-xl bg-code/10 px-3 py-2 text-sm font-bold text-code">Todas as missões cumpridas. O terminal já não é um bicho de sete cabeças!</p>
          }
        </div>
      </div>
      <p aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class TerminalTrainer {
  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  protected readonly missions = MISSIONS;
  protected readonly state = signal(initialTerminal());
  protected readonly screen = signal<ScreenLine[]>([{ text: 'Boas-vindas ao terminal de treino. Digite pwd e aperte Enter.' }]);
  protected readonly draft = signal('');
  protected readonly announcement = signal('');
  protected readonly prompt = computed(() => `voce@computador:${['~', ...this.state().cwd].join('/')}`);
  private readonly history: string[] = [];
  private historyIndex = 0;

  protected focus(): void {
    this.field().nativeElement.focus();
  }

  protected key(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.submit();
    } else if (event.key === 'ArrowUp' && this.history.length) {
      event.preventDefault();
      this.historyIndex = Math.max(this.historyIndex - 1, 0);
      this.setDraft(this.history[this.historyIndex]);
    } else if (event.key === 'ArrowDown' && this.history.length) {
      event.preventDefault();
      this.historyIndex = Math.min(this.historyIndex + 1, this.history.length);
      this.setDraft(this.history[this.historyIndex] ?? '');
    }
  }

  private setDraft(value: string): void {
    this.draft.set(value);
    this.field().nativeElement.value = value;
  }

  private submit(): void {
    const line = this.draft();
    const prompt = this.prompt();
    const result = runCommand(this.state(), line);
    this.state.set(result.state);
    if (line.trim()) this.history.push(line.trim());
    this.historyIndex = this.history.length;
    this.screen.update((screen) =>
      result.clear ? [] : [...screen, { prompt, text: line }, ...result.output.map((text) => ({ text }))],
    );
    this.announcement.set(result.output.join(' ') || (line.trim() ? `Comando ${line.trim()} executado.` : ''));
    this.setDraft('');
  }
}
