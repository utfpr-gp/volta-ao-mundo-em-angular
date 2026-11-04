import { Component, computed, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';

@Component({
  imports: [],
  selector: 'app-local-clock',
  template: `<p class="text-sm text-ink-muted">🕒 Agora em {{ city() }}: <strong class="text-ink">{{ time() }}</strong></p>`,
})
export class LocalClock {
  readonly city = input.required<string>();
  readonly timeZone = input.required<string>();

  /** Um Observable que bate a cada segundo, virado signal. O toSignal desliga o intervalo quando o componente some. */
  private readonly now = toSignal(interval(1000).pipe(map(() => new Date())), { initialValue: new Date() });

  protected readonly time = computed(() =>
    new Intl.DateTimeFormat('pt-BR', { timeZone: this.timeZone(), timeStyle: 'medium' }).format(this.now()),
  );
}
