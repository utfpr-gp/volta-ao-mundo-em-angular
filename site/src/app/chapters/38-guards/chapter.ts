import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_38 } from './content';
import { GuardSim } from './guard-sim';

@Component({
  selector: 'vm-chapter-38',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, GuardSim],
  templateUrl: './chapter.html',
})
export class Chapter38 {
  protected readonly content = CHAPTER_38;
}
