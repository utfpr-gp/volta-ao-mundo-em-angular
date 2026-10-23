import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_24 } from './content';
import { ParamSim } from './param-sim';

@Component({
  selector: 'vm-chapter-24',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ParamSim],
  templateUrl: './chapter.html',
})
export class Chapter24 {
  protected readonly content = CHAPTER_24;
}
