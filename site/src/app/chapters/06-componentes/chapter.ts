import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { AtomicBuilder } from './atomic-builder';
import { CHAPTER_06 } from './content';

@Component({
  selector: 'vm-chapter-06',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, AtomicBuilder],
  templateUrl: './chapter.html',
})
export class Chapter06 {
  protected readonly content = CHAPTER_06;
}
