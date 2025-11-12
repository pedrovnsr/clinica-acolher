import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Professionals from "./pages/Professionals";
import Patients from "./pages/Patients";
import Financeiro from "./pages/Financeiro";
import Agenda from "./pages/Agenda";
import Prontuario from "./pages/Prontuario";
import Configuracoes from "./pages/Configuracoes";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="professionals" element={<Professionals />} />
        <Route path="financeiro" element={<Financeiro />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="prontuario" element={<Prontuario />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Routes>
    </>
  );
}

export default App;
