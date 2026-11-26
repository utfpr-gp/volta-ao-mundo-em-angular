import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { HostSim } from './host-sim';
import { CHAPTER_48 } from './content';

@Component({
  selector: 'vm-chapter-48',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, HostSim],
  templateUrl: './chapter.html',
})
export class Chapter48 {
  protected readonly content = CHAPTER_48;
}
