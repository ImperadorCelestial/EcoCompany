import test from "node:test";
import assert from "node:assert/strict";

import {
  riscoParaBanco,
  statusMaquinaParaBanco,
  statusOcorrenciaParaBanco
} from "../utilitarios/conversoes.js";

test("converte o status em operacao para o formato do banco", () => {
  const resultado = statusMaquinaParaBanco("Em operacao");

  assert.equal(resultado, "em_operacao");
});

test("converte o status em manutencao para o formato do banco", () => {
  const resultado = statusMaquinaParaBanco("Em manutencao");

  assert.equal(resultado, "em_manutencao");
});

test("converte o nivel de risco para o formato do banco", () => {
  const resultado = riscoParaBanco("critico");

  assert.equal(resultado, "critico");
});

test("converte o status da ocorrencia para o formato do banco", () => {
  const resultado = statusOcorrenciaParaBanco("Em analise");

  assert.equal(resultado, "em_analise");
});
