import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BindingFlow } from '../07-interpolacao-e-property-binding/binding-flow';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_08 } from './content';

@Component({
  selector: 'vm-chapter-08',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, BindingFlow],
  templateUrl: './chapter.html',
})
export class Chapter08 {
  protected readonly content = CHAPTER_08;
}
