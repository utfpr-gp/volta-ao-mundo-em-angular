import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_37 } from './content';
import { SessionSim } from './session-sim';

@Component({
  selector: 'vm-chapter-37',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, SessionSim],
  templateUrl: './chapter.html',
})
export class Chapter37 {
  protected readonly content = CHAPTER_37;
}
