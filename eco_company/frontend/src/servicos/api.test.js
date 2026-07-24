import {
  afterEach,
  expect,
  test,
  vi
} from "vitest";

import { api } from "./api.js";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test("lista os registros recebidos do backend", async () => {
  const maquinas = [
    {
      id: 1,
      nome: "Esteira de teste"
    },
    {
      id: 2,
      nome: "Prensa de teste"
    }
  ];

  const respostaSimulada = {
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue(maquinas)
  };

  const fetchSimulado = vi
    .fn()
    .mockResolvedValue(respostaSimulada);

  vi.stubGlobal("fetch", fetchSimulado);

  const resultado = await api.listar("maquinas");

  expect(resultado).toEqual(maquinas);

  expect(fetchSimulado).toHaveBeenCalledWith(
    `${api.urlBase}/api/maquinas`,
    expect.objectContaining({
      headers: expect.objectContaining({
        Accept: "application/json"
      }),
      signal: expect.any(AbortSignal)
    })
  );
});

test("envia um novo registro para o backend", async () => {
  const novaMaquina = {
    nome: "Esteira de teste",
    setor: "Montagem",
    tipo: "Esteira",
    energia: 25
  };

  const maquinaCriada = {
    id: 10,
    ...novaMaquina
  };

  const respostaSimulada = {
    ok: true,
    status: 201,
    json: vi.fn().mockResolvedValue(maquinaCriada)
  };

  const fetchSimulado = vi
    .fn()
    .mockResolvedValue(respostaSimulada);

  vi.stubGlobal("fetch", fetchSimulado);

  const resultado = await api.criar(
    "maquinas",
    novaMaquina
  );

  expect(resultado).toEqual(maquinaCriada);

  expect(fetchSimulado).toHaveBeenCalledWith(
    `${api.urlBase}/api/maquinas`,
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify(novaMaquina),
      headers: expect.objectContaining({
        Accept: "application/json",
        "Content-Type": "application/json"
      })
    })
  );
});

test("envia a atualizacao de um registro", async () => {
  const dadosAtualizados = {
    nome: "Esteira atualizada",
    setor: "Expedicao",
    tipo: "Esteira",
    energia: 30
  };

  const registroAtualizado = {
    id: 10,
    ...dadosAtualizados
  };

  const respostaSimulada = {
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue(registroAtualizado)
  };

  const fetchSimulado = vi
    .fn()
    .mockResolvedValue(respostaSimulada);

  vi.stubGlobal("fetch", fetchSimulado);

  const resultado = await api.atualizar(
    "maquinas",
    10,
    dadosAtualizados
  );

  expect(resultado).toEqual(registroAtualizado);

  expect(fetchSimulado).toHaveBeenCalledWith(
    `${api.urlBase}/api/maquinas/10`,
    expect.objectContaining({
      method: "PUT",
      body: JSON.stringify(dadosAtualizados),
      headers: expect.objectContaining({
        Accept: "application/json",
        "Content-Type": "application/json"
      })
    })
  );
});

test("remove um registro do backend", async () => {
  const respostaSimulada = {
    ok: true,
    status: 204
  };

  const fetchSimulado = vi
    .fn()
    .mockResolvedValue(respostaSimulada);

  vi.stubGlobal("fetch", fetchSimulado);

  const resultado = await api.remover(
    "maquinas",
    10
  );

  expect(resultado).toBeNull();

  expect(fetchSimulado).toHaveBeenCalledWith(
    `${api.urlBase}/api/maquinas/10`,
    expect.objectContaining({
      method: "DELETE",
      headers: expect.objectContaining({
        Accept: "application/json"
      })
    })
  );
});