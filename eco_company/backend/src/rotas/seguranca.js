import { Router } from "express";
import banco from "../configuracao/banco.js";
import {
  idValido,
  registroNaoEncontrado,
  validarCampos
} from "../utilitarios/erros.js";
import {
  riscoParaBanco,
  riscoParaTela,
  statusOcorrenciaParaBanco,
  statusOcorrenciaParaTela
} from "../utilitarios/conversoes.js";

const roteador = Router();

const consultaBase = `
  SELECT
    id,
    tipo,
    descricao,
    nivel_risco AS risco,
    local,
    status,
    data_hora AS data,
    medida_preventiva AS medidaPreventiva,
    created_at AS criadoEm,
    updated_at AS atualizadoEm
  FROM ocorrencias
`;

function formatarOcorrencia(ocorrencia) {
  return {
    ...ocorrencia,
    risco: riscoParaTela(ocorrencia.risco),
    status: statusOcorrenciaParaTela(ocorrencia.status)
  };
}

async function buscarOcorrencia(id) {
  const [linhas] = await banco.query(
    `${consultaBase} WHERE id = ?`,
    [id]
  );
  return linhas[0] ? formatarOcorrencia(linhas[0]) : null;
}

roteador.get("/", async (_requisicao, resposta) => {
  const [linhas] = await banco.query(
    `${consultaBase} ORDER BY data_hora DESC, id DESC`
  );
  resposta.json(linhas.map(formatarOcorrencia));
});

roteador.post("/", async (requisicao, resposta) => {
  const dados = requisicao.body;
  validarCampos(
    dados,
    ["tipo", "descricao", "risco", "local", "status"]
  );

  const [resultado] = await banco.execute(
    `INSERT INTO ocorrencias
      (
        tipo,
        descricao,
        nivel_risco,
        local,
        status,
        data_hora,
        medida_preventiva
      )
     VALUES (?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP(6)), ?)`,
    [
      dados.tipo.trim(),
      dados.descricao.trim(),
      riscoParaBanco(dados.risco),
      dados.local.trim(),
      statusOcorrenciaParaBanco(dados.status),
      dados.data || dados.dataHora || null,
      dados.medidaPreventiva || null
    ]
  );

  resposta
    .status(201)
    .json(await buscarOcorrencia(resultado.insertId));
});

roteador.put("/:id", async (requisicao, resposta) => {
  const id = idValido(requisicao.params.id);
  const dados = requisicao.body;
  validarCampos(
    dados,
    ["tipo", "descricao", "risco", "local", "status"]
  );

  const [resultado] = await banco.execute(
    `UPDATE ocorrencias
     SET tipo = ?,
         descricao = ?,
         nivel_risco = ?,
         local = ?,
         status = ?,
         data_hora = COALESCE(?, data_hora),
         medida_preventiva = ?
     WHERE id = ?`,
    [
      dados.tipo.trim(),
      dados.descricao.trim(),
      riscoParaBanco(dados.risco),
      dados.local.trim(),
      statusOcorrenciaParaBanco(dados.status),
      dados.data || dados.dataHora || null,
      dados.medidaPreventiva || null,
      id
    ]
  );

  registroNaoEncontrado(resultado);
  resposta.json(await buscarOcorrencia(id));
});

roteador.delete("/:id", async (requisicao, resposta) => {
  const id = idValido(requisicao.params.id);
  const [resultado] = await banco.execute(
    "DELETE FROM ocorrencias WHERE id = ?",
    [id]
  );

  registroNaoEncontrado(resultado);
  resposta.status(204).send();
});

export default roteador;
