import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_04 } from './content';
import { TypeDetective } from './type-detective';

@Component({
  selector: 'vm-chapter-04',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, TypeDetective],
  templateUrl: './chapter.html',
})
export class Chapter04 {
  protected readonly content = CHAPTER_04;
}
