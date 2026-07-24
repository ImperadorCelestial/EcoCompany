import { Router } from "express";
import banco from "../configuracao/banco.js";
import {
  ErroHttp,
  idValido,
  numeroValido,
  registroNaoEncontrado
} from "../utilitarios/erros.js";

const roteador = Router();

const consultaBase = `
  SELECT
    id,
    consumo_energia_kwh AS energia,
    consumo_agua_litros AS agua,
    residuos_kg AS residuos,
    quantidade_reciclada_kg AS reciclado,
    data_hora AS data,
    created_at AS criadoEm,
    updated_at AS atualizadoEm
  FROM sustentabilidade
`;

function formatarRegistro(registro) {
  const taxa = registro.residuos
    ? Number(
        (
          (registro.reciclado / registro.residuos) *
          100
        ).toFixed(2)
      )
    : 0;

  return { ...registro, taxa };
}

async function buscarRegistro(id) {
  const [linhas] = await banco.query(
    `${consultaBase} WHERE id = ?`,
    [id]
  );
  return linhas[0] ? formatarRegistro(linhas[0]) : null;
}

function lerValores(dados) {
  const energia = numeroValido(
    dados.energia ?? dados.energiaConsumida ?? 0,
    "Energia consumida"
  );
  const agua = numeroValido(
    dados.agua ?? dados.aguaConsumida ?? 0,
    "Água consumida"
  );
  const residuos = numeroValido(
    dados.residuos ?? dados.residuosGerados ?? 0,
    "Resíduos gerados"
  );
  const reciclado = numeroValido(
    dados.reciclado ?? dados.residuosReciclados ?? 0,
    "Resíduos reciclados"
  );

  if (reciclado > residuos) {
    throw new ErroHttp(
      400,
      "A quantidade reciclada não pode superar os resíduos gerados."
    );
  }

  return { energia, agua, residuos, reciclado };
}

roteador.get("/", async (_requisicao, resposta) => {
  const [linhas] = await banco.query(
    `${consultaBase} ORDER BY data_hora DESC, id DESC`
  );
  resposta.json(linhas.map(formatarRegistro));
});

roteador.post("/", async (requisicao, resposta) => {
  const dados = requisicao.body;
  const valores = lerValores(dados);

  const [resultado] = await banco.execute(
    `INSERT INTO sustentabilidade
      (
        consumo_energia_kwh,
        consumo_agua_litros,
        residuos_kg,
        quantidade_reciclada_kg,
        data_hora
      )
     VALUES (?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP(6)))`,
    [
      valores.energia,
      valores.agua,
      valores.residuos,
      valores.reciclado,
      dados.data || dados.dataHora || null
    ]
  );

  resposta
    .status(201)
    .json(await buscarRegistro(resultado.insertId));
});

roteador.put("/:id", async (requisicao, resposta) => {
  const id = idValido(requisicao.params.id);
  const dados = requisicao.body;
  const valores = lerValores(dados);

  const [resultado] = await banco.execute(
    `UPDATE sustentabilidade
     SET consumo_energia_kwh = ?,
         consumo_agua_litros = ?,
         residuos_kg = ?,
         quantidade_reciclada_kg = ?,
         data_hora = COALESCE(?, data_hora)
     WHERE id = ?`,
    [
      valores.energia,
      valores.agua,
      valores.residuos,
      valores.reciclado,
      dados.data || dados.dataHora || null,
      id
    ]
  );

  registroNaoEncontrado(resultado);
  resposta.json(await buscarRegistro(id));
});

roteador.delete("/:id", async (requisicao, resposta) => {
  const id = idValido(requisicao.params.id);
  const [resultado] = await banco.execute(
    "DELETE FROM sustentabilidade WHERE id = ?",
    [id]
  );

  registroNaoEncontrado(resultado);
  resposta.status(204).send();
});

export default roteador;
