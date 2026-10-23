import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_20 } from './content';
import { ViewportLab } from './viewport-lab';

@Component({
  selector: 'vm-chapter-20',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ViewportLab],
  templateUrl: './chapter.html',
})
export class Chapter20 {
  protected readonly content = CHAPTER_20;
}
