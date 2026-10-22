import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CHAPTERS, EXTRA_TOPICS, TRACKS, chaptersOfTrack } from '../catalog/catalog';
import { ProgressService } from '../progress/progress';
import { InlineCode } from '../shared/inline-code';
import { PassportMockup } from '../shared/passport-mockup';
import { VIEWS } from '../views/view';
import { RouteMap } from './route-map';

const VIEW_DESCRIPTIONS: Record<string, string> = {
  missao: 'O que o app ganha neste capítulo, funcionando, antes de qualquer explicação.',
  ideia: 'Uma analogia do cotidiano para o conceito entrar sem esforço.',
  'por-dentro': 'O conceito técnico de verdade, com um simulador para você ver acontecer.',
  'mao-no-codigo': 'A prática em passos curtos, com a linha nova destacada e o que muda na tela.',
  armadilhas: 'Os erros que você vai encontrar, com a mensagem exata e como sair deles.',
  desafio: 'Perguntas com correção na hora. Acertou todas, ganhou o carimbo.',
  'para-ir-alem': 'Os links da documentação oficial para aprofundar.',
};

const PASSPORT_GROWTH = [
  ['🧱', 'Uma lista de países feita de componentes'],
  ['🔢', 'Contador de visitados e a porcentagem do mundo, com signals'],
  ['🗂️', 'Filtros, lista vazia e cartões repetidos com @if e @for'],
  ['🎨', 'A identidade visual com design tokens e modo escuro'],
  ['⭐', 'Estrelas de nota clicáveis e cartões que conversam entre si'],
  ['🧭', 'Uma página para cada país, com abas de visão geral, clima e anotações'],
  ['🔎', 'Busca enquanto você digita, com dados de uma API de verdade'],
  ['📝', 'O formulário de viagem, com validação e mensagens claras'],
  ['☁️', 'Login e o seu passaporte salvo na nuvem'],
  ['📱', 'Instalável no celular, funcionando sem internet, publicado e nas lojas'],
];

@Component({
  selector: 'vm-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouteMap, InlineCode, PassportMockup],
  template: `
    <section class="relative overflow-hidden bg-primary text-on-primary">
      <div class="mx-auto grid max-w-[1400px] items-center gap-10 px-4 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pb-20 lg:pt-16">
        <div>
          <p class="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-sm font-extrabold tracking-wide text-highlight">
            <span aria-hidden="true">✈️</span> Livro aberto, gratuito e interativo
          </p>
          <h1 class="mt-6 text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl">
            Volta ao Mundo em <span class="text-highlight">Angular</span>
          </h1>
          <p class="mt-6 max-w-xl text-xl leading-relaxed text-on-primary-muted">
            Angular moderno, do zero ao deploy, construindo um app de verdade. Cada capítulo responde a uma pergunta, tem um
            simulador para você ver o conceito funcionando e termina com um desafio que vale um carimbo no seu passaporte.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            @if (nextChapter(); as next) {
              <a
                [routerLink]="['/capitulos', next.slug]"
                class="rounded-full bg-highlight px-7 py-3.5 text-lg font-extrabold text-primary no-underline shadow-lg shadow-black/20 hover:brightness-105"
              >
                Continuar a viagem: capítulo {{ next.number }} →
              </a>
            } @else {
              <a
                routerLink="/capitulos/01-o-que-e-o-angular"
                class="rounded-full bg-highlight px-7 py-3.5 text-lg font-extrabold text-primary no-underline shadow-lg shadow-black/20 hover:brightness-105"
              >
                Começar a viagem →
              </a>
            }
            <a routerLink="/passaporte" class="rounded-full border-2 border-on-primary-muted/40 px-7 py-3.5 text-lg font-bold text-on-primary no-underline hover:border-highlight">
              Meu passaporte · {{ progress.count() }}/{{ total }}
            </a>
          </div>
          <ul class="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-bold text-on-primary-muted">
            <li><span class="text-2xl font-black text-on-primary">{{ total }}</span> capítulos</li>
            <li><span class="text-2xl font-black text-on-primary">{{ tracks.length }}</span> trilhas</li>
            <li><span class="text-2xl font-black text-on-primary">1</span> app de verdade</li>
            <li><span class="text-2xl font-black text-on-primary">0</span> cadastros</li>
          </ul>
        </div>
        <vm-route-map class="mx-auto w-full max-w-xl" />
      </div>
    </section>

    <div class="mx-auto max-w-[1400px] px-4 sm:px-8">
      <section class="mt-20" aria-labelledby="como-funciona">
        <p class="text-sm font-extrabold uppercase tracking-[0.2em] text-idea">Como funciona</p>
        <h2 id="como-funciona" class="mt-2 max-w-3xl text-3xl font-extrabold sm:text-4xl">Todo capítulo segue o mesmo roteiro de viagem</h2>
        <p class="mt-3 max-w-3xl text-lg text-ink-muted">
          Você sempre sabe onde está. Primeiro vê o resultado, depois entende a ideia, olha por dentro, põe a mão no código,
          desvia das armadilhas e prova que aprendeu.
        </p>
        <ol class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (view of views; track view.id; let i = $index) {
            <li data-view-card class="rounded-card border border-line bg-surface-raised p-5">
              <div class="flex items-center gap-3">
                <span aria-hidden="true" class="grid size-11 place-items-center rounded-full text-xl" [class]="view.bubble">{{ view.icon }}</span>
                <span class="text-xs font-extrabold text-ink-muted">{{ i + 1 }}/7</span>
              </div>
              <p class="mt-3 text-lg font-extrabold" [class]="view.text">{{ view.label }}</p>
              <p class="mt-1 text-ink-muted">{{ descriptions[view.id] }}</p>
            </li>
          }
          <li class="flex flex-col justify-center rounded-card border-2 border-dashed border-highlight/60 p-5">
            <p class="text-lg font-extrabold">E mais</p>
            <p class="mt-1 text-ink-muted">
              Resumo de 1 minuto em cada capítulo, glossário, busca e uma referência rápida por trilha para consultar depois.
            </p>
          </li>
        </ol>
      </section>

      <section class="mt-24 grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]" aria-labelledby="o-app">
        <vm-passport-mockup />
        <div>
          <p class="text-sm font-extrabold uppercase tracking-[0.2em] text-mission">O app da viagem</p>
          <h2 id="o-app" class="mt-2 text-3xl font-extrabold sm:text-4xl">Você constrói o Passaporte, um capítulo de cada vez</h2>
          <p class="mt-3 text-lg text-ink-muted">
            Um app simples de países visitados e países desejados, sem regras de negócio complicadas, para a sua atenção ficar
            no Angular. Ele começa com três países fixos na tela e termina publicado na internet e nas lojas de aplicativos.
          </p>
          <ol class="mt-6 grid gap-2 sm:grid-cols-2">
            @for (step of growth; track step[1]) {
              <li class="flex items-start gap-3 rounded-xl bg-surface-raised px-4 py-3">
                <span aria-hidden="true" class="text-xl">{{ step[0] }}</span>
                <span class="font-semibold leading-snug">{{ step[1] }}</span>
              </li>
            }
          </ol>
        </div>
      </section>

      <section class="mt-24" aria-labelledby="mapa">
        <p class="text-sm font-extrabold uppercase tracking-[0.2em] text-inside">O mapa da viagem</p>
        <h2 id="mapa" class="mt-2 text-3xl font-extrabold sm:text-4xl">Nove trilhas, do embarque à produção</h2>
        <ol class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          @for (track of trackCards(); track track.id; let i = $index) {
            <li data-track-card>
              <a
                [routerLink]="['/trilhas', track.id]"
                class="group flex h-full flex-col rounded-card border border-line bg-surface-raised p-6 no-underline hover:border-link hover:shadow-lg"
              >
                <span class="flex items-center gap-3">
                  <span aria-hidden="true" class="grid size-12 place-items-center rounded-2xl bg-primary text-2xl">{{ track.emoji }}</span>
                  <span>
                    <span class="block text-xs font-extrabold uppercase tracking-[0.15em] text-ink-muted">Trilha {{ i + 1 }}</span>
                    <span class="block text-xl font-extrabold text-ink group-hover:text-link">{{ track.name }}</span>
                  </span>
                </span>
                <span class="mt-3 block flex-1 text-ink-muted">{{ track.summary }}</span>
                <span class="mt-4 flex items-center gap-3 text-sm font-bold text-ink-muted">
                  <span class="h-2 flex-1 overflow-hidden rounded-full bg-line">
                    <span class="block h-full rounded-full bg-highlight" [style.width.%]="track.percent"></span>
                  </span>
                  {{ track.stamped }}/{{ track.count }} carimbos
                </span>
              </a>
            </li>
          }
        </ol>
      </section>

      <section class="mt-24 grid gap-6 lg:grid-cols-2">
        <div class="rounded-card border border-line bg-surface-raised p-7" aria-labelledby="para-quem">
          <h2 id="para-quem" class="text-2xl font-extrabold">Para quem é</h2>
          <p class="mt-3 text-ink-muted">
            Para quem está na graduação em computação e para qualquer pessoa que já conhece HTML, CSS e o básico de JavaScript.
            Não precisa saber TypeScript: ele é ensinado no caminho.
          </p>
          <ul class="mt-4 flex flex-col gap-2 font-semibold">
            <li>✓ Gratuito, sem cadastro e sem anúncios</li>
            <li>✓ O seu progresso fica salvo só no seu navegador</li>
            <li>✓ Do primeiro <code class="font-mono">ng new</code> ao app nas lojas</li>
          </ul>
        </div>
        <div class="rounded-card border-2 border-dashed border-line p-7" aria-labelledby="alem">
          <h2 id="alem" class="text-2xl font-extrabold">Para ir além</h2>
          <p class="mt-3 text-ink-muted">Depois da volta ao mundo, alguns destinos extras, sem carimbo, em breve:</p>
          <ul class="mt-4 flex flex-col gap-2">
            @for (topic of extras; track topic) {
              <li class="flex gap-2"><span aria-hidden="true">🗺️</span> {{ topic }}</li>
            }
          </ul>
        </div>
      </section>

      <section class="mt-24 rounded-[22px] bg-primary px-6 py-10 text-center text-on-primary sm:px-12">
        <p class="text-3xl font-extrabold">Pronto para embarcar?</p>
        <p class="mx-auto mt-3 max-w-2xl text-lg text-on-primary-muted">
          A primeira parada responde à pergunta que todo mundo faz antes de começar:
          <vm-inline-code [text]="firstQuestion" />
        </p>
        <a
          routerLink="/capitulos/01-o-que-e-o-angular"
          class="mt-6 inline-block rounded-full bg-highlight px-7 py-3.5 text-lg font-extrabold text-primary no-underline hover:brightness-105"
        >
          Ler o capítulo 1 →
        </a>
        <p class="mt-8 text-sm text-on-primary-muted">
          Um livro do Prof. Roni Fabio Banaszewski · Tecnologia em Sistemas para Internet · UTFPR Guarapuava
        </p>
      </section>
    </div>
  `,
})
export class Home {
  protected readonly progress = inject(ProgressService);
  protected readonly total = CHAPTERS.length;
  protected readonly tracks = TRACKS;
  protected readonly views = VIEWS;
  protected readonly descriptions = VIEW_DESCRIPTIONS;
  protected readonly growth = PASSPORT_GROWTH;
  protected readonly extras = EXTRA_TOPICS;
  protected readonly firstQuestion = CHAPTERS[0].question;

  /** O primeiro capítulo sem carimbo, para quem já começou a viagem. */
  protected readonly nextChapter = computed(() => {
    const stamps = this.progress.stamps();
    if (this.progress.count() === 0) return undefined;
    return CHAPTERS.find((chapter) => !(chapter.slug in stamps));
  });

  protected readonly trackCards = computed(() => {
    const stamps = this.progress.stamps();
    return TRACKS.map((track) => {
      const chapters = chaptersOfTrack(track.id);
      const stamped = chapters.filter((chapter) => chapter.slug in stamps).length;
      return { ...track, count: chapters.length, stamped, percent: (stamped / chapters.length) * 100 };
    });
  });
}
