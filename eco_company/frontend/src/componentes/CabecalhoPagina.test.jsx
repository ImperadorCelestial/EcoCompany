import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import CabecalhoPagina from "./CabecalhoPagina.jsx";
import userEvent from "@testing-library/user-event";

test("apresenta o titulo e o subtitulo da pagina", () => {
  render(
    <CabecalhoPagina
      titulo="Maquinas"
      subtitulo="Lista de equipamentos"
    />
  );

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Maquinas"
    })
  ).toBeInTheDocument();

  expect(
    screen.getByText("Lista de equipamentos")
  ).toBeInTheDocument();
});

test("executa a acao ao clicar no botao", async () => {
  const usuario = userEvent.setup();
  const aoClicar = vi.fn();

  render(
    <CabecalhoPagina
      titulo="Maquinas"
      subtitulo="Lista de equipamentos"
      acao={
        <button type="button" onClick={aoClicar}>
          Novo registro
        </button>
      }
    />
  );

  const botao = screen.getByRole("button", {
    name: "Novo registro"
  });

  expect(botao).toBeInTheDocument();

  await usuario.click(botao);

  expect(aoClicar).toHaveBeenCalledTimes(1);
});