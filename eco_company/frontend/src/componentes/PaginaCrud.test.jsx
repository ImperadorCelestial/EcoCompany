import {
  render,
  screen
} from "@testing-library/react";

import {
  beforeEach,
  expect,
  test,
  vi
} from "vitest";

import { api } from "../servicos/api";
import PaginaCrud from "./PaginaCrud.jsx";
import userEvent from "@testing-library/user-event";

vi.mock("../servicos/api", () => ({
  api: {
    listar: vi.fn(),
    criar: vi.fn(),
    atualizar: vi.fn(),
    remover: vi.fn()
  }
}));

const configuracao = {
  recurso: "maquinas",
  titulo: "Maquinas",
  subtitulo: "Lista de equipamentos",
  iconeVazio: "M",
  colunas: [],
  campos: []
};

beforeEach(() => {
  vi.clearAllMocks();
});

test("apresenta o estado vazio quando nao existem registros", async () => {
  api.listar.mockResolvedValue([]);

  render(
    <PaginaCrud configuracao={configuracao} />
  );

  expect(
    await screen.findByRole("heading", {
      name: "Nenhum registro cadastrado"
    })
  ).toBeInTheDocument();

  expect(api.listar).toHaveBeenCalledWith("maquinas");
  expect(api.listar).toHaveBeenCalledTimes(1);
});

test("apresenta os registros recebidos da API", async () => {
  api.listar.mockResolvedValue([
    {
      id: 1,
      nome: "Esteira de teste",
      status: "Em operacao"
    }
  ]);

  const configuracaoComColunas = {
    ...configuracao,
    colunas: [
      {
        chave: "nome",
        rotulo: "Nome"
      },
      {
        chave: "status",
        rotulo: "Status",
        etiqueta: true
      }
    ]
  };

  render(
    <PaginaCrud
      configuracao={configuracaoComColunas}
    />
  );

  expect(
    await screen.findByRole("cell", {
      name: "Esteira de teste"
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("cell", {
      name: "Em operacao"
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", {
      name: "Editar"
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", {
      name: "Excluir"
    })
  ).toBeInTheDocument();
});

test("filtra os registros pelo termo pesquisado", async () => {
  const usuario = userEvent.setup();

  api.listar.mockResolvedValue([
    {
      id: 1,
      nome: "Esteira industrial"
    },
    {
      id: 2,
      nome: "Prensa hidraulica"
    }
  ]);

  const configuracaoComColunas = {
    ...configuracao,
    colunas: [
      {
        chave: "nome",
        rotulo: "Nome"
      }
    ]
  };

  render(
    <PaginaCrud
      configuracao={configuracaoComColunas}
    />
  );

  expect(
    await screen.findByText("Esteira industrial")
  ).toBeInTheDocument();

  expect(
    screen.getByText("Prensa hidraulica")
  ).toBeInTheDocument();

  const campoPesquisa = screen.getByRole(
    "searchbox",
    {
      name: "Pesquisar nos registros"
    }
  );

  await usuario.type(campoPesquisa, "prensa");

  expect(
    screen.queryByText("Esteira industrial")
  ).not.toBeInTheDocument();

  expect(
    screen.getByText("Prensa hidraulica")
  ).toBeInTheDocument();
});