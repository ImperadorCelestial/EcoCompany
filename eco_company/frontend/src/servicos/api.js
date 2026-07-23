const URL_BASE_API = (
  window.localStorage.getItem("ecocompany_api_url") ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const TEMPO_LIMITE_REQUISICAO = 6000;

function emitirEstadoConexao(conectado) {
  window.dispatchEvent(new CustomEvent("ecocompany:conexao", {
    detail: { conectado }
  }));
}

async function fazerRequisicao(caminho, opcoes = {}) {
  const controlador = new AbortController();
  const temporizador = window.setTimeout(
    () => controlador.abort(),
    TEMPO_LIMITE_REQUISICAO
  );
  const cabecalhos = {
    Accept: "application/json",
    ...opcoes.headers
  };

  if (opcoes.body && !(opcoes.body instanceof FormData)) {
    cabecalhos["Content-Type"] = "application/json";
  }

  try {
    const resposta = await fetch(`${URL_BASE_API}${caminho}`, {
      ...opcoes,
      headers: cabecalhos,
      signal: controlador.signal
    });

    if (!resposta.ok) {
      const dadosErro = await resposta.json().catch(() => ({}));
      throw new Error(
        dadosErro.message ||
        dadosErro.error ||
        `Erro ${resposta.status} ao acessar o servidor.`
      );
    }

    emitirEstadoConexao(true);
    if (resposta.status === 204) return null;
    return resposta.json().catch(() => null);
  } catch (erro) {
    if (erro.name === "AbortError" || erro instanceof TypeError) {
      emitirEstadoConexao(false);
    }
    throw erro;
  } finally {
    window.clearTimeout(temporizador);
  }
}

function transformarEmLista(dados) {
  if (Array.isArray(dados)) return dados;
  if (!dados || typeof dados !== "object") return [];

  return [
    dados.data,
    dados.records,
    dados.items,
    dados.content,
    dados.result
  ].find(Array.isArray) || [];
}

export const api = {
  urlBase: URL_BASE_API,

  async verificarConexao() {
    try {
      await fazerRequisicao("/health");
      return true;
    } catch {
      emitirEstadoConexao(false);
      return false;
    }
  },

  async listar(recurso) {
    return transformarEmLista(
      await fazerRequisicao(`/api/${recurso}`)
    );
  },

  criar(recurso, dados) {
    return fazerRequisicao(`/api/${recurso}`, {
      method: "POST",
      body: JSON.stringify(dados)
    });
  },

  atualizar(recurso, id, dados) {
    return fazerRequisicao(
      `/api/${recurso}/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(dados)
      }
    );
  },

  remover(recurso, id) {
    return fazerRequisicao(
      `/api/${recurso}/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );
  }
};
