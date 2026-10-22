import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_10 } from './content';
import { ControlFlowLab } from './control-flow-lab';

@Component({
  selector: 'vm-chapter-10',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ControlFlowLab],
  templateUrl: './chapter.html',
})
export class Chapter10 {
  protected readonly content = CHAPTER_10;
}
