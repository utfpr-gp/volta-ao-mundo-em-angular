import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_12 } from './content';
import { PipeLab } from './pipe-lab';

@Component({
  selector: 'vm-chapter-12',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, PipeLab],
  templateUrl: './chapter.html',
})
export class Chapter12 {
  protected readonly content = CHAPTER_12;
}
