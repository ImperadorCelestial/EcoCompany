export default function CabecalhoPagina({
  titulo,
  subtitulo,
  acao
}) {
  return (
    <header className="cabecalho-pagina">
      <div>
        <p className="categoria-pagina">
          {titulo === "Visão Geral" ? "Painel operacional" : "Módulo"}
        </p>
        <h1>{titulo}</h1>
        <p className="subtitulo">{subtitulo}</p>
      </div>
      {acao}
    </header>
  );
}
