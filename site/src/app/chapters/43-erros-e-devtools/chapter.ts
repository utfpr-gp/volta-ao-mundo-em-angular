import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_43 } from './content';
import { ErrorReaderSim } from './error-reader-sim';

@Component({
  selector: 'vm-chapter-43',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ErrorReaderSim],
  templateUrl: './chapter.html',
})
export class Chapter43 {
  protected readonly content = CHAPTER_43;
}
