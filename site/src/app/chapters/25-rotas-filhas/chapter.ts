import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_25 } from './content';
import { NestedSim } from './nested-sim';

@Component({
  selector: 'vm-chapter-25',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, NestedSim],
  templateUrl: './chapter.html',
})
export class Chapter25 {
  protected readonly content = CHAPTER_25;
}
