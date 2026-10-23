import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_21 } from './content';
import { ProtoInspector } from './proto-inspector';

@Component({
  selector: 'vm-chapter-21',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, ProtoInspector],
  templateUrl: './chapter.html',
})
export class Chapter21 {
  protected readonly content = CHAPTER_21;
}
