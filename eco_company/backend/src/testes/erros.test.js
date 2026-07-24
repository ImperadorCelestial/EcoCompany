import test from "node:test";
import assert from "node:assert/strict";

import {
  idValido,
  numeroValido,
  validarCampos
} from "../utilitarios/erros.js";

test("aceita e converte um identificador valido", () => {
  const resultado = idValido("5");

  assert.equal(resultado, 5);
});

test("rejeita um identificador invalido", () => {
  assert.throws(
    () => idValido(0),
    (erro) => erro.status === 400
  );
});

test("aceita e converte um numero valido", () => {
  const resultado = numeroValido("15.5", "Consumo");

  assert.equal(resultado, 15.5);
});

test("detecta campos obrigatorios ausentes", () => {
  assert.throws(
    () => validarCampos(
      { nome: "", setor: "Montagem" },
      ["nome", "setor", "tipo"]
    ),
    (erro) => {
      return (
        erro.status === 400 &&
        erro.message.includes("nome") &&
        erro.message.includes("tipo")
      );
    }
  );
});