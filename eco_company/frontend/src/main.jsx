import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "../css/base.css";
import "../css/visao-geral.css";
import "../css/maquinas.css";
import "../css/producao.css";
import "../css/sustentabilidade.css";
import "../css/seguranca.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
