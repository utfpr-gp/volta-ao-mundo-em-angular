import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_40 } from './content';
import { RlsSim } from './rls-sim';

@Component({
  selector: 'vm-chapter-40',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, RlsSim],
  templateUrl: './chapter.html',
})
export class Chapter40 {
  protected readonly content = CHAPTER_40;
}
