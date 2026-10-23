import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_30 } from './content';
import { MarbleSim } from './marble-sim';

@Component({
  selector: 'vm-chapter-30',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, MarbleSim],
  templateUrl: './chapter.html',
})
export class Chapter30 {
  protected readonly content = CHAPTER_30;
}
