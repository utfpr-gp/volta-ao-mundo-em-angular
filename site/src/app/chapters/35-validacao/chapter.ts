import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_35 } from './content';
import { ValidationSim } from './validation-sim';

@Component({
  selector: 'vm-chapter-35',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ValidationSim],
  templateUrl: './chapter.html',
})
export class Chapter35 {
  protected readonly content = CHAPTER_35;
}
