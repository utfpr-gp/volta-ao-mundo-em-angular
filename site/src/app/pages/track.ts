import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { trackById } from '../catalog/catalog';
import { NotFound } from './not-found';

@Component({
  selector: 'vm-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NotFound],
  template: `
    @if (track(); as track) {
      <h1 class="px-4 py-10 text-4xl font-extrabold">{{ track.emoji }} {{ track.name }}</h1>
    } @else {
      <vm-not-found />
    }
  `,
})
export class Track {
  readonly trilha = input.required<string>();
  protected readonly track = computed(() => trackById(this.trilha()));
}
