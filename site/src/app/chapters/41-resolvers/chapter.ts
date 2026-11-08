import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_41 } from './content';
import { ResolverSim } from './resolver-sim';

@Component({
  selector: 'vm-chapter-41',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ResolverSim],
  templateUrl: './chapter.html',
})
export class Chapter41 {
  protected readonly content = CHAPTER_41;
}
