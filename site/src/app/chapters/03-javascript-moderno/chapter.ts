import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { ArrayConveyor } from './array-conveyor';
import { CHAPTER_03 } from './content';

@Component({
  selector: 'vm-chapter-03',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ArrayConveyor],
  templateUrl: './chapter.html',
})
export class Chapter03 {
  protected readonly content = CHAPTER_03;
}
