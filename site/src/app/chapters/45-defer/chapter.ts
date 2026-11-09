import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_45 } from './content';
import { DeferSim } from './defer-sim';

@Component({
  selector: 'vm-chapter-45',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, DeferSim],
  templateUrl: './chapter.html',
})
export class Chapter45 {
  protected readonly content = CHAPTER_45;
}
