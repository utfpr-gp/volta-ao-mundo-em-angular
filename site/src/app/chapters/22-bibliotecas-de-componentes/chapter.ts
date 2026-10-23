import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHAPTER_KIT } from '../chapter-kit';
import { CHAPTER_22 } from './content';
import { LibraryPicker } from './library-picker';

@Component({
  selector: 'vm-chapter-22',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAPTER_KIT, LibraryPicker],
  templateUrl: './chapter.html',
})
export class Chapter22 {
  protected readonly content = CHAPTER_22;
  protected readonly shots = [
    {
      file: 'material',
      name: 'Angular Material',
      alt: 'O cartão do Japão no Angular Material: borda cinza arredondada, título grande, Tóquio em negrito, e dois botões em pílula, Detalhes com contorno e Visitar azul.',
    },
    {
      file: 'prime',
      name: 'PrimeNG',
      alt: 'O cartão do Japão no PrimeNG: sombra leve, Tóquio em cinza, botões verdes pequenos, e um aviso vermelho Invalid PrimeUI License no canto.',
    },
    {
      file: 'daisy',
      name: 'daisyUI',
      alt: 'O cartão do Japão no daisyUI: título em negrito, botão Detalhes com contorno preto e botão Visitar roxo.',
    },
    {
      file: 'spartan',
      name: 'Spartan',
      alt: 'O cartão do Japão no Spartan: visual discreto em tons de cinza, rodapé com fundo cinza claro, botão Detalhes branco e Visitar preto.',
    },
  ];
}
