import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_15 } from './content';
import { TreeFlow } from './tree-flow';

@Component({
  selector: 'vm-chapter-15',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, TreeFlow],
  templateUrl: './chapter.html',
})
export class Chapter15 {
  protected readonly content = CHAPTER_15;
}
