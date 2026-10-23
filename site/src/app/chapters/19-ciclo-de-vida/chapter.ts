import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_19 } from './content';
import { LifecycleLab } from './lifecycle-lab';

@Component({
  selector: 'vm-chapter-19',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, LifecycleLab],
  templateUrl: './chapter.html',
})
export class Chapter19 {
  protected readonly content = CHAPTER_19;
}
