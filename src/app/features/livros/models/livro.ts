export type StatusLivro = "disponivel" | "emprestado";

export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  ano: number;
  status: StatusLivro;
  descricao: string;
}