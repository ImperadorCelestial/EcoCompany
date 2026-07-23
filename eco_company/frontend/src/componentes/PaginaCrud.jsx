import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import CabecalhoPagina from "./CabecalhoPagina";
import ModalRegistro from "./ModalRegistro";
import Notificacao from "./Notificacao";
import { api } from "../servicos/api";

export default function PaginaCrud({ configuracao }) {
  const [registros, definirRegistros] = useState([]);
  const [busca, definirBusca] = useState("");
  const [carregando, definirCarregando] = useState(true);
  const [salvando, definirSalvando] = useState(false);
  const [modalAberto, definirModalAberto] = useState(false);
  const [registroEmEdicao, definirRegistroEmEdicao] =
    useState(null);
  const [notificacao, definirNotificacao] = useState(null);

  const carregarRegistros = useCallback(
    async (notificar = false) => {
      definirCarregando(true);

      try {
        definirRegistros(
          await api.listar(configuracao.recurso)
        );

        if (notificar) {
          definirNotificacao({
            mensagem: "Registros atualizados."
          });
        }
      } catch {
        definirRegistros([]);

        if (notificar) {
          definirNotificacao({
            mensagem: "Não foi possível consultar o backend.",
            tipo: "erro"
          });
        }
      } finally {
        definirCarregando(false);
      }
    },
    [configuracao.recurso]
  );

  useEffect(() => {
    definirBusca("");
    carregarRegistros();
  }, [carregarRegistros]);

  const registrosFiltrados = useMemo(() => {
    const termo = busca
      .trim()
      .toLocaleLowerCase("pt-BR");

    if (!termo) return registros;

    return registros.filter((registro) =>
      JSON.stringify(registro)
        .toLocaleLowerCase("pt-BR")
        .includes(termo)
    );
  }, [registros, busca]);

  function abrirNovoRegistro() {
    definirRegistroEmEdicao(null);
    definirModalAberto(true);
  }

  async function salvarRegistro(dados) {
    definirSalvando(true);

    try {
      const id = registroEmEdicao &&
        obterId(registroEmEdicao);

      if (id !== null && id !== undefined) {
        await api.atualizar(
          configuracao.recurso,
          id,
          dados
        );
      } else {
        await api.criar(configuracao.recurso, dados);
      }

      definirModalAberto(false);
      definirNotificacao({
        mensagem: registroEmEdicao
          ? "Registro atualizado."
          : "Registro adicionado."
      });
      await carregarRegistros();
    } catch (erro) {
      definirNotificacao({
        mensagem:
          erro.message ||
          "Não foi possível salvar o registro.",
        tipo: "erro"
      });
    } finally {
      definirSalvando(false);
    }
  }

  async function excluirRegistro(registro) {
    const confirmou = window.confirm(
      "Deseja realmente excluir este registro?"
    );
    if (!confirmou) return;

    try {
      await api.remover(
        configuracao.recurso,
        obterId(registro)
      );
      definirNotificacao({
        mensagem: "Registro excluído."
      });
      await carregarRegistros();
    } catch (erro) {
      definirNotificacao({
        mensagem:
          erro.message ||
          "Não foi possível excluir o registro.",
        tipo: "erro"
      });
    }
  }

  const tituloEstadoVazio =
    busca && !registrosFiltrados.length
      ? "Nenhum resultado encontrado"
      : "Nenhum registro cadastrado";

  const textoEstadoVazio =
    busca && !registrosFiltrados.length
      ? "Tente outro termo ou atualize a listagem."
      : "Os dados aparecerão aqui assim que forem adicionados e disponibilizados pelo backend.";

  return (
    <>
      <CabecalhoPagina
        titulo={configuracao.titulo}
        subtitulo={configuracao.subtitulo}
        acao={
          <button
            className="botao botao-primario"
            type="button"
            onClick={abrirNovoRegistro}
          >
            <span aria-hidden="true">＋</span>
            Novo registro
          </button>
        }
      />

      <section
        className="cartao cartao-registros"
        aria-label={`Registros de ${configuracao.titulo}`}
      >
        <div className="barra-ferramentas">
          <label className="campo-busca">
            <span className="somente-leitor-tela">
              Pesquisar nos registros
            </span>
            <input
              className="entrada-busca"
              type="search"
              placeholder="Pesquisar nos registros..."
              value={busca}
              onChange={(evento) =>
                definirBusca(evento.target.value)
              }
            />
          </label>
          <button
            className="botao botao-secundario"
            type="button"
            disabled={carregando}
            onClick={() => carregarRegistros(true)}
          >
            {carregando ? "Atualizando…" : "Atualizar"}
          </button>
        </div>

        {carregando && registros.length === 0 ? (
          <EstadoVazio
            icone="···"
            titulo="Carregando registros"
            texto="Aguardando resposta do backend."
          />
        ) : registrosFiltrados.length > 0 ? (
          <div className="rolagem-tabela">
            <table className="tabela-registros">
              <thead>
                <tr>
                  {configuracao.colunas.map((coluna) => (
                    <th key={coluna.chave}>
                      {coluna.rotulo}
                    </th>
                  ))}
                  <th>
                    <span className="somente-leitor-tela">
                      Ações
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {registrosFiltrados.map(
                  (registro, indice) => (
                    <tr key={obterId(registro) ?? indice}>
                      {configuracao.colunas.map((coluna) => {
                        const valorFormatado = formatarValor(
                          lerValor(registro, coluna),
                          coluna,
                          registro
                        );

                        return (
                          <td
                            className={coluna.classeCss}
                            key={coluna.chave}
                          >
                            {coluna.etiqueta ? (
                              <span
                                className={`etiqueta-status ${obterClasseStatus(
                                  valorFormatado
                                )}`}
                              >
                                {valorFormatado}
                              </span>
                            ) : (
                              valorFormatado
                            )}
                          </td>
                        );
                      })}
                      <td className="celula-acoes">
                        <button
                          className="botao-acao"
                          type="button"
                          onClick={() => {
                            definirRegistroEmEdicao(registro);
                            definirModalAberto(true);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="botao-acao excluir"
                          type="button"
                          onClick={() =>
                            excluirRegistro(registro)
                          }
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <EstadoVazio
            icone={configuracao.iconeVazio}
            titulo={tituloEstadoVazio}
            texto={textoEstadoVazio}
          />
        )}
      </section>

      <ModalRegistro
        configuracao={configuracao}
        registro={registroEmEdicao}
        aberto={modalAberto}
        salvando={salvando}
        aoFechar={() => definirModalAberto(false)}
        aoSalvar={salvarRegistro}
      />

      <Notificacao
        notificacao={notificacao}
        aoFechar={() => definirNotificacao(null)}
      />
    </>
  );
}

function EstadoVazio({ icone, titulo, texto }) {
  return (
    <div className="estado-vazio">
      <div>
        <span className="icone-vazio" aria-hidden="true">
          {icone}
        </span>
        <h2>{titulo}</h2>
        <p>{texto}</p>
      </div>
    </div>
  );
}

function obterId(registro) {
  return (
    registro?.id ??
    registro?._id ??
    registro?.codigo ??
    registro?.uuid
  );
}

function lerValor(registro, coluna) {
  const chavesPossiveis = [
    coluna.chave,
    ...(coluna.apelidos || [])
  ];

  for (const chave of chavesPossiveis) {
    if (
      registro?.[chave] !== undefined &&
      registro?.[chave] !== null
    ) {
      return registro[chave];
    }
  }

  return "";
}

function transformarEmNumero(valor) {
  if (typeof valor === "number") return valor;

  return (
    Number(
      String(valor ?? "")
        .replace(/[^\d,.-]/g, "")
        .replace(",", ".")
    ) || 0
  );
}

function formatarValor(valorBruto, coluna, registro) {
  if (coluna.formato === "data") {
    if (!valorBruto) return "—";

    const data = new Date(valorBruto);
    return Number.isNaN(data.getTime())
      ? String(valorBruto)
      : new Intl.DateTimeFormat("pt-BR").format(data);
  }

  if (coluna.formato === "produtividade") {
    if (valorBruto !== "" && valorBruto !== null) {
      return String(valorBruto).includes("%")
        ? String(valorBruto)
        : `${valorBruto}%`;
    }

    const produzido = transformarEmNumero(
      registro.produzido ?? registro.quantidadeProduzida
    );
    const esperado = transformarEmNumero(
      registro.esperado ?? registro.meta
    );

    return esperado
      ? `${Math.round((produzido / esperado) * 100)}%`
      : "—";
  }

  if (coluna.formato === "taxaReciclagem") {
    if (valorBruto !== "" && valorBruto !== null) {
      return String(valorBruto).includes("%")
        ? String(valorBruto)
        : `${valorBruto}%`;
    }

    const reciclado = transformarEmNumero(
      registro.reciclado ?? registro.residuosReciclados
    );
    const residuos = transformarEmNumero(
      registro.residuos ?? registro.residuosGerados
    );

    return residuos
      ? `${Math.round((reciclado / residuos) * 100)}%`
      : "—";
  }

  let valor = valorBruto;

  if (valor && typeof valor === "object") {
    valor = valor.nome ?? valor.name ?? valor.id ?? "—";
  }

  if (
    valor === "" ||
    valor === null ||
    valor === undefined
  ) {
    return "—";
  }

  if (
    coluna.sufixo &&
    !String(valor).includes(coluna.sufixo)
  ) {
    return `${valor} ${coluna.sufixo}`;
  }

  return String(valor);
}

function obterClasseStatus(valor) {
  const normalizado = String(valor)
    .toLocaleLowerCase("pt-BR");

  const statusPositivos = [
    "operação",
    "operacao",
    "resolvida",
    "concluída",
    "concluida",
    "baixo"
  ];

  const statusDeAviso = [
    "manutenção",
    "manutencao",
    "análise",
    "analise",
    "médio",
    "medio"
  ];

  const statusDePerigo = [
    "parada",
    "aberta",
    "crítico",
    "critico",
    "alto"
  ];

  if (
    statusPositivos.some((termo) =>
      normalizado.includes(termo)
    )
  ) {
    return "sucesso";
  }

  if (
    statusDeAviso.some((termo) =>
      normalizado.includes(termo)
    )
  ) {
    return "aviso";
  }

  if (
    statusDePerigo.some((termo) =>
      normalizado.includes(termo)
    )
  ) {
    return "perigo";
  }

  return "";
}
