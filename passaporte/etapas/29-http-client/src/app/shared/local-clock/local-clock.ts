import { Component, DestroyRef, OnInit, inject, input, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-local-clock',
  template: `<p class="text-sm text-ink-muted">🕒 Agora em {{ city() }}: <strong class="text-ink">{{ time() }}</strong></p>`,
})
export class LocalClock implements OnInit {
  readonly city = input.required<string>();
  readonly timeZone = input.required<string>();

  private readonly destroyRef = inject(DestroyRef);
  protected readonly time = signal('');

  ngOnInit(): void {
    // O componente nasceu, e os inputs já têm valor: hora de ligar o relógio.
    this.tick();
    const id = setInterval(() => this.tick(), 1000);
    // Quando o componente for destruído, desliga o relógio.
    this.destroyRef.onDestroy(() => clearInterval(id));
  }

  private tick(): void {
    const format = new Intl.DateTimeFormat('pt-BR', { timeZone: this.timeZone(), timeStyle: 'medium' });
    this.time.set(format.format(new Date()));
  }
}
