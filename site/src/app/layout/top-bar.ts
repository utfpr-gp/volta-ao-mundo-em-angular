import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { TRACKS, chapterBySlug } from '../catalog/catalog';
import { ThemeToggle } from '../theme/theme-toggle';
import { BrandMark } from './brand-mark';

@Component({
  selector: 'vm-top-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ThemeToggle, BrandMark],
  host: { class: 'sticky top-0 z-30 block bg-primary text-on-primary shadow-lg shadow-primary/20' },
  template: `
    <div class="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-8">
      <a routerLink="/" class="flex items-center gap-3 font-extrabold text-on-primary no-underline">
        <vm-brand-mark />
        <span class="text-lg leading-tight sm:text-xl">Volta ao Mundo<br class="sm:hidden" /> em Angular</span>
      </a>

      <nav aria-label="Trilhas" class="order-last -mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 lg:order-none lg:mx-0 lg:w-auto lg:flex-1 lg:px-0">
        <ul class="flex gap-1.5 pb-1 lg:pb-0">
          @for (track of tracks; track track.id) {
            <li>
              <a
                [routerLink]="['/trilhas', track.id]"
                class="block whitespace-nowrap rounded-full px-3 py-1.5 text-sm no-underline transition-colors"
                [class]="track.id === currentTrack()
                  ? 'bg-highlight font-extrabold text-primary'
                  : 'bg-primary-soft text-on-primary-muted hover:text-on-primary'"
                [attr.aria-current]="track.id === currentTrack() ? 'true' : null"
              >
                <span aria-hidden="true">{{ track.emoji }}</span> {{ track.name }}
              </a>
            </li>
          }
        </ul>
      </nav>

      <div class="ml-auto flex items-center gap-1">
        <ng-content />
        <a
          routerLink="/busca"
          class="grid size-10 place-items-center rounded-full text-on-primary-muted hover:bg-primary-soft hover:text-on-primary"
          aria-label="Buscar no livro"
          title="Buscar no livro"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </a>
        <vm-theme-toggle />
      </div>
    </div>
  `,
})
export class TopBar {
  private readonly router = inject(Router);

  protected readonly tracks = TRACKS;

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly currentTrack = computed(() => {
    const [, section, id] = this.url().split(/[/?#]/);
    if (section === 'trilhas') return id;
    if (section === 'capitulos') return chapterBySlug(id ?? '')?.track;
    return undefined;
  });
}
