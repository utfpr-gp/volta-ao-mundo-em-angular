import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_32 } from './content';
import { ResourceSim } from './resource-sim';

@Component({
  selector: 'vm-chapter-32',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ResourceSim],
  templateUrl: './chapter.html',
})
export class Chapter32 {
  protected readonly content = CHAPTER_32;
}
