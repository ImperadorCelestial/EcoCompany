import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CabecalhoPagina from "../componentes/CabecalhoPagina";
import { api } from "../servicos/api";

const indicadoresVazios = {
  maquinas: "0",
  operando: "0",
  producao: "0",
  atividade: "0%",
  energia: "0 kWh",
  reciclagem: "0%",
  ocorrencias: "0",
  riscos: "0"
};

const cartoesIndicadores = [
  ["maquinas", "Máquinas cadastradas", "Total registrado"],
  ["operando", "Em operação", "Equipamentos ativos"],
  ["producao", "Produção total", "Somatório produzido"],
  ["atividade", "Atividade média", "Produzido × esperado"],
  ["energia", "Energia registrada", "Consumo acumulado"],
  ["reciclagem", "Resíduos reciclados", "Taxa de reciclagem"],
  [
    "ocorrencias",
    "Ocorrências abertas",
    "Pendentes ou em análise"
  ],
  ["riscos", "Riscos altos / críticos", "Exigem prioridade"]
];

export default function VisaoGeral() {
  const [indicadores, definirIndicadores] =
    useState(indicadoresVazios);
  const [producoes, definirProducoes] = useState([]);
  const [carregando, definirCarregando] = useState(true);

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarDados() {
      const recursos = [
        "maquinas",
        "producoes",
        "sustentabilidade",
        "seguranca"
      ];

      const resultados = await Promise.allSettled(
        recursos.map((recurso) => api.listar(recurso))
      );

      if (!componenteAtivo) return;

      const [
        maquinas,
        dadosProducao,
        sustentabilidade,
        seguranca
      ] = resultados.map((resultado) =>
        resultado.status === "fulfilled"
          ? resultado.value
          : []
      );

      definirIndicadores(
        calcularIndicadores(
          maquinas,
          dadosProducao,
          sustentabilidade,
          seguranca
        )
      );
      definirProducoes(dadosProducao.slice(0, 6));
      definirCarregando(false);
    }

    carregarDados();
    return () => {
      componenteAtivo = false;
    };
  }, []);

  return (
    <>
      <CabecalhoPagina
        titulo="Visão Geral"
        subtitulo="Acompanhe os principais indicadores da empresa em um único lugar."
      />

      <section
        className="grade-indicadores"
        aria-label="Indicadores principais"
      >
        {cartoesIndicadores.map(
          ([chave, rotulo, observacao]) => (
            <article
              className="cartao cartao-indicador"
              key={chave}
            >
              <p className="rotulo-indicador">{rotulo}</p>
              <p className="valor-indicador">
                {indicadores[chave]}
              </p>
              <p className="observacao-indicador">
                {observacao}
              </p>
            </article>
          )
        )}
      </section>

      <section
        className="cartao cartao-registros"
        aria-labelledby="titulo-producoes-recentes"
      >
        <div className="cabecalho-secao">
          <div>
            <h2 id="titulo-producoes-recentes">
              Produções recentes
            </h2>
            <p>Últimos registros incluídos no sistema.</p>
          </div>
          <Link className="link-secao" to="/producao">
            Ver produção →
          </Link>
        </div>

        {producoes.length > 0 ? (
          <div className="rolagem-tabela">
            <table className="tabela-registros">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Produto</th>
                  <th>Máquina</th>
                  <th>Produzido</th>
                  <th>Meta</th>
                  <th>Produtividade</th>
                </tr>
              </thead>
              <tbody>
                {producoes.map((registro, indice) => (
                  <LinhaProducao
                    registro={registro}
                    key={registro.id ?? registro._id ?? indice}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="estado-vazio">
            <div>
              <span className="icone-vazio" aria-hidden="true">
                {carregando ? "···" : "▤"}
              </span>
              <h2>
                {carregando
                  ? "Carregando produções"
                  : "Nenhuma produção registrada"}
              </h2>
              <p>
                {carregando
                  ? "Aguardando resposta do backend."
                  : "Os registros mais recentes aparecerão aqui quando forem adicionados ao backend."}
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function LinhaProducao({ registro }) {
  const produzido = transformarEmNumero(
    obterValor(registro, "produzido", "quantidadeProduzida")
  );
  const esperado = transformarEmNumero(
    obterValor(registro, "esperado", "meta")
  );
  const produtividade =
    obterValor(registro, "produtividade") ||
    (esperado
      ? `${Math.round((produzido / esperado) * 100)}%`
      : "—");
  const valorMaquina = obterValor(
    registro,
    "maquinaNome",
    "maquina",
    "equipamento"
  );
  const maquina =
    typeof valorMaquina === "object"
      ? valorMaquina.nome
      : valorMaquina;

  return (
    <tr>
      <td>
        {formatarData(
          obterValor(registro, "data", "createdAt")
        )}
      </td>
      <td>
        {obterValor(registro, "produto", "nomeProduto") || "—"}
      </td>
      <td>{maquina || "—"}</td>
      <td>{produzido || "—"}</td>
      <td>{esperado || "—"}</td>
      <td className="valor-produtividade">
        {String(produtividade).includes("%")
          ? produtividade
          : `${produtividade}%`}
      </td>
    </tr>
  );
}

function calcularIndicadores(
  maquinas,
  producoes,
  sustentabilidade,
  seguranca
) {
  const maquinasOperando = maquinas.filter((item) =>
    /opera/i.test(obterValor(item, "status"))
  ).length;

  const totalProduzido = producoes.reduce(
    (soma, item) =>
      soma +
      transformarEmNumero(
        obterValor(
          item,
          "produzido",
          "quantidadeProduzida"
        )
      ),
    0
  );

  const produtividades = producoes
    .map((item) => {
      const valorInformado = transformarEmNumero(
        obterValor(item, "produtividade")
      );
      if (valorInformado) return valorInformado;

      const esperado = transformarEmNumero(
        obterValor(item, "esperado", "meta")
      );
      const produzido = transformarEmNumero(
        obterValor(
          item,
          "produzido",
          "quantidadeProduzida"
        )
      );

      return esperado
        ? (produzido / esperado) * 100
        : 0;
    })
    .filter(Boolean);

  const atividadeMedia = produtividades.length
    ? produtividades.reduce(
        (soma, valor) => soma + valor,
        0
      ) / produtividades.length
    : 0;

  const energiaTotal = sustentabilidade.reduce(
    (soma, item) =>
      soma +
      transformarEmNumero(
        obterValor(item, "energia", "energiaConsumida")
      ),
    0
  );

  const residuosTotais = sustentabilidade.reduce(
    (soma, item) =>
      soma +
      transformarEmNumero(
        obterValor(item, "residuos", "residuosGerados")
      ),
    0
  );

  const totalReciclado = sustentabilidade.reduce(
    (soma, item) =>
      soma +
      transformarEmNumero(
        obterValor(
          item,
          "reciclado",
          "residuosReciclados"
        )
      ),
    0
  );

  const ocorrenciasAbertas = seguranca.filter(
    (item) =>
      !/resolvid|conclu/i.test(
        obterValor(item, "status")
      )
  ).length;

  const riscosAltos = seguranca.filter((item) =>
    /alto|cr.tico/i.test(
      obterValor(item, "risco", "nivelRisco")
    )
  ).length;

  return {
    maquinas: String(maquinas.length),
    operando: String(maquinasOperando),
    producao: totalProduzido.toLocaleString("pt-BR"),
    atividade: `${Math.round(atividadeMedia)}%`,
    energia: `${energiaTotal.toLocaleString("pt-BR", {
      maximumFractionDigits: 1
    })} kWh`,
    reciclagem: `${
      residuosTotais
        ? Math.round(
            (totalReciclado / residuosTotais) * 100
          )
        : 0
    }%`,
    ocorrencias: String(ocorrenciasAbertas),
    riscos: String(riscosAltos)
  };
}

function obterValor(registro, ...chaves) {
  for (const chave of chaves) {
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

function formatarData(valor) {
  if (!valor) return "—";

  const data = new Date(valor);
  return Number.isNaN(data.getTime())
    ? String(valor)
    : new Intl.DateTimeFormat("pt-BR").format(data);
}
