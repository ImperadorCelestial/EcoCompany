import { useCallback, useEffect, useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import RecordDialog from "./RecordDialog";
import Toast from "./Toast";
import { api } from "../services/api";

export default function CrudPage({ config }) {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);

  const loadRecords = useCallback(async (notify = false) => {
    setLoading(true);
    try {
      setRecords(await api.list(config.resource));
      if (notify) setToast({ message: "Registros atualizados." });
    } catch {
      setRecords([]);
      if (notify) setToast({ message: "Não foi possível consultar o backend.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [config.resource]);

  useEffect(() => {
    setSearch("");
    loadRecords();
  }, [loadRecords]);

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    if (!term) return records;
    return records.filter((record) => JSON.stringify(record).toLocaleLowerCase("pt-BR").includes(term));
  }, [records, search]);

  function openNew() {
    setEditing(null);
    setDialogOpen(true);
  }

  async function saveRecord(data) {
    setSaving(true);
    try {
      const id = editing && getId(editing);
      if (id !== null && id !== undefined) await api.update(config.resource, id, data);
      else await api.create(config.resource, data);
      setDialogOpen(false);
      setToast({ message: editing ? "Registro atualizado." : "Registro adicionado." });
      await loadRecords();
    } catch (error) {
      setToast({ message: error.message || "Não foi possível salvar o registro.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function removeRecord(record) {
    if (!window.confirm("Deseja realmente excluir este registro?")) return;
    try {
      await api.remove(config.resource, getId(record));
      setToast({ message: "Registro excluído." });
      await loadRecords();
    } catch (error) {
      setToast({ message: error.message || "Não foi possível excluir o registro.", type: "error" });
    }
  }

  const emptyTitle = search && !filteredRecords.length ? "Nenhum resultado encontrado" : "Nenhum registro cadastrado";
  const emptyText = search && !filteredRecords.length
    ? "Tente outro termo ou atualize a listagem."
    : "Os dados aparecerão aqui assim que forem adicionados e disponibilizados pelo backend.";

  return (
    <>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        action={<button className="button button-primary" type="button" onClick={openNew}><span aria-hidden="true">＋</span> Novo registro</button>}
      />

      <section className="card records-card" aria-label={`Registros de ${config.title}`}>
        <div className="toolbar">
          <label className="search-wrap">
            <span className="sr-only">Pesquisar nos registros</span>
            <input
              className="search-input"
              type="search"
              placeholder="Pesquisar nos registros..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <button className="button button-secondary" type="button" disabled={loading} onClick={() => loadRecords(true)}>
            {loading ? "Atualizando…" : "Atualizar"}
          </button>
        </div>

        {loading && records.length === 0 ? (
          <div className="empty-state"><div><span className="empty-icon" aria-hidden="true">···</span><h2>Carregando registros</h2><p>Aguardando resposta do backend.</p></div></div>
        ) : filteredRecords.length > 0 ? (
          <div className="table-scroll">
            <table className="records-table">
              <thead><tr>{config.columns.map((column) => <th key={column.key}>{column.label}</th>)}<th><span className="sr-only">Ações</span></th></tr></thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr key={getId(record) ?? index}>
                    {config.columns.map((column) => {
                      const formatted = formatValue(readValue(record, column), column, record);
                      return (
                        <td className={column.className} key={column.key}>
                          {column.badge ? <span className={`status-pill ${statusClass(formatted)}`}>{formatted}</span> : formatted}
                        </td>
                      );
                    })}
                    <td className="actions-cell">
                      <button className="action-button" type="button" onClick={() => { setEditing(record); setDialogOpen(true); }}>Editar</button>
                      <button className="action-button delete" type="button" onClick={() => removeRecord(record)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state"><div><span className="empty-icon" aria-hidden="true">{config.emptyIcon}</span><h2>{emptyTitle}</h2><p>{emptyText}</p></div></div>
        )}
      </section>

      <RecordDialog
        config={config}
        record={editing}
        open={dialogOpen}
        saving={saving}
        onClose={() => setDialogOpen(false)}
        onSave={saveRecord}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}

function getId(record) {
  return record?.id ?? record?._id ?? record?.codigo ?? record?.uuid;
}

function readValue(record, column) {
  for (const key of [column.key, ...(column.aliases || [])]) {
    if (record?.[key] !== undefined && record?.[key] !== null) return record[key];
  }
  return "";
}

function numberFrom(value) {
  if (typeof value === "number") return value;
  return Number(String(value ?? "").replace(/[^\d,.-]/g, "").replace(",", ".")) || 0;
}

function formatValue(rawValue, column, record) {
  if (column.format === "date") {
    if (!rawValue) return "—";
    const date = new Date(rawValue);
    return Number.isNaN(date.getTime()) ? String(rawValue) : new Intl.DateTimeFormat("pt-BR").format(date);
  }

  if (column.format === "productivity") {
    if (rawValue !== "" && rawValue !== null) return String(rawValue).includes("%") ? String(rawValue) : `${rawValue}%`;
    const produced = numberFrom(record.produzido ?? record.quantidadeProduzida);
    const expected = numberFrom(record.esperado ?? record.meta);
    return expected ? `${Math.round((produced / expected) * 100)}%` : "—";
  }

  if (column.format === "recycleRate") {
    if (rawValue !== "" && rawValue !== null) return String(rawValue).includes("%") ? String(rawValue) : `${rawValue}%`;
    const recycled = numberFrom(record.reciclado ?? record.residuosReciclados);
    const waste = numberFrom(record.residuos ?? record.residuosGerados);
    return waste ? `${Math.round((recycled / waste) * 100)}%` : "—";
  }

  let value = rawValue;
  if (value && typeof value === "object") value = value.nome ?? value.name ?? value.id ?? "—";
  if (value === "" || value === null || value === undefined) return "—";
  if (column.suffix && !String(value).includes(column.suffix)) return `${value} ${column.suffix}`;
  return String(value);
}

function statusClass(value) {
  const normalized = String(value).toLocaleLowerCase("pt-BR");
  if (["operação", "operacao", "resolvida", "concluída", "concluida", "baixo"].some((term) => normalized.includes(term))) return "success";
  if (["manutenção", "manutencao", "análise", "analise", "médio", "medio"].some((term) => normalized.includes(term))) return "warning";
  if (["parada", "aberta", "crítico", "critico", "alto"].some((term) => normalized.includes(term))) return "danger";
  return "";
}
