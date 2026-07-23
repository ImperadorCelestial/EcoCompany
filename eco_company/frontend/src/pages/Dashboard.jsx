import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { api } from "../services/api";

const emptyMetrics = {
  machines: "0",
  operating: "0",
  production: "0",
  activity: "0%",
  energy: "0 kWh",
  recycling: "0%",
  occurrences: "0",
  risks: "0"
};

const metricCards = [
  ["machines", "Máquinas cadastradas", "Total registrado"],
  ["operating", "Em operação", "Equipamentos ativos"],
  ["production", "Produção total", "Somatório produzido"],
  ["activity", "Atividade média", "Produzido × esperado"],
  ["energy", "Energia registrada", "Consumo acumulado"],
  ["recycling", "Resíduos reciclados", "Taxa de reciclagem"],
  ["occurrences", "Ocorrências abertas", "Pendentes ou em análise"],
  ["risks", "Riscos altos / críticos", "Exigem prioridade"]
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState(emptyMetrics);
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      const resources = ["maquinas", "producoes", "sustentabilidade", "seguranca"];
      const results = await Promise.allSettled(resources.map((resource) => api.list(resource)));
      if (!active) return;
      const [machines, productionData, sustainability, safety] = results.map((result) => result.status === "fulfilled" ? result.value : []);
      setMetrics(calculateMetrics(machines, productionData, sustainability, safety));
      setProductions(productionData.slice(0, 6));
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, []);

  return (
    <>
      <PageHeader title="Visão Geral" subtitle="Acompanhe os principais indicadores da empresa em um único lugar." />

      <section className="metrics-grid" aria-label="Indicadores principais">
        {metricCards.map(([key, label, note]) => (
          <article className="card metric-card" key={key}>
            <p className="metric-label">{label}</p>
            <p className="metric-value">{metrics[key]}</p>
            <p className="metric-note">{note}</p>
          </article>
        ))}
      </section>

      <section className="card records-card" aria-labelledby="recent-title">
        <div className="section-heading">
          <div><h2 id="recent-title">Produções recentes</h2><p>Últimos registros incluídos no sistema.</p></div>
          <Link className="section-link" to="/producao">Ver produção →</Link>
        </div>

        {productions.length > 0 ? (
          <div className="table-scroll">
            <table className="records-table">
              <thead><tr><th>Data</th><th>Produto</th><th>Máquina</th><th>Produzido</th><th>Meta</th><th>Produtividade</th></tr></thead>
              <tbody>{productions.map((record, index) => <ProductionRow record={record} key={record.id ?? record._id ?? index} />)}</tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div><span className="empty-icon" aria-hidden="true">{loading ? "···" : "▤"}</span><h2>{loading ? "Carregando produções" : "Nenhuma produção registrada"}</h2><p>{loading ? "Aguardando resposta do backend." : "Os registros mais recentes aparecerão aqui quando forem adicionados ao backend."}</p></div>
          </div>
        )}
      </section>
    </>
  );
}

function ProductionRow({ record }) {
  const produced = numberFrom(value(record, "produzido", "quantidadeProduzida"));
  const expected = numberFrom(value(record, "esperado", "meta"));
  const productivity = value(record, "produtividade") || (expected ? `${Math.round((produced / expected) * 100)}%` : "—");
  const machineValue = value(record, "maquinaNome", "maquina", "equipamento");
  const machine = typeof machineValue === "object" ? machineValue.nome : machineValue;
  return (
    <tr>
      <td>{dateLabel(value(record, "data", "createdAt"))}</td>
      <td>{value(record, "produto", "nomeProduto") || "—"}</td>
      <td>{machine || "—"}</td>
      <td>{produced || "—"}</td>
      <td>{expected || "—"}</td>
      <td className="productivity-value">{String(productivity).includes("%") ? productivity : `${productivity}%`}</td>
    </tr>
  );
}

function calculateMetrics(machines, productions, sustainability, safety) {
  const operating = machines.filter((item) => /opera/i.test(value(item, "status"))).length;
  const totalProduced = productions.reduce((sum, item) => sum + numberFrom(value(item, "produzido", "quantidadeProduzida")), 0);
  const productivities = productions.map((item) => {
    const explicit = numberFrom(value(item, "produtividade"));
    if (explicit) return explicit;
    const expected = numberFrom(value(item, "esperado", "meta"));
    return expected ? numberFrom(value(item, "produzido", "quantidadeProduzida")) / expected * 100 : 0;
  }).filter(Boolean);
  const average = productivities.length ? productivities.reduce((a, b) => a + b, 0) / productivities.length : 0;
  const energy = sustainability.reduce((sum, item) => sum + numberFrom(value(item, "energia", "energiaConsumida")), 0);
  const waste = sustainability.reduce((sum, item) => sum + numberFrom(value(item, "residuos", "residuosGerados")), 0);
  const recycled = sustainability.reduce((sum, item) => sum + numberFrom(value(item, "reciclado", "residuosReciclados")), 0);
  const open = safety.filter((item) => !/resolvid|conclu/i.test(value(item, "status"))).length;
  const risks = safety.filter((item) => /alto|cr.tico/i.test(value(item, "risco", "nivelRisco"))).length;

  return {
    machines: String(machines.length),
    operating: String(operating),
    production: totalProduced.toLocaleString("pt-BR"),
    activity: `${Math.round(average)}%`,
    energy: `${energy.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kWh`,
    recycling: `${waste ? Math.round(recycled / waste * 100) : 0}%`,
    occurrences: String(open),
    risks: String(risks)
  };
}

function value(record, ...keys) {
  for (const key of keys) if (record?.[key] !== undefined && record?.[key] !== null) return record[key];
  return "";
}

function numberFrom(input) {
  if (typeof input === "number") return input;
  return Number(String(input ?? "").replace(/[^\d,.-]/g, "").replace(",", ".")) || 0;
}

function dateLabel(input) {
  if (!input) return "—";
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? String(input) : new Intl.DateTimeFormat("pt-BR").format(date);
}
