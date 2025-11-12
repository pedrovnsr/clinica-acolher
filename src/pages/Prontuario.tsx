import React, { useState, useEffect, Suspense } from "react";
// import Sidebar from "../components/Sidebar";
// import NotificationHeader from "../components/Notificationheader";
const Sidebar = React.lazy(() => import("../components/Sidebar"));
const NotificationHeader = React.lazy(() => import("../components/Notificationheader"));
import ErrorBoundary from "../components/ErrorBoundary";
import "../styles/Prontuario.css";

interface Registro {
  id: number;
  profissional: string;
  data: string;
  observacoes: string;
  ativo?: boolean;
}

const Prontuario: React.FC = () => {
  useEffect(() => {
    console.log("Prontuario mounted");
  }, []);

  // tabs: 'todos' | 'ativos' | 'novo'
  const [activeTab, setActiveTab] = useState<"todos" | "ativos" | "novo">("todos");

  const [form, setForm] = useState({ profissional: "", data: "", observacoes: "" });
  const [registros, setRegistros] = useState<Registro[]>([
    { id: 1, profissional: "João Silva", data: "2025-11-01", observacoes: "Consulta inicial", ativo: true },
    { id: 2, profissional: "Maria Souza", data: "2025-11-05", observacoes: "Retorno", ativo: true },
    { id: 3, profissional: "Caio José", data: "2025-04-10", observacoes: "Gostoso", ativo: false }
  ]);

  // id do registro sendo editado (se houver)
  const [editingId, setEditingId] = useState<number | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Salvar cria novo registro somente (se estiver editando, salva como novo) - user wanted Update to update existing
  function salvar() {
    const profissional = form.profissional.trim();
    if (!profissional) return;
    const novo: Registro = { id: Date.now(), profissional, data: form.data, observacoes: form.observacoes, ativo: true };
    setRegistros(prev => [novo, ...prev]);
    setForm({ profissional: "", data: "", observacoes: "" });
    setEditingId(null);
    // manter aba em 'todos' para ver o novo registro
    setActiveTab("todos");
  }

  // Atualizar aplica mudanças ao registro em edição
  function atualizar() {
    if (editingId == null) return; // nada para atualizar
    setRegistros(prev => prev.map(r => r.id === editingId ? { ...r, profissional: form.profissional.trim() || r.profissional, data: form.data || r.data, observacoes: form.observacoes } : r));
    setEditingId(null);
    setForm({ profissional: "", data: "", observacoes: "" });
  }

  function excluir(id: number) {
    setRegistros(prev => prev.filter(r => r.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ profissional: "", data: "", observacoes: "" });
    }
  }

  // iniciar edição: preencher form e marcar editingId
  function editar(reg: Registro) {
    setEditingId(reg.id);
    setForm({ profissional: reg.profissional, data: reg.data, observacoes: reg.observacoes });
    // focar aba 'novo' para mostrar formulário preenchido
    setActiveTab("novo");
  }

  // Exporta registros visíveis (filtrados) como CSV
  function exportar() {
    const rows = filteredRegistros.map(r => ({ Profissional: r.profissional, Data: r.data, Observacoes: r.observacoes }));
    if (rows.length === 0) return;
    const csvHeader = Object.keys(rows[0]).join(",") + "\n";
    const csvBody = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const csv = csvHeader + csvBody;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prontuarios.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // registros filtrados conforme aba ativa
  const filteredRegistros = registros.filter(r => {
    if (activeTab === "ativos") return r.ativo !== false;
    return true; // todos ou novo
  });

  return (
    <ErrorBoundary>

      <div className="prontuario-page-root">
        <Suspense fallback={<div /> }>
          <Sidebar />
        </Suspense>

        <div className="prontuario-main">
          <header className="prontuario-header">
            <h1 className="page-title">Prontuários</h1>
            <Suspense fallback={<div />}>
              <NotificationHeader />
            </Suspense>
          </header>

          <main className="prontuario-content">
            <div className="tabs-row">
              <button className={"tab " + (activeTab === 'todos' ? 'active' : '')} onClick={() => setActiveTab('todos')}>Todos</button>
              <button className={"tab " + (activeTab === 'ativos' ? 'active' : '')} onClick={() => setActiveTab('ativos')}>Ativos</button>
              <button className={"tab " + (activeTab === 'novo' ? 'active' : '')} onClick={() => setActiveTab('novo')}>Novo</button>
            </div>

            <section className="prontuario-card">
              <div className="prontuario-titulo">Prontuário - Novo registro</div>

              <div className="form-grid">
                <div>
                  <div className="form-group">
                    <label className="form-label">Profissional</label>
                    <input
                      name="profissional"
                      value={form.profissional}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Nome do profissional"
                    />
                  </div>

                  <div className="form-group date-input-container">
                    <label className="form-label">Data</label>
                    <input
                      type="date"
                      name="data"
                      value={form.data}
                      onChange={handleChange}
                      className="form-input"
                    />
                    <span className="calendar-icon">📅</span>
                  </div>
                </div>

                <div>
                  <div className="form-group">
                    <label className="form-label">Observações</label>
                    <textarea
                      name="observacoes"
                      value={form.observacoes}
                      onChange={handleChange}
                      className="form-textarea"
                      placeholder="Descreva as observações..."
                      rows={6}
                    />
                  </div>

                  <div className="card-actions">
                    <div>
                      <button className="botao-atualizar" onClick={atualizar}>Atualizar</button>
                      <button className="botao-salvar" onClick={salvar}>Salvar</button>
                      <button className="botao-exportar" onClick={exportar}>Exportar</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="prontuario-card list-card">
              <div className="prontuario-titulo">Registros</div>

              <table className="records-table">
                <thead>
                  <tr>
                    <th>Profissional</th>
                    <th>Data</th>
                    <th>Observações</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistros.map(r => (
                    <tr key={r.id}>
                      <td>{r.profissional}</td>
                      <td>{r.data}</td>
                      <td>{r.observacoes}</td>
                      <td>
                        <button className="botao-atualizar" onClick={() => editar(r)}>Editar</button>
                        <button className="botao-excluir" onClick={() => excluir(r.id)}>Excluir</button>
                      </td>
                    </tr>
                  ))}

                  {filteredRegistros.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: 18, color: '#777' }}>Nenhum registro</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Prontuario;
