import { Injectable } from "@angular/core";

import { Livro, StatusLivro } from "../models/livro";

@Injectable({
  providedIn: "root"
})
export class LivrosService {

  private livros: Livro[] = [
    {
      id: 1,
      titulo: "Clean Code",
      autor: "Robert C. Martin",
      categoria: "Tecnologia",
      ano: 2008,
      status: "disponivel",
      descricao: "Livro sobre boas práticas de desenvolvimento de software."
    },
    {
      id: 2,
      titulo: "Clean Architecture",
      autor: "Robert C. Martin",
      categoria: "Tecnologia",
      ano: 2017,
      status: "emprestado",
      descricao: "Livro sobre arquitetura e organização de software."
    },
    {
      id: 3,
      titulo: "O Hobbit",
      autor: "J. R. R. Tolkien",
      categoria: "Fantasia",
      ano: 1937,
      status: "disponivel",
      descricao: "A aventura de Bilbo Bolseiro pela Terra-média."
    }
  ];

  listar(): Promise<Livro[]> {
    return Promise.resolve(this.livros);
  }

  adicionar(livro: Livro): Promise<Livro> {
    this.livros.push(livro);

    return Promise.resolve(livro);
  }

  buscarPorId(id: number): Promise<Livro | undefined> {
    const livro = this.livros.find(
      livro => livro.id === id
    );

    return Promise.resolve(livro);
  }

  remover(id: number): Promise<void> {
    this.livros = this.livros.filter(
      livro => livro.id !== id
    );

    return Promise.resolve();
  }

  alterarStatus(
    id: number,
    status: StatusLivro
  ): Promise<Livro | undefined> {

    const livro = this.livros.find(
      livro => livro.id === id
    );

    if (livro) {
      livro.status = status;
    }

    return Promise.resolve(livro);
  }
}