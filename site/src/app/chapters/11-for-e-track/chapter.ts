import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_11 } from './content';
import { TrackLab } from './track-lab';

@Component({
  selector: 'vm-chapter-11',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, TrackLab],
  templateUrl: './chapter.html',
})
export class Chapter11 {
  protected readonly content = CHAPTER_11;
}
