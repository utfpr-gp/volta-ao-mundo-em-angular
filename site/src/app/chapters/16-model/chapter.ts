import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_16 } from './content';
import { ModelSync } from './model-sync';

@Component({
  selector: 'vm-chapter-16',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ModelSync],
  templateUrl: './chapter.html',
})
export class Chapter16 {
  protected readonly content = CHAPTER_16;
}
