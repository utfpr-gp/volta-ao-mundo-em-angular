import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_17 } from './content';
import { ProjectionLab } from './projection-lab';

@Component({
  selector: 'vm-chapter-17',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ProjectionLab],
  templateUrl: './chapter.html',
})
export class Chapter17 {
  protected readonly content = CHAPTER_17;
}
