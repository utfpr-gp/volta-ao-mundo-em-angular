import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type Destination = '/passaporte' | '/entrar' | '/paises';

/** Simulador do capítulo 38: o que o authGuard e o guestGuard decidem, passo a passo, para cada pessoa e cada destino. */
@Component({
  selector: 'vm-guard-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">O porteiro das rotas</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Escolha quem está usando o app e para onde quer ir. Depois, desligue a espera pela sessão e abra o app com o token
          vencido: veja o guard decidir cedo demais.
        </span>
      </figcaption>

      <div class="flex flex-col gap-3 text-ink">
        <fieldset class="flex flex-wrap items-center gap-3">
          <legend class="mb-1 text-sm font-bold">Quem abre o app</legend>
          <label class="flex items-center gap-1"><input type="radio" name="sim-person" [checked]="!signedIn()" (change)="signedIn.set(false)" /> Sem login</label>
          <label class="flex items-center gap-1"><input type="radio" name="sim-person" [checked]="signedIn()" (change)="signedIn.set(true)" /> Ana, já logada</label>
        </fieldset>
        <label class="flex items-center gap-2">
          <input id="sim-expired" type="checkbox" [checked]="expired()" (change)="expired.set(!expired())" />
          O token da Ana venceu: o Supabase precisa renová-lo pela rede antes de anunciar a sessão
        </label>
        <label class="flex items-center gap-2">
          <input id="sim-wait" type="checkbox" [checked]="wait()" (change)="wait.set(!wait())" />
          O guard espera <code>await auth.whenReady()</code>
        </label>
        <div class="flex flex-wrap gap-2">
          @for (destination of destinations; track destination) {
            <button type="button" class="rounded-full border border-line px-3 py-1 font-mono text-xs font-bold" (click)="go(destination)">
              abrir {{ destination }}
            </button>
          }
        </div>
      </div>

      <ol data-trace class="mt-4 flex flex-col gap-1 rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">
        @for (line of trace(); track $index) {
          <li>{{ line }}</li>
        } @empty {
          <li>(escolha um destino)</li>
        }
      </ol>
      <p data-announce aria-live="polite" class="sr-only">{{ trace().at(-1) }}</p>
    </figure>
  `,
})
export class GuardSim {
  protected readonly destinations: Destination[] = ['/passaporte', '/entrar', '/paises'];
  protected readonly signedIn = signal(false);
  protected readonly expired = signal(false);
  protected readonly wait = signal(true);
  protected readonly trace = signal<string[]>([]);

  protected go(destination: Destination): void {
    const lines: string[] = [`navegar para ${destination}`];
    let url: string = destination;
    let sessionArrived = false;
    let decidedEarly = false;

    // Até dois guards por navegação: o desvio para /entrar passa pelo guestGuard, e ele pode mandar de volta.
    for (let hop = 0; hop < 3; hop++) {
      const guard = url === '/passaporte' ? 'authGuard' : url.startsWith('/entrar') ? 'guestGuard' : null;
      if (!guard) {
        lines.push(`${url}: sem guard, a tela abre`);
        break;
      }
      // Sem esperar, com o token vencido, o guard olha a sessão antes de o Supabase anunciá-la.
      const decidesEarly = guard === 'authGuard' && !this.wait() && this.expired() && !sessionArrived;
      const sees = this.signedIn() && !decidesEarly;
      const late = guard === 'authGuard' && sessionArrived && decidedEarly;
      if (decidesEarly) decidedEarly = true;
      lines.push(
        late
          ? 'authGuard: agora a sessão chegou, e signedIn() vale true'
          : decidesEarly
          ? `${guard}: não esperou; a sessão ainda não chegou, e signedIn() vale false`
          : `${guard}: ${guard === 'authGuard' && this.wait() ? 'esperou o whenReady(); ' : ''}signedIn() vale ${sees}`,
      );
      if (guard === 'authGuard') {
        if (sees) {
          lines.push(late ? 'authGuard: devolve true, a tela abre (depois de passar pela tela de entrar)' : 'authGuard: devolve true, a tela abre');
          break;
        }
        url = `/entrar?voltar=${encodeURIComponent(destination)}`;
        lines.push(`authGuard: devolve UrlTree → ${url}`);
      } else {
        if (!this.signedIn()) {
          lines.push('guestGuard: devolve true, a tela de entrar abre');
          break;
        }
        url = '/passaporte';
        sessionArrived = true;
        lines.push('guestGuard: esperou a sessão, a Ana está logada → /passaporte');
      }
    }
    this.trace.set(lines);
  }
}
