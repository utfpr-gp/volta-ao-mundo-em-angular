import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_02 } from './content';
import { TerminalTrainer } from './terminal-trainer';

@Component({
  selector: 'vm-chapter-02',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, TerminalTrainer],
  templateUrl: './chapter.html',
})
export class Chapter02 {
  protected readonly content = CHAPTER_02;
}
