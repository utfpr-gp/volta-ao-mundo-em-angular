import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_42 } from './content';
import { SafetyNetSim } from './safety-net-sim';

@Component({
  selector: 'vm-chapter-42',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, SafetyNetSim],
  templateUrl: './chapter.html',
})
export class Chapter42 {
  protected readonly content = CHAPTER_42;
}
