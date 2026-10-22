import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_09 } from './content';
import { SignalGraph } from './signal-graph';

@Component({
  selector: 'vm-chapter-09',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, SignalGraph],
  templateUrl: './chapter.html',
})
export class Chapter09 {
  protected readonly content = CHAPTER_09;
}
