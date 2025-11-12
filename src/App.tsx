import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Professionals from "./pages/Professionals";
import Patients from "./pages/Patients";
import Financeiro from "./pages/Financeiro";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/professionals" element={<Professionals />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/financeiro" element={<Financeiro />} />
    </Routes>
  );
}
