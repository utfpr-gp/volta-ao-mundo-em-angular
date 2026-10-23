import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_28 } from './content';
import { ServiceSim } from './service-sim';

@Component({
  selector: 'vm-chapter-28',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ServiceSim],
  templateUrl: './chapter.html',
})
export class Chapter28 {
  protected readonly content = CHAPTER_28;
}
