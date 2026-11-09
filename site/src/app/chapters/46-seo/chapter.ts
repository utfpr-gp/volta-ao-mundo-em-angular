import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_46 } from './content';
import { GoogleSim } from './google-sim';

@Component({
  selector: 'vm-chapter-46',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, GoogleSim],
  templateUrl: './chapter.html',
})
export class Chapter46 {
  protected readonly content = CHAPTER_46;
}
