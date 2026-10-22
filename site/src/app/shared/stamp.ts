import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Chapter } from '../catalog/catalog';

let nextId = 0;

const DATE_FORMAT = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export function formatStampDate(iso: string): string {
  return DATE_FORMAT.format(new Date(iso));
}

/**
 * O carimbo de um capítulo no passaporte. Vazio, é um círculo tracejado esperando o carimbo;
 * conquistado, vira o carimbo vermelho, levemente torto, com a data.
 */
@Component({
  selector: 'vm-stamp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' },
  template: `
    <svg
      viewBox="0 0 120 120"
      role="img"
      [attr.aria-label]="label()"
      [attr.data-stamped]="date() ? '' : null"
      [class]="classes()"
    >
      <defs>
        <path [attr.id]="arcId" d="M 22.3 86.4 A 46 46 0 1 1 97.7 86.4" />
      </defs>
      @if (date()) {
        <circle cx="60" cy="60" r="57" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-width="3.5" />
        <circle cx="60" cy="60" r="35" fill="none" stroke="currentColor" stroke-width="1.2" />
      } @else {
        <circle
          cx="60" cy="60" r="56" fill="none" stroke="currentColor" stroke-width="2.5"
          [attr.stroke-dasharray]="state() === 'coming-soon' ? '2 6' : '7 5'"
        />
      }
      <text font-size="8.8" font-weight="800" letter-spacing="0.9" fill="currentColor" text-anchor="middle">
        <textPath [attr.href]="'#' + arcId" startOffset="50%">{{ title() }}</textPath>
      </text>
      <text x="60" y="71" font-size="32" font-weight="900" fill="currentColor" text-anchor="middle">{{ chapter().number }}</text>
      <text x="60" y="104" font-size="8.5" font-weight="800" letter-spacing="0.5" fill="currentColor" text-anchor="middle">
        {{ footer() }}
      </text>
    </svg>
  `,
})
export class Stamp {
  readonly chapter = input.required<Chapter>();
  readonly date = input<string | null>(null);
  readonly state = input<'open' | 'coming-soon'>('open');
  readonly size = input<'xs' | 'sm' | 'md' | 'lg'>('sm');
  /** 'dark' quando o carimbo fica sobre o azul-marinho, como no cabeçalho do capítulo. */
  readonly tone = input<'light' | 'dark'>('light');
  /** Anima a "batida" do carimbo; usado só no momento em que ele é conquistado. */
  readonly animate = input(false);

  protected readonly arcId = `vm-stamp-${nextId++}`;
  protected readonly title = computed(() => this.chapter().shortTitle.toUpperCase());
  protected readonly formattedDate = computed(() => {
    const date = this.date();
    return date ? formatStampDate(date) : null;
  });
  protected readonly footer = computed(
    () => this.formattedDate() ?? (this.state() === 'coming-soon' ? 'EM BREVE' : '★ ★ ★'),
  );
  protected readonly classes = computed(() => {
    const size = { xs: 'size-14', sm: 'size-24', md: 'size-32', lg: 'size-40' }[this.size()];
    const dark = this.tone() === 'dark';
    if (this.date()) {
      const paper = dark ? 'rounded-full bg-surface-raised shadow-xl shadow-black/30' : '';
      return `${size} ${paper} text-stamp -rotate-[8deg] ${this.animate() ? 'motion-safe:animate-stamp' : ''}`;
    }
    const muted = dark ? 'text-on-primary-muted' : 'text-ink-muted';
    return `${size} ${muted} ${this.state() === 'coming-soon' ? 'opacity-60' : ''}`;
  });
  protected readonly label = computed(() => {
    const { number, shortTitle } = this.chapter();
    const status = this.formattedDate()
      ? `carimbado em ${this.formattedDate()}`
      : this.state() === 'coming-soon'
        ? 'em breve'
        : 'ainda sem carimbo';
    return `Capítulo ${number}, ${shortTitle}: ${status}`;
  });
}
