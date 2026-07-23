import { useEffect } from "react";

export default function Notificacao({
  notificacao,
  aoFechar
}) {
  useEffect(() => {
    if (!notificacao) return undefined;

    const temporizador = window.setTimeout(aoFechar, 4200);
    return () => window.clearTimeout(temporizador);
  }, [notificacao, aoFechar]);

  if (!notificacao) return null;

  return (
    <div className="area-notificacoes" aria-live="polite">
      <div
        className={`notificacao${
          notificacao.tipo === "erro" ? " erro" : ""
        }`}
        role="status"
      >
        {notificacao.mensagem}
      </div>
    </div>
  );
}
