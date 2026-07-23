import { useEffect, useRef } from "react";

export default function RecordDialog({ config, record, open, onClose, onSave, saving }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.querySelector("form")?.reset();
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    for (const field of config.fields) {
      if (field.type === "number" && data[field.key] !== "") data[field.key] = Number(data[field.key]);
    }
    onSave(data);
  }

  return (
    <dialog ref={dialogRef} className="modal" onCancel={onClose} onClose={onClose}>
      <form onSubmit={handleSubmit} key={record ? record.id ?? record._id : "new"}>
        <div className="modal-header">
          <div>
            <h2>{record ? "Editar registro" : "Novo registro"}</h2>
            <p>{record ? "Atualize os campos e salve as alterações." : "Preencha os dados para enviar ao sistema."}</p>
          </div>
          <button className="icon-button" type="button" aria-label="Fechar" onClick={onClose}>×</button>
        </div>

        <div className="form-grid">
          {config.fields.map((field) => {
            let defaultValue = record ? readValue(record, field) : "";
            if (field.type === "date" && defaultValue) defaultValue = String(defaultValue).slice(0, 10);
            return (
              <div className={`form-field${field.full ? " full" : ""}`} key={field.key}>
                <label htmlFor={`field-${field.key}`}>{field.label}</label>
                {renderControl(field, defaultValue)}
              </div>
            );
          })}
        </div>

        <div className="modal-actions">
          <button className="button button-secondary" type="button" onClick={onClose}>Cancelar</button>
          <button className="button button-primary" type="submit" disabled={saving}>
            {saving ? "Salvando…" : "Salvar registro"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

function readValue(record, field) {
  for (const key of [field.key, ...(field.aliases || [])]) {
    if (record?.[key] !== undefined && record?.[key] !== null) return record[key];
  }
  return "";
}

function renderControl(field, defaultValue) {
  const common = {
    id: `field-${field.key}`,
    name: field.key,
    required: field.required !== false,
    defaultValue
  };

  if (field.type === "select") {
    return (
      <select className="field-select" {...common}>
        <option value="">Selecione</option>
        {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  }

  if (field.type === "textarea") return <textarea className="field-textarea" {...common} />;

  return <input className="field-input" type={field.type || "text"} step={field.step} {...common} />;
}
