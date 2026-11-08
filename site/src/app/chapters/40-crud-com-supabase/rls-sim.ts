import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type Who = 'ana' | 'bruno' | 'ninguem';
type Operation = 'select' | 'insert' | 'update' | 'delete';

interface Row {
  id: number;
  owner: 'ana' | 'bruno';
  country: string;
  days: number;
}

const START: Row[] = [
  { id: 1, owner: 'ana', country: 'JP', days: 10 },
  { id: 2, owner: 'bruno', country: 'IT', days: 4 },
  { id: 3, owner: 'ana', country: 'PT', days: 5 },
];

const OPERATIONS: { value: Operation; label: string; request: string }[] = [
  { value: 'select', label: 'Ler (R)', request: 'GET /rest/v1/trips?select=*' },
  { value: 'insert', label: 'Criar (C)', request: 'POST /rest/v1/trips  {"country":"CA", …}' },
  { value: 'update', label: 'Mudar a viagem 1 (U)', request: 'PATCH /rest/v1/trips?id=eq.1  {"days":1}' },
  { value: 'delete', label: 'Apagar a viagem 1 (D)', request: 'DELETE /rest/v1/trips?id=eq.1' },
];

const PEOPLE: { value: Who; label: string }[] = [
  { value: 'ana', label: 'Ana (com o token dela)' },
  { value: 'bruno', label: 'Bruno (com o token dele)' },
  { value: 'ninguem', label: 'Ninguém (só a chave publicável)' },
];

const RLS_INSERT_ERROR = '{"code":"42501","message":"new row violates row-level security policy for table \\"trips\\""}';
const NULL_USER_ERROR = '{"code":"23502","message":"null value in column \\"user_id\\" of relation \\"trips\\" violates not-null constraint"}';

/** Simulador do capítulo 40: a mesma tabela, pedidos de pessoas diferentes, com e sem as regras por linha (RLS). */
@Component({
  selector: 'vm-rls-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Quem vê o quê na tabela trips</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          A tabela tem viagens da Ana e do Bruno. Escolha quem faz o pedido e qual, e envie. Depois, desligue o RLS e repita:
          as respostas são as que o Supabase deu de verdade.
        </span>
      </figcaption>

      <div class="grid gap-4 text-ink sm:grid-cols-2">
        <fieldset class="flex flex-col gap-1">
          <legend class="mb-1 text-sm font-bold">Quem pede</legend>
          @for (person of people; track person.value) {
            <label class="flex items-center gap-2">
              <input type="radio" name="sim-who" [value]="person.value" [checked]="who() === person.value" (change)="who.set(person.value)" />
              {{ person.label }}
            </label>
          }
        </fieldset>
        <fieldset class="flex flex-col gap-1">
          <legend class="mb-1 text-sm font-bold">O pedido</legend>
          @for (operation of operations; track operation.value) {
            <label class="flex items-center gap-2">
              <input type="radio" name="sim-operation" [value]="operation.value" [checked]="op() === operation.value" (change)="op.set(operation.value)" />
              {{ operation.label }}
            </label>
          }
        </fieldset>
      </div>
      <label class="mt-3 flex items-center gap-2 text-ink">
        <input id="sim-rls" type="checkbox" [checked]="rls()" (change)="rls.set(!rls())" />
        RLS ligado, com a política "cada pessoa cuida das próprias viagens"
      </label>
      <div class="mt-3 flex flex-wrap gap-2">
        <button type="button" class="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-on-primary" (click)="send()">Enviar o pedido</button>
        <button type="button" class="rounded-full border border-line px-4 py-1.5 text-sm font-bold text-ink" (click)="reset()">Recomeçar a tabela</button>
      </div>

      <div class="mt-4 overflow-x-auto">
        <table class="w-full min-w-[18rem] border-collapse text-left text-sm text-ink">
          <caption class="sr-only">A tabela trips, como está no banco</caption>
          <thead>
            <tr class="border-b border-line"><th class="py-1 pr-3">id</th><th class="pr-3">user_id</th><th class="pr-3">country</th><th>days</th></tr>
          </thead>
          <tbody>
            @for (row of rows(); track row.id) {
              <tr data-row class="border-b border-line/60" [class.font-bold]="touched().includes(row.id)">
                <td class="py-1 pr-3 font-mono">{{ row.id }}</td>
                <td class="pr-3">{{ row.owner === 'ana' ? 'Ana' : 'Bruno' }}</td>
                <td class="pr-3 font-mono">{{ row.country }}</td>
                <td class="font-mono">{{ row.days }}</td>
              </tr>
            }
          </tbody>
        </table>
        <p class="mt-1 text-xs text-ink-muted">Em negrito, as linhas que o último pedido leu ou mudou.</p>
      </div>

      @if (answer(); as a) {
        <div data-answer class="mt-4 rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">
          <p>{{ a.request }}</p>
          <p class="mt-2 font-bold">{{ a.status }}</p>
          <p class="break-all">{{ a.body }}</p>
        </div>
        <p data-explain class="mt-2 text-sm text-ink">{{ a.explain }}</p>
      }
      <p data-announce aria-live="polite" class="sr-only">{{ answer()?.status }} {{ answer()?.explain }}</p>
    </figure>
  `,
})
export class RlsSim {
  protected readonly people = PEOPLE;
  protected readonly operations = OPERATIONS;
  protected readonly who = signal<Who>('ana');
  protected readonly op = signal<Operation>('select');
  protected readonly rls = signal(true);
  protected readonly rows = signal<Row[]>(START);
  protected readonly touched = signal<number[]>([]);
  protected readonly answer = signal<{ request: string; status: string; body: string; explain: string } | null>(null);
  private nextId = 4;

  protected reset(): void {
    this.rows.set(START);
    this.touched.set([]);
    this.answer.set(null);
    this.nextId = 4;
  }

  protected send(): void {
    const who = this.who();
    const rls = this.rls();
    const request = OPERATIONS.find((o) => o.value === this.op())!.request;
    // Com o RLS ligado, cada pessoa só alcança as próprias linhas; quem não entrou, nenhuma. Sem ele, todo mundo alcança todas.
    const reach = (row: Row) => !rls || row.owner === who;
    const json = (rows: Row[]) =>
      JSON.stringify(rows.map((r) => ({ id: r.id, user_id: r.owner === 'ana' ? 'Ana' : 'Bruno', country: r.country, days: r.days })));

    switch (this.op()) {
      case 'select': {
        const seen = this.rows().filter(reach);
        this.touched.set(seen.map((r) => r.id));
        this.answer.set({
          request,
          status: '200 OK',
          body: json(seen),
          explain: !rls
            ? 'Sem RLS, qualquer pedido com a chave publicável lê a tabela inteira, inclusive de quem nem entrou.'
            : seen.length
              ? 'Só as linhas em que o user_id é o de quem pediu.'
              : 'Uma lista vazia, sem erro nenhum: para quem não entrou, a política não deixa ver linha alguma.',
        });
        return;
      }
      case 'insert': {
        if (who === 'ninguem') {
          this.touched.set([]);
          this.answer.set(
            rls
              ? { request, status: '401 Unauthorized', body: RLS_INSERT_ERROR, explain: 'A linha nova não passa na política: sem token, não há auth.uid().' }
              : { request, status: '400 Bad Request', body: NULL_USER_ERROR, explain: 'Sem RLS, quem barrou foi só o not null da coluna: sem token, o user_id fica vazio.' },
          );
          return;
        }
        const row: Row = { id: this.nextId++, owner: who, country: 'CA', days: 4 };
        this.rows.update((rows) => [...rows, row]);
        this.touched.set([row.id]);
        this.answer.set({ request, status: '201 Created', body: json([row]), explain: 'O banco preencheu o user_id com o de quem pediu (default auth.uid()).' });
        return;
      }
      case 'update': {
        const hit = this.rows().filter((r) => r.id === 1 && reach(r));
        this.rows.update((rows) => rows.map((r) => (hit.includes(r) ? { ...r, days: 1 } : r)));
        this.touched.set(hit.map((r) => r.id));
        this.answer.set({
          request,
          status: '200 OK',
          body: json(hit.map((r) => ({ ...r, days: 1 }))),
          explain: hit.length
            ? who === 'ana'
              ? 'A viagem 1 é da Ana: a mudança passou.'
              : 'Sem RLS, a viagem da Ana foi mudada por outra pessoa.'
            : 'Nenhuma linha mudou, e nenhum erro: para quem pediu, a viagem 1 não existe.',
        });
        return;
      }
      case 'delete': {
        const hit = this.rows().filter((r) => r.id === 1 && reach(r));
        this.rows.update((rows) => rows.filter((r) => !hit.includes(r)));
        this.touched.set([]);
        this.answer.set({
          request,
          status: '204 No Content',
          body: '',
          explain: hit.length
            ? who === 'ana'
              ? 'A viagem 1 era da Ana: ela sumiu da tabela.'
              : 'Sem RLS, a viagem da Ana foi apagada por outra pessoa.'
            : 'A mesma resposta de sucesso, mas nada foi apagado: a política escondeu a linha.',
        });
        return;
      }
    }
  }
}
