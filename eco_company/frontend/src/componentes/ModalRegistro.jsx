import { useEffect, useRef } from "react";

export default function ModalRegistro({
  configuracao,
  registro,
  aberto,
  aoFechar,
  aoSalvar,
  salvando
}) {
  const referenciaModal = useRef(null);

  useEffect(() => {
    const modal = referenciaModal.current;
    if (!modal) return;

    if (aberto && !modal.open) {
      modal.querySelector("form")?.reset();
      modal.showModal();
    }

    if (!aberto && modal.open) {
      modal.close();
    }
  }, [aberto]);

  function enviarFormulario(evento) {
    evento.preventDefault();

    const dadosFormulario = Object.fromEntries(
      new FormData(evento.currentTarget).entries()
    );

    for (const campo of configuracao.campos) {
      if (
        campo.tipo === "number" &&
        dadosFormulario[campo.chave] !== ""
      ) {
        dadosFormulario[campo.chave] = Number(
          dadosFormulario[campo.chave]
        );
      }
    }

    aoSalvar(dadosFormulario);
  }

  return (
    <dialog
      ref={referenciaModal}
      className="modal"
      onCancel={aoFechar}
      onClose={aoFechar}
    >
      <form
        onSubmit={enviarFormulario}
        key={registro ? registro.id ?? registro._id : "novo"}
      >
        <div className="cabecalho-modal">
          <div>
            <h2>{registro ? "Editar registro" : "Novo registro"}</h2>
            <p>
              {registro
                ? "Atualize os campos e salve as alterações."
                : "Preencha os dados para enviar ao sistema."}
            </p>
          </div>
          <button
            className="botao-icone"
            type="button"
            aria-label="Fechar"
            onClick={aoFechar}
          >
            ×
          </button>
        </div>

        <div className="grade-formulario">
          {configuracao.campos.map((campo) => {
            let valorInicial = registro
              ? lerValor(registro, campo)
              : "";

            if (campo.tipo === "date" && valorInicial) {
              valorInicial = String(valorInicial).slice(0, 10);
            }

            return (
              <div
                className={`campo-formulario${
                  campo.larguraTotal ? " largura-total" : ""
                }`}
                key={campo.chave}
              >
                <label htmlFor={`campo-${campo.chave}`}>
                  {campo.rotulo}
                </label>
                {montarControle(campo, valorInicial)}
              </div>
            );
          })}
        </div>

        <div className="acoes-modal">
          <button
            className="botao botao-secundario"
            type="button"
            onClick={aoFechar}
          >
            Cancelar
          </button>
          <button
            className="botao botao-primario"
            type="submit"
            disabled={salvando}
          >
            {salvando ? "Salvando…" : "Salvar registro"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

function lerValor(registro, campo) {
  const chavesPossiveis = [
    campo.chave,
    ...(campo.apelidos || [])
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

function montarControle(campo, valorInicial) {
  const propriedadesComuns = {
    id: `campo-${campo.chave}`,
    name: campo.chave,
    required: campo.obrigatorio !== false,
    defaultValue: valorInicial
  };

  if (campo.tipo === "select") {
    return (
      <select
        className="selecao-formulario"
        {...propriedadesComuns}
      >
        <option value="">Selecione</option>
        {campo.opcoes.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
    );
  }

  if (campo.tipo === "textarea") {
    return (
      <textarea
        className="area-texto-formulario"
        {...propriedadesComuns}
      />
    );
  }

  return (
    <input
      className="entrada-formulario"
      type={campo.tipo || "text"}
      step={campo.passo}
      {...propriedadesComuns}
    />
  );
}
