import {
  Component,
  OnInit,
  inject,
  signal
} from "@angular/core";

import {
  ActivatedRoute,
  Router,
  RouterLink
} from "@angular/router";

import { Livro, StatusLivro } from "../../models/livro";
import { LivrosService } from "../../services/livros.service";

@Component({
  selector: "app-livro-detalhe-page",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./livro-detalhe-page.html",
  styleUrl: "./livro-detalhe-page.css"
})
export class LivroDetalhePage implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly service =
    inject(LivrosService);

  readonly livro =
    signal<Livro | undefined>(undefined);

  readonly carregando =
    signal(true);

  ngOnInit(): void {
    void this.carregar();
  }

  private async carregar(): Promise<void> {

    const id = Number(
      this.route.snapshot.paramMap.get("id")
    );

    const livro =
      await this.service.buscarPorId(id);

    this.livro.set(livro);

    this.carregando.set(false);
  }

  async alternarStatus(): Promise<void> {

    const livroAtual = this.livro();

    if (!livroAtual) {
      return;
    }

    const novoStatus: StatusLivro =
      livroAtual.status === "disponivel"
        ? "emprestado"
        : "disponivel";

    const atualizado =
      await this.service.alterarStatus(
        livroAtual.id,
        novoStatus
      );

    this.livro.set(atualizado);
  }

  async excluir(): Promise<void> {

    const livroAtual = this.livro();

    if (!livroAtual) {
      return;
    }

    await this.service.remover(livroAtual.id);

    void this.router.navigate(["/livros"]);
  }
}