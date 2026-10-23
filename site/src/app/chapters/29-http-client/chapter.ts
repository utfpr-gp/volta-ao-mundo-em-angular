import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_29 } from './content';
import { RequestSim } from './request-sim';

@Component({
  selector: 'vm-chapter-29',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, RequestSim],
  templateUrl: './chapter.html',
})
export class Chapter29 {
  protected readonly content = CHAPTER_29;
}
