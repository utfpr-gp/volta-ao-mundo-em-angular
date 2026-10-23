import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_18 } from './content';
import { QueryLab } from './query-lab';

@Component({
  selector: 'vm-chapter-18',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, QueryLab],
  templateUrl: './chapter.html',
})
export class Chapter18 {
  protected readonly content = CHAPTER_18;
}
