import { Router } from "express";
import banco from "../configuracao/banco.js";
import {
  idValido,
  numeroValido,
  registroNaoEncontrado,
  validarCampos
} from "../utilitarios/erros.js";
import {
  statusMaquinaParaBanco,
  statusMaquinaParaTela
} from "../utilitarios/conversoes.js";

const roteador = Router();

const consultaBase = `
  SELECT
    id,
    nome,
    setor,
    tipo,
    status,
    consumo_energia_kwh AS energia,
    temperatura_celsius AS temperatura,
    created_at AS criadoEm,
    updated_at AS atualizadoEm
  FROM maquinas
`;

function formatarMaquina(maquina) {
  return {
    ...maquina,
    status: statusMaquinaParaTela(maquina.status)
  };
}

async function buscarMaquina(id) {
  const [linhas] = await banco.query(
    `${consultaBase} WHERE id = ?`,
    [id]
  );
  return linhas[0] ? formatarMaquina(linhas[0]) : null;
}

roteador.get("/", async (_requisicao, resposta) => {
  const [linhas] = await banco.query(
    `${consultaBase} ORDER BY id DESC`
  );
  resposta.json(linhas.map(formatarMaquina));
});

roteador.post("/", async (requisicao, resposta) => {
  const dados = requisicao.body;
  validarCampos(dados, ["nome", "setor", "tipo"]);

  const energia = numeroValido(
    dados.energia ?? dados.consumoEnergia ?? 0,
    "Consumo de energia"
  );
  const temperatura =
    dados.temperatura === "" ||
    dados.temperatura === null ||
    dados.temperatura === undefined
      ? null
      : numeroValido(dados.temperatura, "Temperatura", -100);

  const [resultado] = await banco.execute(
    `INSERT INTO maquinas
      (nome, setor, tipo, status, consumo_energia_kwh, temperatura_celsius)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      dados.nome.trim(),
      dados.setor.trim(),
      dados.tipo.trim(),
      statusMaquinaParaBanco(dados.status),
      energia,
      temperatura
    ]
  );

  resposta
    .status(201)
    .json(await buscarMaquina(resultado.insertId));
});

roteador.put("/:id", async (requisicao, resposta) => {
  const id = idValido(requisicao.params.id);
  const dados = requisicao.body;
  validarCampos(dados, ["nome", "setor", "tipo", "status"]);

  const energia = numeroValido(
    dados.energia ?? dados.consumoEnergia ?? 0,
    "Consumo de energia"
  );
  const temperatura =
    dados.temperatura === "" ||
    dados.temperatura === null ||
    dados.temperatura === undefined
      ? null
      : numeroValido(dados.temperatura, "Temperatura", -100);

  const [resultado] = await banco.execute(
    `UPDATE maquinas
     SET nome = ?,
         setor = ?,
         tipo = ?,
         status = ?,
         consumo_energia_kwh = ?,
         temperatura_celsius = ?
     WHERE id = ?`,
    [
      dados.nome.trim(),
      dados.setor.trim(),
      dados.tipo.trim(),
      statusMaquinaParaBanco(dados.status),
      energia,
      temperatura,
      id
    ]
  );

  registroNaoEncontrado(resultado);
  resposta.json(await buscarMaquina(id));
});

roteador.delete("/:id", async (requisicao, resposta) => {
  const id = idValido(requisicao.params.id);
  const [resultado] = await banco.execute(
    "DELETE FROM maquinas WHERE id = ?",
    [id]
  );

  registroNaoEncontrado(resultado);
  resposta.status(204).send();
});

export default roteador;
