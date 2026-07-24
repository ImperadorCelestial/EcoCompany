import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import ModalRegistro from "./ModalRegistro.jsx";
import userEvent from "@testing-library/user-event";

test("monta os campos definidos na configuracao", () => {
  const configuracao = {
    campos: [
      {
        chave: "nome",
        rotulo: "Nome",
        tipo: "text"
      },
      {
        chave: "energia",
        rotulo: "Energia",
        tipo: "number"
      }
    ]
  };

  render(
    <ModalRegistro
      configuracao={configuracao}
      registro={null}
      aberto={false}
      aoFechar={vi.fn()}
      aoSalvar={vi.fn()}
      salvando={false}
    />
  );

  const campoNome = screen.getByLabelText("Nome");
  const campoEnergia = screen.getByLabelText("Energia");

  expect(campoNome).toBeInTheDocument();
  expect(campoNome).toHaveAttribute("type", "text");
  expect(campoNome).toBeRequired();

  expect(campoEnergia).toBeInTheDocument();
  expect(campoEnergia).toHaveAttribute("type", "number");
  expect(campoEnergia).toBeRequired();
});

test("permite configurar um campo como opcional", () => {
  const configuracao = {
    campos: [
      {
        chave: "observacao",
        rotulo: "Observacao",
        tipo: "textarea",
        obrigatorio: false
      }
    ]
  };

  render(
    <ModalRegistro
      configuracao={configuracao}
      registro={null}
      aberto={false}
      aoFechar={vi.fn()}
      aoSalvar={vi.fn()}
      salvando={false}
    />
  );

  const campoObservacao =
    screen.getByLabelText("Observacao");

  expect(campoObservacao).toBeInTheDocument();
  expect(campoObservacao).not.toBeRequired();
});

test("monta um campo de selecao com suas opcoes", () => {
  const configuracao = {
    campos: [
      {
        chave: "status",
        rotulo: "Status",
        tipo: "select",
        opcoes: [
          "Em operacao",
          "Em manutencao",
          "Parada"
        ]
      }
    ]
  };

  render(
    <ModalRegistro
      configuracao={configuracao}
      registro={null}
      aberto={false}
      aoFechar={vi.fn()}
      aoSalvar={vi.fn()}
      salvando={false}
    />
  );

  const campoStatus = screen.getByLabelText("Status");

  expect(campoStatus).toBeInTheDocument();
  expect(campoStatus).toHaveValue("");

  const opcoes = Array.from(campoStatus.options).map(
    (opcao) => opcao.textContent
  );

  expect(opcoes).toEqual([
    "Selecione",
    "Em operacao",
    "Em manutencao",
    "Parada"
  ]);
});

test("envia os dados preenchidos no formulario", async () => {
  const usuario = userEvent.setup();
  const aoSalvar = vi.fn();

  const configuracao = {
    campos: [
      {
        chave: "nome",
        rotulo: "Nome",
        tipo: "text"
      },
      {
        chave: "energia",
        rotulo: "Energia",
        tipo: "number"
      }
    ]
  };

  render(
    <ModalRegistro
      configuracao={configuracao}
      registro={null}
      aberto={true}
      aoFechar={vi.fn()}
      aoSalvar={aoSalvar}
      salvando={false}
    />
  );

  await usuario.type(
    screen.getByLabelText("Nome"),
    "Esteira de teste"
  );

  await usuario.type(
    screen.getByLabelText("Energia"),
    "25"
  );

  await usuario.click(
    screen.getByRole("button", {
      name: "Salvar registro"
    })
  );

  expect(aoSalvar).toHaveBeenCalledTimes(1);

  expect(aoSalvar).toHaveBeenCalledWith({
    nome: "Esteira de teste",
    energia: 25
  });
});

test("preenche os campos ao editar um registro", () => {
  const configuracao = {
    campos: [
      {
        chave: "nome",
        rotulo: "Nome",
        tipo: "text"
      },
      {
        chave: "energia",
        rotulo: "Energia",
        tipo: "number"
      }
    ]
  };

  render(
    <ModalRegistro
      configuracao={configuracao}
      registro={{
        id: 10,
        nome: "Prensa hidraulica",
        energia: 42
      }}
      aberto={true}
      aoFechar={vi.fn()}
      aoSalvar={vi.fn()}
      salvando={false}
    />
  );

  expect(
    screen.getByRole("heading", {
      name: "Editar registro"
    })
  ).toBeInTheDocument();

  expect(
    screen.getByLabelText("Nome")
  ).toHaveValue("Prensa hidraulica");

  expect(
    screen.getByLabelText("Energia")
  ).toHaveValue(42);
});

test("fecha o modal ao clicar em cancelar", async () => {
  const usuario = userEvent.setup();
  const aoFechar = vi.fn();

  const configuracao = {
    campos: [
      {
        chave: "nome",
        rotulo: "Nome",
        tipo: "text"
      }
    ]
  };

  render(
    <ModalRegistro
      configuracao={configuracao}
      registro={null}
      aberto={true}
      aoFechar={aoFechar}
      aoSalvar={vi.fn()}
      salvando={false}
    />
  );

  await usuario.click(
    screen.getByRole("button", {
      name: "Cancelar"
    })
  );

  expect(aoFechar).toHaveBeenCalledTimes(1);
});

test("desabilita o botao enquanto esta salvando", () => {
  const configuracao = {
    campos: [
      {
        chave: "nome",
        rotulo: "Nome",
        tipo: "text"
      }
    ]
  };

  render(
    <ModalRegistro
      configuracao={configuracao}
      registro={null}
      aberto={true}
      aoFechar={vi.fn()}
      aoSalvar={vi.fn()}
      salvando={true}
    />
  );

  const botaoSalvar = screen.getByRole("button", {
    name: /Salvando/
  });

  expect(botaoSalvar).toBeDisabled();
});