import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Install = 'apk' | 'loja';

interface Check {
  label: string;
  ok: boolean;
}

/**
 * Simulador do capítulo 50: ao abrir o app Android (uma Trusted Web Activity), o Android confere o
 * /.well-known/assetlinks.json do site. Segue a documentação do PWABuilder: arquivo ausente ou errado faz aparecer a barra
 * de endereço; o Google Play assina de novo o app, e a impressão digital dele precisa entrar no arquivo.
 */
export function verify(options: { file: boolean; samePackage: boolean; playKey: boolean; install: Install }): { checks: Check[]; trusted: boolean } {
  const checks: Check[] = [
    { label: 'O site responde /.well-known/assetlinks.json', ok: options.file },
    { label: 'O package_name do arquivo é o do app', ok: options.file && options.samePackage },
    {
      label:
        options.install === 'apk'
          ? 'A impressão digital da chave do PWABuilder (que assinou o .apk) está no arquivo'
          : 'A impressão digital do Google Play (que assina de novo o app da loja) está no arquivo',
      ok: options.file && (options.install === 'apk' || options.playKey),
    },
  ];
  return { checks, trusted: checks.every((check) => check.ok) };
}

@Component({
  selector: 'vm-link-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">O Android confere o vínculo</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Monte o site e o jeito de instalar o app. Ao abrir o Passaporte, o Android confere o arquivo de vínculo e decide se
          mostra o app limpo ou com a barra de endereço do navegador.
        </span>
      </figcaption>

      <div class="grid gap-4 text-ink sm:grid-cols-2 [&>*]:min-w-0">
        <fieldset class="flex flex-col gap-2 text-sm">
          <legend class="mb-1 font-bold">O site</legend>
          <label class="flex items-center gap-2">
            <input type="checkbox" data-file [checked]="file()" (change)="file.set(!file())" />
            Publica o assetlinks.json
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" data-package [checked]="samePackage()" (change)="samePackage.set(!samePackage())" />
            Com o mesmo package_name do app
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" data-play [checked]="playKey()" (change)="playKey.set(!playKey())" />
            Com a impressão digital do Google Play
          </label>
        </fieldset>
        <fieldset class="flex flex-col gap-1 text-sm">
          <legend class="mb-1 font-bold">A instalação</legend>
          <label class="flex items-center gap-2">
            <input type="radio" name="link-install" value="apk" [checked]="install() === 'apk'" (change)="install.set('apk')" />
            O .apk, direto no celular
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" name="link-install" value="loja" [checked]="install() === 'loja'" (change)="install.set('loja')" />
            Pelo Google Play
          </label>
        </fieldset>
      </div>

      <ol data-checks class="mt-4 flex flex-col gap-1 rounded-2xl border border-line bg-surface-raised p-4 text-sm text-ink">
        @for (check of result().checks; track check.label) {
          <li [attr.data-ok]="check.ok">{{ check.ok ? '✓' : '✗' }} {{ check.label }}</li>
        }
      </ol>

      <p data-result aria-live="polite" class="mt-3 min-h-12 rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">
        {{
          result().trusted
            ? 'O Android confia no app: o Passaporte abre em tela cheia, sem barra de endereço.'
            : 'O Android não confirma o vínculo: o Passaporte abre com a barra de endereço do navegador no topo.'
        }}
      </p>
    </figure>
  `,
})
export class LinkSim {
  protected readonly file = signal(false);
  protected readonly samePackage = signal(true);
  protected readonly playKey = signal(false);
  protected readonly install = signal<Install>('apk');
  protected readonly result = computed(() =>
    verify({ file: this.file(), samePackage: this.samePackage(), playKey: this.playKey(), install: this.install() }),
  );
}
