import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_14 } from './content';
import { TokenEditor } from './token-editor';

@Component({
  selector: 'vm-chapter-14',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, TokenEditor],
  templateUrl: './chapter.html',
})
export class Chapter14 {
  protected readonly content = CHAPTER_14;
}
