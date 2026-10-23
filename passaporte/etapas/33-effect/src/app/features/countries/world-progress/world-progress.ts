import { PercentPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Passport } from '../../../core/passport';

@Component({
  imports: [PercentPipe, RouterLink],
  selector: 'app-world-progress',
  styleUrl: './world-progress.css',
  templateUrl: './world-progress.html',
})
export class WorldProgress {
  protected readonly totalCountries = 195;
  protected readonly visitedCount = inject(Passport).visitedCount;
  protected readonly percent = computed(() => Math.round((this.visitedCount() / this.totalCountries) * 100));
  protected readonly share = computed(() => this.visitedCount() / this.totalCountries);
  protected readonly remaining = computed(() => this.totalCountries - this.visitedCount());
  protected readonly level = computed(() => {
    const count = this.visitedCount();
    if (count === 0) return 'airport';
    if (count < 10) return 'backpacker';
    if (count < 50) return 'traveler';
    return 'explorer';
  });
}
