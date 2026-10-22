import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { BindingFlow } from './binding-flow';
import { CHAPTER_07 } from './content';

@Component({
  selector: 'vm-chapter-07',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, BindingFlow],
  templateUrl: './chapter.html',
})
export class Chapter07 {
  protected readonly content = CHAPTER_07;
}
