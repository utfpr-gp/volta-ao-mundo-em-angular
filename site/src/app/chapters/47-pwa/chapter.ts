import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CacheSim } from './cache-sim';
import { CHAPTER_47 } from './content';

@Component({
  selector: 'vm-chapter-47',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, CacheSim],
  templateUrl: './chapter.html',
})
export class Chapter47 {
  protected readonly content = CHAPTER_47;
}
