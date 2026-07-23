import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { api } from "../servicos/api";

const itensNavegacao = [
  { destino: "/visao-geral", rotulo: "Visão Geral", icone: "▦" },
  { destino: "/maquinas", rotulo: "Máquinas", icone: "⚙" },
  { destino: "/producao", rotulo: "Produção", icone: "▤" },
  {
    destino: "/sustentabilidade",
    rotulo: "Sustentabilidade",
    icone: "♻"
  },
  { destino: "/seguranca", rotulo: "Segurança", icone: "◇" }
];

export default function EstruturaPagina({ children: conteudo }) {
  const [conectado, definirConectado] = useState(false);
  const [menuAberto, definirMenuAberto] = useState(false);

  useEffect(() => {
    const atualizarConexao = (evento) => {
      definirConectado(Boolean(evento.detail?.conectado));
    };

    window.addEventListener("ecocompany:conexao", atualizarConexao);
    api.verificarConexao();

    const intervalo = window.setInterval(
      () => api.verificarConexao(),
      15000
    );

    return () => {
      window.removeEventListener("ecocompany:conexao", atualizarConexao);
      window.clearInterval(intervalo);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-aberto", menuAberto);

    const fecharAoClicarFora = (evento) => {
      const clicouNaBarra = evento.target.closest?.(".barra-lateral");
      const clicouNoBotao = evento.target.closest?.(".botao-menu");

      if (menuAberto && !clicouNaBarra && !clicouNoBotao) {
        definirMenuAberto(false);
      }
    };

    document.addEventListener("click", fecharAoClicarFora);

    return () => {
      document.removeEventListener("click", fecharAoClicarFora);
      document.body.classList.remove("menu-aberto");
    };
  }, [menuAberto]);

  return (
    <>
      <div className="barra-superior-mobile">
        <strong>EcoCompany</strong>
        <button
          className="botao-menu"
          type="button"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          onClick={() => definirMenuAberto((estadoAtual) => !estadoAtual)}
        >
          ☰
        </button>
      </div>

      <div className="estrutura-aplicacao">
        <aside className="barra-lateral" aria-label="Navegação principal">
          <NavLink
            className="marca"
            to="/visao-geral"
            onClick={() => definirMenuAberto(false)}
          >
            <span className="simbolo-marca">EC</span>
            <span className="texto-marca">
              <strong>EcoCompany</strong>
              <span>Indústria Inteligente</span>
            </span>
          </NavLink>

          <nav className="navegacao-lateral">
            {itensNavegacao.map((item) => (
              <NavLink
                key={item.destino}
                to={item.destino}
                className={({ isActive: estaAtivo }) =>
                  `link-navegacao${estaAtivo ? " ativo" : ""}`
                }
                onClick={() => definirMenuAberto(false)}
              >
                <span className="icone-navegacao" aria-hidden="true">
                  {item.icone}
                </span>
                {item.rotulo}
              </NavLink>
            ))}
          </nav>

          <div
            className={`status-backend${conectado ? " conectado" : ""}`}
            aria-live="polite"
            title={
              conectado
                ? `Conectado a ${api.urlBase}`
                : `Sem resposta de ${api.urlBase}`
            }
          >
            <span className="ponto-conexao" aria-hidden="true" />
            <span>
              {conectado
                ? "Backend conectado"
                : "Backend desconectado"}
            </span>
          </div>
        </aside>

        <main className="pagina">
          <div className="conteudo-pagina">{conteudo}</div>
        </main>
      </div>
    </>
  );
}
