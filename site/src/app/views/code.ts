import { ChangeDetectionStrategy, Component, InjectionToken, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SNIPPETS, Snippet, SnippetId } from '../../generated/snippets';

/** De onde vêm os trechos. Os testes trocam por trechos falsos. */
export const SNIPPET_SOURCE = new InjectionToken<Record<string, Snippet>>('SNIPPET_SOURCE', {
  factory: () => SNIPPETS,
});

const LANGUAGE_LABELS: Record<string, string> = {
  'angular-ts': 'TypeScript',
  'angular-html': 'HTML',
  javascript: 'JavaScript',
  jsx: 'React (JSX)',
  vue: 'Vue',
  svelte: 'Svelte',
  css: 'CSS',
  json: 'JSON',
  bash: 'Terminal',
};

/** Um trecho de código já destacado no build, com o nome do arquivo e o botão de copiar. */
@Component({
  selector: 'vm-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-6 block' },
  template: `
    <figure class="overflow-hidden rounded-2xl border border-line bg-surface-raised shadow-sm">
      <figcaption class="flex items-center gap-3 border-b border-line px-4 py-2 text-sm">
        <span aria-hidden="true" class="flex gap-1.5">
          <span class="size-2.5 rounded-full bg-stamp/70"></span>
          <span class="size-2.5 rounded-full bg-highlight/80"></span>
          <span class="size-2.5 rounded-full bg-code/70"></span>
        </span>
        <span class="font-mono font-semibold text-ink">{{ caption() }}</span>
        <span class="ml-auto rounded-full bg-surface px-2 py-0.5 text-xs font-bold text-ink-muted">{{ language() }}</span>
        <button
          type="button"
          class="rounded-full px-3 py-1 text-xs font-bold text-link hover:bg-surface"
          (click)="copy()"
          [attr.aria-label]="'Copiar o código' + (caption() ? ' de ' + caption() : '')"
        >
          {{ copied() ? 'Copiado ✓' : 'Copiar' }}
        </button>
      </figcaption>
      <div class="code-body overflow-x-auto text-[0.9rem] leading-relaxed" [innerHTML]="html()"></div>
      <p aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class Code {
  private readonly snippets = inject(SNIPPET_SOURCE);
  private readonly sanitizer = inject(DomSanitizer);

  readonly snippet = input.required<SnippetId>();
  readonly caption = input('');

  private readonly data = computed(() => this.snippets[this.snippet()]);
  protected readonly language = computed(() => LANGUAGE_LABELS[this.data().lang] ?? this.data().lang);
  // O HTML vem do próprio build (Shiki), nunca de quem lê; precisa manter os atributos style das cores.
  protected readonly html = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.data().html));

  protected readonly copied = signal(false);
  protected readonly announcement = signal('');

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.data().source);
      this.copied.set(true);
      this.announcement.set('Código copiado para a área de transferência.');
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.announcement.set('Não foi possível copiar. Selecione o código e use Ctrl+C.');
    }
  }
}
