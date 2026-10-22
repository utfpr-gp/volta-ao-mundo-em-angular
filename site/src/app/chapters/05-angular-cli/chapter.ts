import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_05 } from './content';
import { ProjectExplorer } from './project-explorer';

@Component({
  selector: 'vm-chapter-05',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ProjectExplorer],
  templateUrl: './chapter.html',
})
export class Chapter05 {
  protected readonly content = CHAPTER_05;
}
