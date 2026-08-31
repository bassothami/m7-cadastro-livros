import {
  HttpClient,
  HttpErrorResponse
} from "@angular/common/http";

import {
  Injectable,
  inject
} from "@angular/core";

import {
  firstValueFrom
} from "rxjs";

import {
  Livro,
  StatusLivro
} from "../models/livro";

@Injectable({
  providedIn: "root"
})
export class LivrosService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
  "https://m7-livros-api-5749.onrender.com/api/livros";


  listar(): Promise<Livro[]> {
    return firstValueFrom(
      this.http.get<Livro[]>(
        this.apiUrl
      )
    );
  }


  adicionar(livro: Livro): Promise<Livro> {
    return firstValueFrom(
      this.http.post<Livro>(
        this.apiUrl,
        livro
      )
    );
  }


  async buscarPorId(
    id: number
  ): Promise<Livro | undefined> {

    try {

      return await firstValueFrom(
        this.http.get<Livro>(
          `${this.apiUrl}/${id}`
        )
      );

    } catch (erro) {

      if (
        erro instanceof HttpErrorResponse &&
        erro.status === 404
      ) {
        return undefined;
      }

      throw erro;
    }
  }


  remover(id: number): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(
        `${this.apiUrl}/${id}`
      )
    );
  }


  alterarStatus(
    id: number,
    status: StatusLivro
  ): Promise<Livro | undefined> {

    return firstValueFrom(
      this.http.patch<Livro>(
        `${this.apiUrl}/${id}/status`,
        { status }
      )
    );
  }

}