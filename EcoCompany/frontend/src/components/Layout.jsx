import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { api } from "../services/api";

const navigation = [
  { to: "/visao-geral", label: "Visão Geral", icon: "▦" },
  { to: "/maquinas", label: "Máquinas", icon: "⚙" },
  { to: "/producao", label: "Produção", icon: "▤" },
  { to: "/sustentabilidade", label: "Sustentabilidade", icon: "♻" },
  { to: "/seguranca", label: "Segurança", icon: "◇" }
];

export default function Layout({ children }) {
  const [online, setOnline] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleConnection = (event) => setOnline(Boolean(event.detail?.online));
    window.addEventListener("ecocompany:connection", handleConnection);
    api.checkConnection();
    const interval = window.setInterval(() => api.checkConnection(), 15000);
    return () => {
      window.removeEventListener("ecocompany:connection", handleConnection);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    const closeFromOutside = (event) => {
      if (menuOpen && !event.target.closest?.(".sidebar") && !event.target.closest?.(".menu-button")) setMenuOpen(false);
    };
    document.addEventListener("click", closeFromOutside);
    return () => {
      document.removeEventListener("click", closeFromOutside);
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  return (
    <>
      <div className="mobile-topbar">
        <strong>EcoCompany</strong>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          ☰
        </button>
      </div>

      <div className="app-shell" onClick={(event) => {
        if (menuOpen && !event.target.closest(".sidebar") && !event.target.closest(".menu-button")) setMenuOpen(false);
      }}>
        <aside className="sidebar" aria-label="Navegação principal">
          <NavLink className="brand" to="/visao-geral" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark">EC</span>
            <span className="brand-copy"><strong>EcoCompany</strong><span>Indústria Inteligente</span></span>
          </NavLink>

          <nav className="sidebar-nav">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div
            className={`backend-status${api.isMock ? " mock" : online ? " online" : ""}`}
            aria-live="polite"
            title={api.isMock ? "Os dados estão sendo mantidos em memória para testes" : online ? `Conectado a ${api.baseUrl}` : `Sem resposta de ${api.baseUrl}`}
          >
            <span className="connection-dot" aria-hidden="true" />
            <span>{api.isMock ? "Modo de teste local" : online ? "Backend conectado" : "Backend desconectado"}</span>
          </div>
        </aside>

        <main className="page">
          <div className="page-inner">{children}</div>
        </main>
      </div>
    </>
  );
}
