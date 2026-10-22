import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { ClassBuilder } from './class-builder';
import { CHAPTER_13 } from './content';

@Component({
  selector: 'vm-chapter-13',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ClassBuilder],
  templateUrl: './chapter.html',
})
export class Chapter13 {
  protected readonly content = CHAPTER_13;
}
