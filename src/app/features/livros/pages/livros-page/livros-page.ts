import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from "@angular/core";

import { FiltroLivros } from "../../components/filtro-livros/filtro-livros";
import { ListaLivros } from "../../components/lista-livros/lista-livros";
import {
  FormularioLivro,
  NovoLivro
} from "../../components/formulario-livro/formulario-livro";
import { LivrosService } from "../../services/livros.service";

import {
  Livro,
  StatusLivro
} from "../../models/livro";

@Component({
  selector: "app-livros-page",
  standalone: true,
  imports: [
    FiltroLivros,
    ListaLivros,
    FormularioLivro
  ],
  templateUrl: "./livros-page.html",
  styleUrl: "./livros-page.css"
})
export class LivrosPage implements OnInit {

  private readonly livrosService =
    inject(LivrosService);

  readonly livros =
    signal<Livro[]>([]);

  readonly pesquisa =
    signal("");

  readonly filtroStatus =
    signal<StatusLivro | "todos">("todos");

  readonly carregando =
    signal(false);

  readonly erro =
    signal<string | null>(null);

  readonly mostrarFormulario =
    signal(false);

  readonly livrosFiltrados =
    computed(() => {

      const termo =
        this.pesquisa()
          .trim()
          .toLowerCase();

      const status =
        this.filtroStatus();

      return this.livros().filter(livro => {

        const correspondeTexto =
          termo === "" ||
          livro.titulo.toLowerCase().includes(termo) ||
          livro.autor.toLowerCase().includes(termo) ||
          livro.categoria.toLowerCase().includes(termo);

        const correspondeStatus =
          status === "todos" ||
          livro.status === status;

        return correspondeTexto &&
          correspondeStatus;
      });
    });

  ngOnInit(): void {
    void this.carregarLivros();
  }

  async carregarLivros(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(null);

    try {

      const dados =
        await this.livrosService.listar();

      this.livros.set(dados);
    } catch {
      this.erro.set(
        "Não foi possível carregar os livros."
      );

    } finally {
      this.carregando.set(false);
    }
  }

  atualizarPesquisa(valor: string): void {
    this.pesquisa.set(valor);
  }

  atualizarStatus(
    valor: StatusLivro | "todos"
  ): void {
    this.filtroStatus.set(valor);
  }

  abrirFormulario(): void {
    this.mostrarFormulario.set(true);
  }

  fecharFormulario(): void {
    this.mostrarFormulario.set(false);
  }

  async criarLivro(dados: NovoLivro): Promise<void> {

    const novoLivro: Livro = {
      id: this.proximoId(),
      ...dados
    };

    await this.livrosService.adicionar(novoLivro);

    this.livros.update(livros => [
      ...livros,
      novoLivro
    ]);

    this.mostrarFormulario.set(false);
  }

  async removerLivro(id: number): Promise<void> {
    await this.livrosService.remover(id);

    this.livros.update(livros =>
      livros.filter(livro => livro.id !== id)
    );
  }

  async alternarStatusLivro(id: number): Promise<void> {

    const livroAtual =
      this.livros().find(livro => livro.id === id);

    if (!livroAtual) {
      return;
    }

    const novoStatus: StatusLivro =
      livroAtual.status === "disponivel"
        ? "emprestado"
        : "disponivel";

    const atualizado =
      await this.livrosService.alterarStatus(id, novoStatus);

    if (atualizado) {
      this.livros.update(livros =>
        livros.map(livro =>
          livro.id === id ? atualizado : livro
        )
      );
    }
  }

  private proximoId(): number {
    const maiorId = this.livros().reduce(
      (max, livro) => Math.max(max, livro.id),
      0
    );

    return maiorId + 1;
  }
}