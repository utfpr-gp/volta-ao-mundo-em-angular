import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { ChunkSim } from './chunk-sim';
import { CHAPTER_26 } from './content';

@Component({
  selector: 'vm-chapter-26',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ChunkSim],
  templateUrl: './chapter.html',
})
export class Chapter26 {
  protected readonly content = CHAPTER_26;
}
