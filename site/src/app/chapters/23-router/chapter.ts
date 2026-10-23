import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_23 } from './content';
import { RouterSim } from './router-sim';

@Component({
  selector: 'vm-chapter-23',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, RouterSim],
  templateUrl: './chapter.html',
})
export class Chapter23 {
  protected readonly content = CHAPTER_23;
}
