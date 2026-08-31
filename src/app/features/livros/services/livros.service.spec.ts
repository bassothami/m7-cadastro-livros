import { TestBed } from "@angular/core/testing";

import { LivrosService } from "./livros.service";

describe("LivrosService", () => {

  let service: LivrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivrosService);
  });

  it("deve ser criado", () => {
    expect(service).toBeTruthy();
  });

  it("deve listar os livros cadastrados inicialmente", async () => {
    const livros = await service.listar();

    expect(livros.length).toBeGreaterThan(0);
  });

  it("deve adicionar um novo livro à lista", async () => {

    const totalAntes = (await service.listar()).length;

    await service.adicionar({
      id: 999,
      titulo: "Livro de Teste",
      autor: "Autor de Teste",
      categoria: "Testes",
      ano: 2026,
      status: "disponivel",
      descricao: "Livro criado durante um teste automatizado."
    });

    const livros = await service.listar();

    expect(livros.length).toBe(totalAntes + 1);
  });

  it("deve buscar um livro existente pelo id", async () => {
    const livro = await service.buscarPorId(1);

    expect(livro).toBeTruthy();
    expect(livro?.id).toBe(1);
  });
});