import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { REPOSITORY_URL, SITE_URL } from '../seo/site';

@Component({
  selector: 'vm-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <article data-pagefind-body class="prose prose-lg mx-auto max-w-3xl px-4 py-12 sm:px-8">
      <h1>Sobre o livro</h1>
      <p class="lead">
        O <strong>Volta ao Mundo em Angular</strong> é um livro aberto, gratuito e interativo que ensina Angular moderno do
        primeiro contato ao deploy. Ele foi pensado para quem está na graduação em computação e para qualquer pessoa que já
        conhece HTML, CSS e o básico de JavaScript e quer construir aplicações web de verdade.
      </p>

      <h2 id="como-ler">Como ler</h2>
      <p>
        Você pode ler do começo ao fim, como um curso, ou abrir só o capítulo de que precisa, como um livro de consulta.
        Cada capítulo responde a uma pergunta e segue sempre o mesmo roteiro: a missão, a ideia, por dentro, a mão no código,
        as armadilhas, o desafio e os links para ir além. Ao longo do caminho você constrói o <strong>Passaporte</strong>,
        um app de países visitados e desejados, e ganha um carimbo a cada desafio vencido.
      </p>
      <p>
        O seu progresso fica salvo só no seu navegador. Na página <a routerLink="/passaporte">Meu passaporte</a> você pode
        exportar uma cópia para levar a outro computador.
      </p>

      <h2 id="autor">Quem escreveu</h2>
      <p>
        <strong>Prof. Roni Fabio Banaszewski</strong>, do curso de Tecnologia em Sistemas para Internet da Universidade
        Tecnológica Federal do Paraná (UTFPR), câmpus Guarapuava.
      </p>

      <h2 id="como-citar">Como citar</h2>
      <blockquote>
        BANASZEWSKI, Roni Fabio. <em>Volta ao Mundo em Angular</em>. Guarapuava: UTFPR, 2026. Disponível em:
        {{ siteUrl }}.
      </blockquote>

      <h2 id="licencas">Licenças</h2>
      <ul>
        <li>
          O texto, as ilustrações e os exercícios estão sob a licença
          <a href="https://creativecommons.org/licenses/by/4.0/deed.pt-br" rel="license noopener">Creative Commons Atribuição 4.0 (CC BY 4.0)</a>:
          você pode copiar, adaptar e compartilhar, desde que dê o crédito.
        </li>
        <li>
          O código do site e dos exemplos está sob a licença
          <a [href]="repository + '/blob/main/LICENSE'" rel="noopener">MIT</a>.
        </li>
      </ul>

      <h2 id="privacidade">Privacidade</h2>
      <p>
        Este site não usa cookies de rastreamento, não tem anúncios e não envia dados de quem lê para nenhum serviço. As
        fontes são servidas pelo próprio site. O tema escolhido e os carimbos ficam guardados apenas no armazenamento local
        do seu navegador.
      </p>

      <h2 id="codigo">Código e correções</h2>
      <p>
        Todo o livro está no GitHub, em <a [href]="repository" rel="noopener">utfpr-gp/volta-ao-mundo-em-angular</a>.
        Encontrou um erro ou tem uma sugestão? Abra uma <em>issue</em> por lá.
      </p>
      <p>O site é, ele mesmo, uma aplicação Angular gerada como site estático: um exemplo vivo do que o livro ensina.</p>
    </article>
  `,
})
export class About {
  protected readonly repository = REPOSITORY_URL;
  protected readonly siteUrl = SITE_URL;
}
