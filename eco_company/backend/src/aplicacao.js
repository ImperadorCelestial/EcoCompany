import "dotenv/config";
import express from "express";
import cors from "cors";

import { verificarBanco } from "./configuracao/banco.js";
import rotasMaquinas from "./rotas/maquinas.js";
import rotasProducoes from "./rotas/producoes.js";
import rotasSustentabilidade from "./rotas/sustentabilidade.js";
import rotasSeguranca from "./rotas/seguranca.js";

const aplicacao = express();
const origemFrontend =
  process.env.FRONTEND_URL || "http://localhost:5173";

aplicacao.disable("x-powered-by");
aplicacao.use(cors({ origin: origemFrontend }));
aplicacao.use(express.json({ limit: "1mb" }));

aplicacao.get("/", (_requisicao, resposta) => {
  resposta.json({
    nome: "EcoCompany API",
    versao: "1.0.0"
  });
});

aplicacao.get("/health", async (_requisicao, resposta) => {
  try {
    await verificarBanco();
    resposta.json({
      conectado: true,
      banco: "MySQL"
    });
  } catch {
    resposta.status(503).json({
      conectado: false,
      mensagem: "Banco de dados indisponível."
    });
  }
});

aplicacao.use("/api/maquinas", rotasMaquinas);
aplicacao.use("/api/producoes", rotasProducoes);
aplicacao.use(
  "/api/sustentabilidade",
  rotasSustentabilidade
);
aplicacao.use("/api/seguranca", rotasSeguranca);

aplicacao.use((_requisicao, resposta) => {
  resposta.status(404).json({
    mensagem: "Rota não encontrada."
  });
});

aplicacao.use((erro, _requisicao, resposta, _proximo) => {
  let status = erro.status || 500;
  let mensagem = erro.message || "Erro interno do servidor.";

  if (erro.code === "ER_ROW_IS_REFERENCED_2") {
    status = 409;
    mensagem =
      "O registro não pode ser excluído porque está em uso.";
  }

  if (erro.code === "ER_NO_REFERENCED_ROW_2") {
    status = 400;
    mensagem = "O registro relacionado não existe.";
  }

  if (
    erro.code === "ER_CHECK_CONSTRAINT_VIOLATED" ||
    erro.code === "ER_TRUNCATED_WRONG_VALUE" ||
    erro.code === "ER_DATA_TOO_LONG"
  ) {
    status = 400;
    mensagem = "Os dados informados são inválidos.";
  }

  if (
    erro.code === "ECONNREFUSED" ||
    erro.code === "ER_ACCESS_DENIED_ERROR" ||
    erro.code === "ER_BAD_DB_ERROR"
  ) {
    status = 503;
    mensagem = "Não foi possível conectar ao banco de dados.";
  }

  if (status >= 500) {
    console.error(erro);
  }

  resposta.status(status).json({ mensagem });
});

export default aplicacao;
