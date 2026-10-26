import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_34 } from './content';
import { FormSim } from './form-sim';

@Component({
  selector: 'vm-chapter-34',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, FormSim],
  templateUrl: './chapter.html',
})
export class Chapter34 {
  protected readonly content = CHAPTER_34;
}
