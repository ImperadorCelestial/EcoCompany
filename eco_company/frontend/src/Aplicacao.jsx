import { Navigate, Route, Routes } from "react-router-dom";
import EstruturaPagina from "./componentes/EstruturaPagina";
import PaginaCrud from "./componentes/PaginaCrud";
import VisaoGeral from "./paginas/VisaoGeral";
import { modulos } from "./dados/modulos";

function RotaModulo({ chaveModulo }) {
  return <PaginaCrud configuracao={modulos[chaveModulo]} />;
}

export default function Aplicacao() {
  return (
    <EstruturaPagina>
      <Routes>
        <Route path="/" element={<Navigate to="/visao-geral" replace />} />
        <Route path="/visao-geral" element={<VisaoGeral />} />
        <Route path="/maquinas" element={<RotaModulo chaveModulo="maquinas" />} />
        <Route path="/producao" element={<RotaModulo chaveModulo="producoes" />} />
        <Route path="/sustentabilidade" element={<RotaModulo chaveModulo="sustentabilidade" />} />
        <Route path="/seguranca" element={<RotaModulo chaveModulo="seguranca" />} />
        <Route path="*" element={<Navigate to="/visao-geral" replace />} />
      </Routes>
    </EstruturaPagina>
  );
}
