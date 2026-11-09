import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_44 } from './content';
import { ScreenReaderSim } from './screen-reader-sim';

@Component({
  selector: 'vm-chapter-44',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ScreenReaderSim],
  templateUrl: './chapter.html',
})
export class Chapter44 {
  protected readonly content = CHAPTER_44;
}
