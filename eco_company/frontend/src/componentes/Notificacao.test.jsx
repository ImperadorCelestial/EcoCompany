import { act, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import Notificacao from "./Notificacao.jsx";

afterEach(() => {
  vi.useRealTimers();
});

test("apresenta a mensagem da notificacao", () => {
  const aoFechar = vi.fn();

  render(
    <Notificacao
      notificacao={{
        tipo: "sucesso",
        mensagem: "Registro salvo com sucesso"
      }}
      aoFechar={aoFechar}
    />
  );

  const mensagem = screen.getByRole("status");

  expect(mensagem).toBeInTheDocument();
  expect(mensagem).toHaveTextContent(
    "Registro salvo com sucesso"
  );
});

test("nao apresenta mensagem quando nao existe notificacao", () => {
  const aoFechar = vi.fn();

  render(
    <Notificacao
      notificacao={null}
      aoFechar={aoFechar}
    />
  );

  expect(
    screen.queryByRole("status")
  ).not.toBeInTheDocument();
});

test("fecha automaticamente depois do tempo configurado", () => {
  vi.useFakeTimers();

  const aoFechar = vi.fn();

  render(
    <Notificacao
      notificacao={{
        tipo: "sucesso",
        mensagem: "Registro salvo"
      }}
      aoFechar={aoFechar}
    />
  );

  expect(aoFechar).not.toHaveBeenCalled();

  act(() => {
    vi.advanceTimersByTime(4200);
  });

  expect(aoFechar).toHaveBeenCalledTimes(1);
});