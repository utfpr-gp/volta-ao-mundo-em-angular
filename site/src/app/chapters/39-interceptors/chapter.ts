import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_39 } from './content';
import { InterceptorSim } from './interceptor-sim';

@Component({
  selector: 'vm-chapter-39',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, InterceptorSim],
  templateUrl: './chapter.html',
})
export class Chapter39 {
  protected readonly content = CHAPTER_39;
}
