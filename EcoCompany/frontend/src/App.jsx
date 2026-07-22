import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import CrudPage from "./components/CrudPage";
import Dashboard from "./pages/Dashboard";
import { modules } from "./data/modules";

function ModuleRoute({ moduleKey }) {
  return <CrudPage config={modules[moduleKey]} />;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/visao-geral" replace />} />
        <Route path="/visao-geral" element={<Dashboard />} />
        <Route path="/maquinas" element={<ModuleRoute moduleKey="maquinas" />} />
        <Route path="/producao" element={<ModuleRoute moduleKey="producoes" />} />
        <Route path="/sustentabilidade" element={<ModuleRoute moduleKey="sustentabilidade" />} />
        <Route path="/seguranca" element={<ModuleRoute moduleKey="seguranca" />} />
        <Route path="*" element={<Navigate to="/visao-geral" replace />} />
      </Routes>
    </Layout>
  );
}
