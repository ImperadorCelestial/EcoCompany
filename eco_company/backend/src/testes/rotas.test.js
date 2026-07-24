import test, { after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import aplicacao from "../aplicacao.js";

import banco from "../configuracao/banco.js";

test("GET / apresenta as informacoes da API", async () => {
  const resposta = await request(aplicacao).get("/");

  assert.equal(resposta.status, 200);

  assert.deepEqual(resposta.body, {
    nome: "EcoCompany API",
    versao: "1.0.0"
  });
});

test("retorna 404 quando a rota nao existe", async () => {
  const resposta = await request(aplicacao).get(
    "/rota-que-nao-existe"
  );

  assert.equal(resposta.status, 404);

  assert.deepEqual(resposta.body, {
    mensagem: "Rota não encontrada."
  });
});

test("POST /api/maquinas rejeita dados incompletos", async () => {
  const resposta = await request(aplicacao)
    .post("/api/maquinas")
    .send({
      nome: ""
    });

  assert.equal(resposta.status, 400);
  assert.equal(typeof resposta.body.mensagem, "string");

  assert.match(resposta.body.mensagem, /nome/);
  assert.match(resposta.body.mensagem, /setor/);
  assert.match(resposta.body.mensagem, /tipo/);
});

test("DELETE /api/maquinas rejeita identificador invalido", async () => {
  const resposta = await request(aplicacao)
    .delete("/api/maquinas/abc");

  assert.equal(resposta.status, 400);
  assert.equal(typeof resposta.body.mensagem, "string");
  assert.match(resposta.body.mensagem, /Identificador/);
});

test("POST /api/maquinas rejeita energia negativa", async () => {
  const resposta = await request(aplicacao)
    .post("/api/maquinas")
    .send({
      nome: "Esteira de teste",
      setor: "Montagem",
      tipo: "Esteira",
      energia: -10
    });

  assert.equal(resposta.status, 400);
  assert.equal(typeof resposta.body.mensagem, "string");
  assert.match(resposta.body.mensagem, /Consumo de energia/);
});

test("POST /api/maquinas rejeita status invalido", async () => {
  const resposta = await request(aplicacao)
    .post("/api/maquinas")
    .send({
      nome: "Prensa de teste",
      setor: "Conformacao",
      tipo: "Prensa",
      status: "Voando",
      energia: 20
    });

  assert.equal(resposta.status, 400);
  assert.equal(typeof resposta.body.mensagem, "string");
  assert.match(resposta.body.mensagem, /Status/);
});

test("GET /health confirma a conexao com o MySQL", async () => {
  const resposta = await request(aplicacao).get("/health");

  assert.equal(
    resposta.status,
    200,
    `Resposta recebida: ${JSON.stringify(resposta.body)}`
  );

  assert.deepEqual(resposta.body, {
    conectado: true,
    banco: "MySQL"
  });
});

after(async () => {
  await banco.end();
});

test("POST /api/producoes rejeita dados incompletos", async () => {
  const resposta = await request(aplicacao)
    .post("/api/producoes")
    .send({
      produto: "Peca de teste"
    });

  assert.equal(resposta.status, 400);
  assert.equal(typeof resposta.body.mensagem, "string");
  assert.match(resposta.body.mensagem, /produzido/);
  assert.match(resposta.body.mensagem, /esperado/);
});

test("POST /api/producoes exige uma maquina", async () => {
  const resposta = await request(aplicacao)
    .post("/api/producoes")
    .send({
      produto: "Peca de teste",
      produzido: 80,
      esperado: 100
    });

  assert.equal(resposta.status, 400);
  assert.equal(typeof resposta.body.mensagem, "string");
  assert.match(resposta.body.mensagem, /Informe/);
});

test("POST /api/sustentabilidade rejeita reciclagem maior que residuos", async () => {
  const resposta = await request(aplicacao)
    .post("/api/sustentabilidade")
    .send({
      energia: 100,
      agua: 200,
      residuos: 50,
      reciclado: 80
    });

  assert.equal(resposta.status, 400);
  assert.equal(typeof resposta.body.mensagem, "string");
  assert.match(resposta.body.mensagem, /superar/);
});

test("POST /api/sustentabilidade rejeita energia negativa", async () => {
  const resposta = await request(aplicacao)
    .post("/api/sustentabilidade")
    .send({
      energia: -10,
      agua: 200,
      residuos: 50,
      reciclado: 20
    });

  assert.equal(resposta.status, 400);
  assert.equal(typeof resposta.body.mensagem, "string");
  assert.match(resposta.body.mensagem, /Energia consumida/);
});

test("POST /api/seguranca rejeita dados incompletos", async () => {
  const resposta = await request(aplicacao)
    .post("/api/seguranca")
    .send({
      tipo: "Quase acidente"
    });

  assert.equal(resposta.status, 400);
  assert.equal(typeof resposta.body.mensagem, "string");

  assert.match(resposta.body.mensagem, /descricao/);
  assert.match(resposta.body.mensagem, /risco/);
  assert.match(resposta.body.mensagem, /local/);
  assert.match(resposta.body.mensagem, /status/);
});

test("POST /api/seguranca rejeita nivel de risco invalido", async () => {
  const resposta = await request(aplicacao)
    .post("/api/seguranca")
    .send({
      tipo: "Quase acidente",
      descricao: "Objeto encontrado no corredor",
      risco: "Extremo",
      local: "Montagem",
      status: "Aberta"
    });

  assert.equal(resposta.status, 400);
  assert.equal(typeof resposta.body.mensagem, "string");
  assert.match(resposta.body.mensagem, /risco/);
});