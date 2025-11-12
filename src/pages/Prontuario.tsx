import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import NotificationHeader from "../components/Notificationheader";
import "../styles/Prontuario.css";

interface Registro {
  id: number;
  profissional: string;
  data: string;
  observacoes: string;
}

const Prontuario: React.FC = () => {
  const [form, setForm] = useState({ profissional: "", data: "", observacoes: "" });
  const [registros, setRegistros] = useState<Registro[]>([
    { id: 1, profissional: "João Silva", data: "2025-11-01", observacoes: "Consulta inicial" },
    { id: 2, profissional: "Maria Souza", data: "2025-11-05", observacoes: "Retorno" },
  ]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function salvar() {
    if (!form.profissional.trim()) return;
    const novo: Registro = { id: Date.now(), profissional: form.profissional.trim(), data: form.data, observacoes: form.observacoes };
    setRegistros(prev => [novo, ...prev]);
    setForm({ profissional: "", data: "", observacoes: "" });
  }

  function excluir(id: number) {
    setRegistros(prev => prev.filter(r => r.id !== id));
  }

  function editar(reg: Registro) {
    setForm({ profissional: reg.profissional, data: reg.data, observacoes: reg.observacoes });
    // opcional: remover o registro sendo editado para evitar duplicatas ao salvar; aqui mantemos simples
  }

  return (
    <div className="prontuario-page-root">
      <Sidebar />

      <div className="prontuario-main">
        <header className="prontuario-header">
          <h1 className="page-title">Prontuários</h1>
          <NotificationHeader />
        </header>

        <main className="prontuario-content">
          <div className="tabs-row">
            <button className="tab">Todos</button>
            <button className="tab">Ativos</button>
            <button className="tab active">Novo</button>
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
                    <button className="botao-atualizar" onClick={() => { /* placeholder */ }}>Atualizar</button>
                    <button className="botao-salvar" onClick={salvar}>Salvar</button>
                    <button className="botao-exportar">Exportar</button>
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
                {registros.map(r => (
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

                {registros.length === 0 && (
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
  );
};

export default Prontuario;
