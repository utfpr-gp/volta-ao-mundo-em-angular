import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_50 } from './content';
import { LinkSim } from './link-sim';

@Component({
  selector: 'vm-chapter-50',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, LinkSim, RouterLink],
  templateUrl: './chapter.html',
})
export class Chapter50 {
  protected readonly content = CHAPTER_50;
}
