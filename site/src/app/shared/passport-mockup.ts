import { ChangeDetectionStrategy, Component } from '@angular/core';

const SAMPLE_COUNTRIES = [
  { flag: '🇧🇷', name: 'Brasil', detail: 'Visitado · Brasília', stars: '★★★★★' },
  { flag: '🇵🇹', name: 'Portugal', detail: 'Visitado · Lisboa', stars: '★★★★☆' },
  { flag: '🇯🇵', name: 'Japão', detail: 'Desejado · Tóquio', stars: '' },
  { flag: '🇦🇷', name: 'Argentina', detail: 'Visitado · Buenos Aires', stars: '★★★★☆' },
];

/** Uma ilustração do app Passaporte pronto, num celular. É decorativa: o texto ao redor explica o que ela mostra. */
@Component({
  selector: 'vm-passport-mockup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose block', 'aria-hidden': 'true' },
  template: `
    <div class="mx-auto w-full max-w-sm rounded-[2.2rem] border-[10px] border-primary bg-surface p-4 shadow-2xl shadow-primary/25">
      <div class="flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-on-primary">
        <span class="font-extrabold">🛂 Passaporte</span>
        <span class="rounded-full bg-highlight px-2.5 py-0.5 text-xs font-extrabold text-primary">12% do mundo</span>
      </div>
      <div class="mt-3 flex gap-2 text-xs font-bold">
        <span class="rounded-full bg-primary px-3 py-1 text-on-primary">Visitados · 3</span>
        <span class="rounded-full border border-line px-3 py-1 text-ink-muted">Desejados · 5</span>
      </div>
      <ul class="mt-3 flex flex-col gap-2">
        @for (country of countries; track country.name) {
          <li class="flex items-center gap-3 rounded-xl border border-line bg-surface-raised px-3 py-2.5">
            <span class="text-2xl">{{ country.flag }}</span>
            <span class="flex-1">
              <span class="block font-bold leading-tight">{{ country.name }}</span>
              <span class="text-xs text-ink-muted">{{ country.detail }}</span>
            </span>
            <span class="text-sm text-highlight">{{ country.stars }}</span>
          </li>
        }
      </ul>
    </div>
  `,
})
export class PassportMockup {
  protected readonly countries = SAMPLE_COUNTRIES;
}
