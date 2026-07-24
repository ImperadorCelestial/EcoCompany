import { Router } from "express";
import banco from "../configuracao/banco.js";
import {
  ErroHttp,
  idValido,
  numeroValido,
  registroNaoEncontrado,
  validarCampos
} from "../utilitarios/erros.js";

const roteador = Router();

const consultaBase = `
  SELECT
    p.id,
    p.produto,
    p.quantidade_produzida AS produzido,
    p.quantidade_esperada AS esperado,
    p.data_hora AS data,
    p.maquina_id AS maquinaId,
    m.nome AS maquina,
    p.created_at AS criadoEm,
    p.updated_at AS atualizadoEm
  FROM producoes p
  INNER JOIN maquinas m ON m.id = p.maquina_id
`;

function formatarProducao(producao) {
  const produtividade = producao.esperado
    ? Number(
        (
          (producao.produzido / producao.esperado) *
          100
        ).toFixed(2)
      )
    : 0;

  return { ...producao, produtividade };
}

async function buscarProducao(id) {
  const [linhas] = await banco.query(
    `${consultaBase} WHERE p.id = ?`,
    [id]
  );
  return linhas[0] ? formatarProducao(linhas[0]) : null;
}

async function resolverMaquina(referencia) {
  if (
    referencia === undefined ||
    referencia === null ||
    referencia === ""
  ) {
    throw new ErroHttp(400, "Informe a máquina.");
  }

  const numero = Number(referencia);
  const consulta = Number.isInteger(numero) && numero > 0
    ? ["SELECT id FROM maquinas WHERE id = ? LIMIT 1", numero]
    : ["SELECT id FROM maquinas WHERE nome = ? LIMIT 1", referencia];

  const [linhas] = await banco.query(consulta[0], [consulta[1]]);

  if (!linhas.length) {
    throw new ErroHttp(400, "Máquina não encontrada.");
  }

  return linhas[0].id;
}

roteador.get("/", async (_requisicao, resposta) => {
  const [linhas] = await banco.query(
    `${consultaBase} ORDER BY p.data_hora DESC, p.id DESC`
  );
  resposta.json(linhas.map(formatarProducao));
});

roteador.post("/", async (requisicao, resposta) => {
  const dados = requisicao.body;
  validarCampos(dados, ["produto", "produzido", "esperado"]);

  const maquinaId = await resolverMaquina(
    dados.maquinaId ?? dados.maquina
  );
  const produzido = numeroValido(
    dados.produzido,
    "Quantidade produzida"
  );
  const esperado = numeroValido(
    dados.esperado,
    "Quantidade esperada",
    0.01
  );

  const [resultado] = await banco.execute(
    `INSERT INTO producoes
      (produto, quantidade_produzida, quantidade_esperada, data_hora, maquina_id)
     VALUES (?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP(6)), ?)`,
    [
      dados.produto.trim(),
      produzido,
      esperado,
      dados.data || dados.dataHora || null,
      maquinaId
    ]
  );

  resposta
    .status(201)
    .json(await buscarProducao(resultado.insertId));
});

roteador.put("/:id", async (requisicao, resposta) => {
  const id = idValido(requisicao.params.id);
  const dados = requisicao.body;
  validarCampos(dados, ["produto", "produzido", "esperado"]);

  const maquinaId = await resolverMaquina(
    dados.maquinaId ?? dados.maquina
  );

  const [resultado] = await banco.execute(
    `UPDATE producoes
     SET produto = ?,
         quantidade_produzida = ?,
         quantidade_esperada = ?,
         data_hora = COALESCE(?, data_hora),
         maquina_id = ?
     WHERE id = ?`,
    [
      dados.produto.trim(),
      numeroValido(dados.produzido, "Quantidade produzida"),
      numeroValido(
        dados.esperado,
        "Quantidade esperada",
        0.01
      ),
      dados.data || dados.dataHora || null,
      maquinaId,
      id
    ]
  );

  registroNaoEncontrado(resultado);
  resposta.json(await buscarProducao(id));
});

roteador.delete("/:id", async (requisicao, resposta) => {
  const id = idValido(requisicao.params.id);
  const [resultado] = await banco.execute(
    "DELETE FROM producoes WHERE id = ?",
    [id]
  );

  registroNaoEncontrado(resultado);
  resposta.status(204).send();
});

export default roteador;
