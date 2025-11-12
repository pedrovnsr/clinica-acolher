import React, { useState, useEffect, Suspense } from "react";
const Sidebar = React.lazy(() => import("../components/Sidebar"));
const NotificationHeader = React.lazy(() => import("../components/Notificationheader"));
import ErrorBoundary from "../components/ErrorBoundary";
import "../styles/Prontuario.css";

interface Prontuario {
  id: number;
  nome: string;
  data: string;
  descricao: string;
  ativo: boolean;
}

const Prontuario: React.FC = () => {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [novoProntuario, setNovoProntuario] = useState<Prontuario>({
    id: 0,
    nome: "",
    data: "",
    descricao: "",
    ativo: true,
  });
  const [tabSelecionada, setTabSelecionada] = useState("todos");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    const dadosIniciais = [
      { id: 1, nome: "João Silva", data: "2025-10-10", descricao: "Consulta de rotina", ativo: true },
      { id: 2, nome: "Maria Souza", data: "2025-10-12", descricao: "Acompanhamento pós-operatório", ativo: false },
    ];
    setProntuarios(dadosIniciais);
  }, []);

  const salvarProntuario = () => {
    if (!novoProntuario.nome || !novoProntuario.data || !novoProntuario.descricao) return;

    if (editandoId !== null) {
      setProntuarios((prev) =>
        prev.map((p) => (p.id === editandoId ? { ...novoProntuario, id: editandoId } : p))
      );
      setEditandoId(null);
    } else {
      const novo = { ...novoProntuario, id: prontuarios.length + 1 };
      setProntuarios((prev) => [...prev, novo]);
    }

    setNovoProntuario({ id: 0, nome: "", data: "", descricao: "", ativo: true });
  };

  const editarProntuario = (id: number) => {
    const prontuario = prontuarios.find((p) => p.id === id);
    if (prontuario) {
      setNovoProntuario(prontuario);
      setEditandoId(id);
    }
  };

  const excluirProntuario = (id: number) => {
    setProntuarios((prev) => prev.filter((p) => p.id !== id));
  };

  const exportarCSV = () => {
    const header = "ID,Nome,Data,Descrição,Ativo\n";
    const linhas = prontuarios
      .map((p) => `${p.id},${p.nome},${p.data},${p.descricao},${p.ativo ? "Sim" : "Não"}`)
      .join("\n");
    const csvContent = header + linhas;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prontuarios.csv";
    a.click();
  };

  const prontuariosFiltrados = prontuarios.filter((p) => {
    if (tabSelecionada === "ativos") return p.ativo;
    return true;
  });

  return (
    <div className="prontuario-page-root">
      <ErrorBoundary>
        <Suspense fallback={<div>Carregando Sidebar...</div>}>
          <Sidebar />
        </Suspense>
      </ErrorBoundary>

      <div className="prontuario-content">
        <ErrorBoundary>
          <Suspense fallback={<div>Carregando Header...</div>}>
            <NotificationHeader />
          </Suspense>
        </ErrorBoundary>

        <div className="tabs">
          <button
            className={tabSelecionada === "todos" ? "active" : ""}
            onClick={() => setTabSelecionada("todos")}
          >
            Todos
          </button>
          <button
            className={tabSelecionada === "ativos" ? "active" : ""}
            onClick={() => setTabSelecionada("ativos")}
          >
            Ativos
          </button>
          <button
            className={tabSelecionada === "novo" ? "active" : ""}
            onClick={() => setTabSelecionada("novo")}
          >
            Novo
          </button>
        </div>

        {tabSelecionada !== "novo" && (
          <div className="records-section">
            <table className="records-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Ativo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {prontuariosFiltrados.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nome}</td>
                    <td>{p.data}</td>
                    <td>{p.descricao}</td>
                    <td>{p.ativo ? "Sim" : "Não"}</td>
                    <td>
                      <button onClick={() => editarProntuario(p.id)}>Editar</button>
                      <button onClick={() => excluirProntuario(p.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="export-btn" onClick={exportarCSV}>
              Exportar CSV
            </button>
          </div>
        )}

        {tabSelecionada === "novo" && (
          <div className="novo-prontuario">
            <h3>{editandoId ? "Editar Prontuário" : "Novo Prontuário"}</h3>
            <input
              type="text"
              placeholder="Nome"
              value={novoProntuario.nome}
              onChange={(e) => setNovoProntuario({ ...novoProntuario, nome: e.target.value })}
            />
            <input
              type="date"
              value={novoProntuario.data}
              onChange={(e) => setNovoProntuario({ ...novoProntuario, data: e.target.value })}
            />
            <textarea
              placeholder="Descrição"
              value={novoProntuario.descricao}
              onChange={(e) => setNovoProntuario({ ...novoProntuario, descricao: e.target.value })}
            />
            <div className="checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={novoProntuario.ativo}
                  onChange={(e) =>
                    setNovoProntuario({ ...novoProntuario, ativo: e.target.checked })
                  }
                />
                Ativo
              </label>
            </div>
            <button className="salvar-btn" onClick={salvarProntuario}>
              {editandoId ? "Salvar Alterações" : "Adicionar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prontuario;
