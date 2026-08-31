import { Component, output, signal } from "@angular/core";

import { Livro, StatusLivro } from "../../models/livro";

export type NovoLivro = Omit<Livro, "id">;

@Component({
  selector: "app-formulario-livro",
  standalone: true,
  templateUrl: "./formulario-livro.html",
  styleUrl: "./formulario-livro.css"
})
export class FormularioLivro {

  readonly salvar = output<NovoLivro>();
  readonly cancelar = output<void>();

  readonly titulo = signal("");
  readonly autor = signal("");
  readonly categoria = signal("");
  readonly ano = signal(new Date().getFullYear());
  readonly status = signal<StatusLivro>("disponivel");
  readonly descricao = signal("");

  alterarTitulo(valor: string): void {
    this.titulo.set(valor);
  }

  alterarAutor(valor: string): void {
    this.autor.set(valor);
  }

  alterarCategoria(valor: string): void {
    this.categoria.set(valor);
  }

  alterarAno(valor: string): void {
    this.ano.set(Number(valor));
  }

  alterarStatus(valor: StatusLivro): void {
    this.status.set(valor);
  }

  alterarDescricao(valor: string): void {
    this.descricao.set(valor);
  }

  enviar(): void {
    this.salvar.emit({
      titulo: this.titulo().trim(),
      autor: this.autor().trim(),
      categoria: this.categoria().trim(),
      ano: this.ano(),
      status: this.status(),
      descricao: this.descricao().trim()
    });

    this.limpar();
  }

  cancelarFormulario(): void {
    this.limpar();
    this.cancelar.emit();
  }

  private limpar(): void {
    this.titulo.set("");
    this.autor.set("");
    this.categoria.set("");
    this.ano.set(new Date().getFullYear());
    this.status.set("disponivel");
    this.descricao.set("");
  }
}