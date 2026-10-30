import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_36 } from './content';
import { SignalFormSim } from './signal-form-sim';

@Component({
  selector: 'vm-chapter-36',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, SignalFormSim],
  templateUrl: './chapter.html',
})
export class Chapter36 {
  protected readonly content = CHAPTER_36;
}
