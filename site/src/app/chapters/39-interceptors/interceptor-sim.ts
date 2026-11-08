import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type RequestKind = 'get-passport' | 'put-passport' | 'get-countries';

interface Step {
  /** ida (→), volta (←), ou o servidor no meio (●). */
  way: '→' | '←' | '●';
  text: string;
}

const REQUESTS: { kind: RequestKind; label: string; api: boolean }[] = [
  { kind: 'get-passport', label: 'GET localhost:3000/passport', api: true },
  { kind: 'put-passport', label: 'PUT localhost:3000/passport', api: true },
  { kind: 'get-countries', label: 'GET utfpr-gp.github.io/…/paises.json', api: false },
];

/** Simulador do capítulo 39: uma requisição passando pelos três interceptors do Passaporte, na ida e na volta. */
@Component({
  selector: 'vm-interceptor-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">A requisição atravessando os interceptors</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Escolha a requisição, diga se a Ana entrou e se o json-server está ligado, e envie. A ida passa pelos interceptors na
          ordem da lista; a volta, na ordem contrária.
        </span>
      </figcaption>

      <div class="flex flex-col gap-3 text-ink">
        <fieldset class="flex flex-col gap-1">
          <legend class="mb-1 text-sm font-bold">A requisição</legend>
          @for (request of requests; track request.kind) {
            <label class="flex items-center gap-2 font-mono text-xs">
              <input type="radio" name="sim-request" [value]="request.kind" [checked]="kind() === request.kind" (change)="kind.set(request.kind)" />
              {{ request.label }}
            </label>
          }
        </fieldset>
        <label class="flex items-center gap-2">
          <input id="sim-signed-in" type="checkbox" [checked]="signedIn()" (change)="signedIn.set(!signedIn())" />
          A Ana entrou (há um token na sessão)
        </label>
        <label class="flex items-center gap-2">
          <input id="sim-server" type="checkbox" [checked]="serverOn()" (change)="serverOn.set(!serverOn())" />
          O json-server está ligado
        </label>
        <div>
          <button type="button" class="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-on-primary" (click)="send()">Enviar a requisição</button>
        </div>
      </div>

      <ol data-trace class="mt-4 flex flex-col gap-1 rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">
        @for (step of trace(); track $index) {
          <li><span aria-hidden="true">{{ step.way }} </span>{{ step.text }}</li>
        } @empty {
          <li>(envie uma requisição)</li>
        }
      </ol>
      @if (headers(); as sent) {
        <p data-headers class="mt-3 text-sm text-ink">
          Cabeçalho que saiu: <code class="break-all">{{ sent }}</code>
        </p>
      }
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class InterceptorSim {
  protected readonly requests = REQUESTS;
  protected readonly kind = signal<RequestKind>('get-passport');
  protected readonly signedIn = signal(true);
  protected readonly serverOn = signal(true);
  protected readonly trace = signal<Step[]>([]);
  protected readonly headers = signal<string | null>(null);
  protected readonly announcement = computed(() => this.trace().at(-1)?.text ?? '');

  protected send(): void {
    const request = REQUESTS.find((r) => r.kind === this.kind())!;
    const steps: Step[] = [];
    const withToken = request.api && this.signedIn();

    steps.push({ way: '→', text: 'loadingInterceptor: start(); 1 requisição a caminho, a barra aparece' });
    if (!request.api) {
      steps.push({ way: '→', text: 'authInterceptor: não é a API do Passaporte; passa sem token' });
      steps.push({ way: '→', text: 'errorInterceptor: não é a API do Passaporte; passa direto' });
    } else {
      steps.push({
        way: '→',
        text: withToken
          ? 'authInterceptor: espera o whenReady(); a Ana entrou: clone com Authorization'
          : 'authInterceptor: espera o whenReady(); ninguém entrou: passa sem token',
      });
      steps.push({ way: '→', text: 'errorInterceptor: é a API do Passaporte; fica de olho na resposta' });
    }

    const answered = !request.api || this.serverOn();
    steps.push({
      way: '●',
      text: answered ? `servidor: 200 OK${request.kind === 'put-passport' ? ', passaporte salvo' : ''}` : 'servidor: ninguém respondeu (status 0)',
    });

    if (request.api) {
      steps.push({
        way: '←',
        text: answered ? 'errorInterceptor: chegou a resposta; failed = false' : 'errorInterceptor: failed = true, o aviso aparece; repassa o erro (throwError)',
      });
    }
    steps.push({ way: '←', text: 'loadingInterceptor: finalize → stop(); nenhuma a caminho, a barra some' });
    steps.push({ way: '←', text: answered ? 'quem pediu recebe a resposta' : 'quem pediu recebe o erro' });

    this.trace.set(steps);
    this.headers.set(withToken ? 'Authorization: Bearer eyJhbGciOi…' : null);
  }
}
