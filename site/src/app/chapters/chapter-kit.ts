import { Term } from '../glossary/term';
import { Analogy } from '../views/analogy';
import { ChapterPage } from '../views/chapter-page';
import { Challenge } from '../views/challenge';
import { Code } from '../views/code';
import { DeepDive } from '../views/deep-dive';
import { FurtherLinks } from '../views/further-links';
import { Pitfall } from '../views/pitfall';
import { SeeChapter } from '../views/see-chapter';
import { StepDirective, Steps } from '../views/steps';
import { View } from '../views/view';

/** Os componentes que todo capítulo usa. Cada capítulo acrescenta o seu simulador. */
export const CHAPTER_KIT = [
  ChapterPage,
  View,
  Analogy,
  Code,
  Steps,
  StepDirective,
  Pitfall,
  DeepDive,
  SeeChapter,
  Challenge,
  FurtherLinks,
  Term,
] as const;
