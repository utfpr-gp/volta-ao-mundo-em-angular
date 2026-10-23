import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_27 } from './content';
import { FolderSorter } from './folder-sorter';

@Component({
  selector: 'vm-chapter-27',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, FolderSorter],
  templateUrl: './chapter.html',
})
export class Chapter27 {
  protected readonly content = CHAPTER_27;
}
