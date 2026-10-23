import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { BridgeSim } from './bridge-sim';
import { CHAPTER_31 } from './content';

@Component({
  selector: 'vm-chapter-31',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, BridgeSim],
  templateUrl: './chapter.html',
})
export class Chapter31 {
  protected readonly content = CHAPTER_31;
}
