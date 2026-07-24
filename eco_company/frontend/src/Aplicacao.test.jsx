import {
  render,
  screen
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import {
  beforeEach,
  expect,
  test,
  vi
} from "vitest";

import { api } from "./servicos/api.js";
import Aplicacao from "./Aplicacao.jsx";

vi.mock("./servicos/api.js", () => ({
  api: {
    urlBase: "http://localhost:3000",
    verificarConexao: vi.fn(),
    listar: vi.fn(),
    criar: vi.fn(),
    atualizar: vi.fn(),
    remover: vi.fn()
  }
}));

beforeEach(() => {
  vi.clearAllMocks();
  api.verificarConexao.mockResolvedValue(true);
  api.listar.mockResolvedValue([]);
});

test("navega para sustentabilidade pelo menu", async () => {
  const usuario = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/maquinas"]}>
      <Aplicacao />
    </MemoryRouter>
  );

  const linkSustentabilidade =
    screen.getByRole("link", {
      name: "Sustentabilidade"
    });

  await usuario.click(linkSustentabilidade);

  expect(
    await screen.findByRole("heading", {
      level: 1,
      name: "Sustentabilidade"
    })
  ).toBeInTheDocument();

  expect(api.listar).toHaveBeenCalledWith(
    "sustentabilidade"
  );
});