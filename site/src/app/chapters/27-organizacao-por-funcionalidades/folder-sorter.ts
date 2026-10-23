import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Folder = 'core' | 'shared' | 'features/countries' | 'features/country-detail' | 'features/about';
type Kind = 'layout' | 'data' | 'generic' | 'feature';

interface Piece {
  id: string;
  name: string;
  hint: string;
  kind: Kind;
  correct: Folder;
  /** As features que importam esta peça. */
  usedBy: Folder[];
}

const FOLDERS: Folder[] = ['core', 'shared', 'features/countries', 'features/country-detail', 'features/about'];

const PIECES: Piece[] = [
  { id: 'header', name: 'Header', hint: 'o cabeçalho, em toda tela', kind: 'layout', correct: 'core', usedBy: [] },
  { id: 'footer', name: 'Footer', hint: 'o rodapé, em toda tela', kind: 'layout', correct: 'core', usedBy: [] },
  { id: 'not-found', name: 'NotFoundPage', hint: 'a página 404 do app', kind: 'layout', correct: 'core', usedBy: [] },
  {
    id: 'countries',
    name: 'countries.ts',
    hint: 'os países e o modelo Country',
    kind: 'data',
    correct: 'core',
    usedBy: ['features/countries', 'features/country-detail'],
  },
  {
    id: 'flag-pipe',
    name: 'FlagPipe',
    hint: "'BR' vira 🇧🇷",
    kind: 'generic',
    correct: 'shared',
    usedBy: ['features/countries', 'features/country-detail'],
  },
  { id: 'panel', name: 'Panel', hint: 'caixa com título e rodapé', kind: 'generic', correct: 'shared', usedBy: ['features/countries'] },
  { id: 'country-list', name: 'CountryList', hint: 'a lista com filtros', kind: 'feature', correct: 'features/countries', usedBy: [] },
  { id: 'country-page', name: 'CountryPage', hint: 'a página de um país', kind: 'feature', correct: 'features/country-detail', usedBy: [] },
  { id: 'country-weather', name: 'CountryWeather', hint: 'a aba do clima', kind: 'feature', correct: 'features/country-detail', usedBy: [] },
  { id: 'about-page', name: 'AboutPage', hint: 'a página Sobre', kind: 'feature', correct: 'features/about', usedBy: [] },
];

type Level = 'certo' | 'funciona' | 'quebra';

/** Simulador do capítulo 27: escolha a pasta de cada peça e veja se a regra das funcionalidades se mantém. */
@Component({
  selector: 'vm-folder-sorter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Arrume a casa</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Escolha a pasta de cada peça do Passaporte. A regra: uma feature nunca importa outra; o que mais de uma usa vai para core ou shared.
        </span>
      </figcaption>

      <ul class="flex flex-col gap-2">
        @for (piece of pieces; track piece.id) {
          <li class="grid gap-2 rounded-xl border border-line bg-surface-raised p-3 text-ink sm:grid-cols-[12rem_14rem_1fr] sm:items-center">
            <span>
              <strong class="font-mono text-sm">{{ piece.name }}</strong>
              <span class="block text-xs text-ink-muted">{{ piece.hint }}</span>
            </span>
            <label class="sr-only" [for]="'vm-folder-' + piece.id">Pasta de {{ piece.name }}</label>
            <select
              [id]="'vm-folder-' + piece.id"
              [attr.data-piece]="piece.id"
              class="rounded-lg border border-line bg-surface px-2 py-1 font-mono text-sm"
              (change)="place(piece.id, $any($event.target).value)"
            >
              <option value="" [selected]="!choices()[piece.id]">escolha a pasta…</option>
              @for (folder of folders; track folder) {
                <option [value]="folder" [selected]="choices()[piece.id] === folder">{{ folder }}</option>
              }
            </select>
            <span
              [attr.data-verdict]="piece.id"
              class="text-sm"
              [class]="levelClass(verdicts()[piece.id]?.level)"
            >{{ verdicts()[piece.id]?.text ?? '' }}</span>
          </li>
        }
      </ul>
      <p data-summary class="mt-4 font-bold text-ink">{{ correctCount() }} de {{ pieces.length }} no lugar certo{{ violations() ? ' · ' + violations() + ' quebrando a regra' : '' }}</p>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class FolderSorter {
  protected readonly pieces = PIECES;
  protected readonly folders = FOLDERS;
  protected readonly choices = signal<Record<string, Folder | undefined>>({});
  protected readonly announcement = signal('');

  protected readonly verdicts = computed(() => {
    const result: Record<string, { level: Level; text: string }> = {};
    for (const piece of PIECES) {
      const folder = this.choices()[piece.id];
      if (folder) result[piece.id] = evaluate(piece, folder);
    }
    return result;
  });

  protected readonly correctCount = computed(() => Object.values(this.verdicts()).filter((v) => v.level === 'certo').length);
  protected readonly violations = computed(() => Object.values(this.verdicts()).filter((v) => v.level === 'quebra').length);

  protected place(id: string, folder: string): void {
    this.choices.update((current) => ({ ...current, [id]: (folder || undefined) as Folder | undefined }));
    const verdict = this.verdicts()[id];
    this.announcement.set(verdict ? verdict.text : '');
  }

  protected levelClass(level: Level | undefined): string {
    if (level === 'certo') return 'font-bold text-challenge';
    if (level === 'quebra') return 'font-bold text-pitfall';
    return 'text-ink-muted';
  }
}

function evaluate(piece: Piece, folder: Folder): { level: Level; text: string } {
  if (folder === piece.correct) return { level: 'certo', text: '✓ Certo.' };
  const inFeature = folder.startsWith('features/');
  const others = piece.usedBy.filter((user) => user !== folder);
  if (inFeature && piece.usedBy.length > 1) {
    return { level: 'quebra', text: `✗ ${others[0]} teria de importar de ${folder}: uma feature importando outra.` };
  }
  if (piece.kind === 'feature' && inFeature) {
    return { level: 'quebra', text: `✗ As rotas de ${piece.correct} teriam de importar de ${folder}: uma feature importando outra.` };
  }
  const reasons: Record<Kind, string> = {
    layout: 'é do app inteiro e aparece uma vez só: o lugar é o core.',
    data: 'são dados do app, lidos por várias features: o lugar é o core.',
    generic: inFeature
      ? 'hoje só uma feature usa; se outra precisar, a peça terá de mudar para o shared.'
      : 'é uma peça reutilizável, sem saber de países: o lugar é o shared.',
    feature: `é parte de uma funcionalidade só, e fica longe das outras peças dela: o lugar é ${piece.correct}.`,
  };
  return { level: 'funciona', text: `Funciona, mas ${reasons[piece.kind]}` };
}
