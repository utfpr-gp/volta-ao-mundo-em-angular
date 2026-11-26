import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CiSim } from './ci-sim';
import { CHAPTER_49 } from './content';

@Component({
  selector: 'vm-chapter-49',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, CiSim],
  templateUrl: './chapter.html',
})
export class Chapter49 {
  protected readonly content = CHAPTER_49;
}
