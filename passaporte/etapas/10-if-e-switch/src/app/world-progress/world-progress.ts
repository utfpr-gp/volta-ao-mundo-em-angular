import { Component, computed, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-world-progress',
  styleUrl: './world-progress.css',
  templateUrl: './world-progress.html',
})
export class WorldProgress {
  protected readonly totalCountries = 195;
  protected readonly visitedCount = signal(2);
  protected readonly percent = computed(() => Math.round((this.visitedCount() / this.totalCountries) * 100));
  protected readonly remaining = computed(() => this.totalCountries - this.visitedCount());
  protected readonly level = computed(() => {
    const count = this.visitedCount();
    if (count === 0) return 'airport';
    if (count < 10) return 'backpacker';
    if (count < 50) return 'traveler';
    return 'explorer';
  });

  protected visitOneMore(): void {
    this.visitedCount.update((count) => Math.min(count + 1, this.totalCountries));
  }

  protected undo(): void {
    this.visitedCount.update((count) => Math.max(count - 1, 0));
  }
}
