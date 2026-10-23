import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_33 } from './content';
import { EffectSim } from './effect-sim';

@Component({
  selector: 'vm-chapter-33',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, EffectSim],
  templateUrl: './chapter.html',
})
export class Chapter33 {
  protected readonly content = CHAPTER_33;
}
