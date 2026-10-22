import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Term } from '../../glossary/term';
import { PassportMockup } from '../../shared/passport-mockup';
import { Analogy } from '../../views/analogy';
import { ChapterPage } from '../../views/chapter-page';
import { Challenge } from '../../views/challenge';
import { Code } from '../../views/code';
import { DeepDive } from '../../views/deep-dive';
import { FurtherLinks } from '../../views/further-links';
import { Pitfall } from '../../views/pitfall';
import { SeeChapter } from '../../views/see-chapter';
import { StepDirective, Steps } from '../../views/steps';
import { View } from '../../views/view';
import { CHAPTER_01 } from './content';
import { SpaSimulator } from './spa-simulator';

const FEATURES = [
  { icon: '🧩', name: 'Componentes', what: 'os blocos que formam a tela' },
  { icon: '📶', name: 'Signals', what: 'guardam o estado e atualizam a tela sozinhos' },
  { icon: '🧭', name: 'Rotas', what: 'trocam de tela sem recarregar a página' },
  { icon: '📝', name: 'Formulários', what: 'leem e validam o que a pessoa digita' },
  { icon: '📡', name: 'HTTP', what: 'conversa com o servidor' },
  { icon: '🧪', name: 'Testes', what: 'conferem se o código faz o que deveria' },
  { icon: '⌨️', name: 'Angular CLI', what: 'cria e organiza o projeto pelo terminal' },
  { icon: '📱', name: 'PWA', what: 'transforma o site em app instalável' },
];

const TIMELINE = [
  { year: '2010', text: 'AngularJS: a primeira versão, em JavaScript.', modern: false },
  { year: '2016', text: 'Angular 2: reescrito do zero, em TypeScript; logo depois, passa a se chamar só Angular.', modern: false },
  { year: '2020', text: 'Versão 9: um motor novo, o Ivy, deixa os apps menores e mais rápidos.', modern: false },
  { year: '2021', text: 'Fim do suporte ao AngularJS, em 31 de dezembro.', modern: false },
  { year: '2022', text: 'Versão 15: componentes independentes, chamados standalone.', modern: true },
  { year: '2023', text: 'Versões 16 e 17: chegam os signals, os blocos @if e @for e o novo site angular.dev.', modern: true },
  { year: '2025', text: 'Versão 21: projetos novos sem a biblioteca Zone.js e testes com o Vitest.', modern: true },
  { year: '2026', text: 'Versão 22: formulários com signals, componentes acessíveis e uma versão nova por ano.', modern: true },
];

@Component({
  selector: 'vm-chapter-01',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
    PassportMockup,
    SpaSimulator,
  ],
  templateUrl: './chapter.html',
})
export class Chapter01 {
  protected readonly content = CHAPTER_01;
  protected readonly features = FEATURES;
  protected readonly timeline = TIMELINE;
}
