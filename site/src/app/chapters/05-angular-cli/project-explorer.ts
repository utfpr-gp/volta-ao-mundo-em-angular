import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import type { SnippetId } from '../../../generated/snippets';
import { Code } from '../../views/code';

interface ProjectFile {
  path: string;
  depth: number;
  folder?: boolean;
  snippet?: SnippetId;
  about: string;
}

/** A árvore do projeto criado pelo `ng new`, com o código real da etapa 05 quando há o que mostrar. */
export const PROJECT_FILES: ProjectFile[] = [
  { path: 'package.json', depth: 0, snippet: '05/etapa/package.json', about: 'A lista de compras do projeto: os pacotes de que ele precisa, com as versões, e os atalhos como npm start e npm test.' },
  { path: 'angular.json', depth: 0, about: 'A configuração do Angular CLI: onde está o código, como fazer o build, que estilos carregar. Você quase nunca mexe nele.' },
  { path: 'tsconfig.json', depth: 0, about: 'As regras do TypeScript para este projeto, como o modo estrito que pega erros cedo.' },
  { path: 'node_modules/', depth: 0, folder: true, about: 'Os pacotes baixados pelo npm install. É enorme, não se edita e não vai para o Git: qualquer um recria com npm install.' },
  { path: 'public/', depth: 0, folder: true, about: 'Arquivos copiados como estão para o site final, como o ícone da aba (favicon) e, mais tarde, imagens.' },
  { path: 'src/', depth: 0, folder: true, about: 'O código-fonte do app. Quase todo o seu trabalho acontece aqui dentro.' },
  { path: 'src/index.html', depth: 1, snippet: '05/etapa/src/index.html', about: 'A única página HTML do app (lembra da SPA?). O <app-root> no corpo é o lugar onde o Angular vai desenhar o app.' },
  { path: 'src/main.ts', depth: 1, snippet: '05/etapa/src/main.ts', about: 'O ponto de partida: o bootstrapApplication liga o app, começando pelo componente App.' },
  { path: 'src/styles.css', depth: 1, snippet: '05/etapa/src/styles.css', about: 'Estilos que valem para o app inteiro. Os estilos de cada componente ficam no arquivo .css dele.' },
  { path: 'src/app/', depth: 1, folder: true, about: 'Os componentes e a configuração do app.' },
  { path: 'src/app/app.ts', depth: 2, snippet: '05/etapa/src/app/app.ts', about: 'O componente raiz, App: uma classe com o @Component. O selector app-root diz onde ele aparece no index.html.' },
  { path: 'src/app/app.html', depth: 2, snippet: '05/etapa/src/app/app.html', about: 'O template do App: o HTML que aparece na tela. É aqui que você troca a página de boas-vindas pelo Passaporte.' },
  { path: 'src/app/app.css', depth: 2, snippet: '05/etapa/src/app/app.css', about: 'Os estilos só do componente App: não vazam para outros componentes.' },
  { path: 'src/app/app.config.ts', depth: 2, snippet: '05/etapa/src/app/app.config.ts', about: 'A configuração do app: recursos ligados no início, como as rotas.' },
  { path: 'src/app/app.routes.ts', depth: 2, snippet: '05/etapa/src/app/app.routes.ts', about: 'A lista de rotas (telas) do app. Por enquanto, vazia; ela cresce no capítulo 23.' },
  { path: 'src/app/app.spec.ts', depth: 2, about: 'Os testes do componente App, que rodam com npm test (Vitest). Você aprende a escrever testes no capítulo 42.' },
];

export const BOOT_PATH = ['src/index.html', 'src/main.ts', 'src/app/app.ts', 'src/app/app.html'];

const BOOT_STEPS = [
  '1. O navegador abre o index.html, que tem um <app-root> vazio.',
  '2. O main.ts roda e chama bootstrapApplication(App).',
  '3. O Angular cria o componente App, cujo selector é app-root.',
  '4. O template app.html é desenhado dentro do <app-root>. O app está no ar.',
];

/** Simulador do capítulo 5: o projeto do Passaporte por dentro, arquivo por arquivo. */
@Component({
  selector: 'vm-project-explorer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Code],
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5 flex flex-wrap items-start justify-between gap-3">
        <span>
          <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
          <span class="block text-xl font-extrabold text-ink">O projeto por dentro</span>
          <span class="mt-1 block max-w-2xl text-ink-muted">
            Clique num arquivo para ver para que ele serve e o conteúdo real dele no Passaporte. Ou veja como o app liga.
            No VS Code aparecem mais alguns arquivos (README.md, .gitignore, tsconfig.app.json); aqui ficam só os principais.
          </span>
        </span>
        <button
          type="button"
          data-boot
          class="rounded-full bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:bg-primary-soft"
          (click)="bootStep()"
        >
          {{ bootIndex() === -1 ? '▶ Como o app liga' : bootIndex() < 3 ? 'Próximo passo →' : '↺ Ver de novo' }}
        </button>
      </figcaption>

      <div class="grid gap-4 lg:grid-cols-[16rem_1fr]">
        <ul class="flex flex-col gap-0.5 rounded-2xl border border-line bg-surface-raised p-2 font-mono text-sm" aria-label="Arquivos do projeto passaporte">
          @for (file of files; track file.path) {
            <li>
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-lg py-1.5 pr-2 text-left"
                [style.padding-left.rem]="0.5 + file.depth * 1.1"
                [class]="selected() === file.path ? 'bg-inside/15 font-bold text-ink' : 'text-ink-muted hover:bg-surface hover:text-ink'"
                [attr.data-file]="file.path"
                [attr.aria-pressed]="selected() === file.path"
                (click)="open(file.path)"
              >
                <span aria-hidden="true">{{ file.folder ? '📁' : '📄' }}</span>{{ name(file) }}
              </button>
            </li>
          }
        </ul>

        <div data-detail class="min-w-0 rounded-2xl border border-line bg-surface-raised p-4">
          @if (current(); as file) {
            <p class="font-mono text-sm font-bold text-inside">{{ file.path }}</p>
            @if (bootIndex() >= 0) {
              <p class="mt-2 rounded-xl bg-highlight/15 px-3 py-2 font-semibold text-ink">{{ bootText() }}</p>
            }
            <p class="mt-2 text-ink">{{ file.about }}</p>
            @if (file.snippet) {
              <vm-code [snippet]="file.snippet" [caption]="name(file)" />
            }
          } @else {
            <p class="text-ink-muted">Escolha um arquivo à esquerda.</p>
          }
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class ProjectExplorer {
  protected readonly files = PROJECT_FILES;
  protected readonly selected = signal<string | null>(null);
  protected readonly bootIndex = signal(-1);
  protected readonly current = computed(() => PROJECT_FILES.find((file) => file.path === this.selected()) ?? null);
  protected readonly bootText = computed(() => BOOT_STEPS[this.bootIndex()] ?? '');
  protected readonly announcement = computed(() => {
    const file = this.current();
    if (!file) return '';
    return `${this.bootIndex() >= 0 ? this.bootText() + ' ' : ''}${file.path}: ${file.about}`;
  });

  protected name(file: ProjectFile): string {
    const parts = file.path.split('/').filter(Boolean);
    return parts.at(-1)! + (file.folder ? '/' : '');
  }

  protected open(path: string): void {
    this.bootIndex.set(-1);
    this.selected.set(path);
  }

  protected bootStep(): void {
    const next = this.bootIndex() >= BOOT_PATH.length - 1 ? 0 : this.bootIndex() + 1;
    this.bootIndex.set(next);
    this.selected.set(BOOT_PATH[next]);
  }
}
