import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import NotificationHeader from "../components/NotificationHeader";
import "../styles/Financeiro.css";

const Financeiro: React.FC = () => {
    const [activeTab, setActiveTab] = useState("pagamentos");

    // Dados simulados (Aqui tu pode só colocar o do back FELIPE)
    const pagamentos = [
        {
            paciente: "João Silva",
            servico: "Psicólogo",
            valor: "R$ 200,00",
            vencimento: "10/11/2025",
            status: "Pendente",
        },
        {
            paciente: "Maria Souza",
            servico: "Retorno ao terapeuta",
            valor: "R$ 100,00",
            vencimento: "05/11/2025",
            status: "Pago",
        },
        {
            paciente: "Carlos Pereira",
            servico: "Testes psicológicos",
            valor: "R$ 150,00",
            vencimento: "12/11/2025",
            status: "Pendente",
        },
    ];

    const [historico, setHistorico] = useState([
        {
            paciente: "João Silva",
            valor: "R$ 200,00",
            profissional: "Dra. Luciana",
            data: "05/11/2025",
        },
        {
            paciente: "Maria Souza",
            valor: "R$ 150,00",
            profissional: "Dr. Herlon",
            data: "07/11/2025",
        },
        {
            paciente: "Carlos Pereira",
            valor: "R$ 100,00",
            profissional: "Dra. Ana",
            data: "08/11/2025",
        },
    ]);

    const [balanco, setBalanco] = useState({
        receita: "R$ 12.000,00",
        despesas: "R$ 4.500,00",
        lucro: "R$ 7.500,00",
        consultas: "86",
    });

    const [repasse, setRepasse] = useState([
        { profissional: "Dra. Ana Lima", faturamento: "R$ 3.000,00", repasse: "R$ 600,00" },
        { profissional: "Dr. Pedro Costa", faturamento: "R$ 5.500,00", repasse: "R$ 1.100,00" },
        { profissional: "Dr. Antonio Peres", faturamento: "R$ 2500,00", repasse: "R$ 750" }
    ]);


    return (
        <div className="financeiro-container">
            <Sidebar />

            <div className="financeiro-main">
                {/* Cabeçalho da página */}
                <header className="financeiro-header">
                    <h1 className="page-title">Financeiro</h1>
                    <NotificationHeader />
                </header>

                {/* Conteúdo */}
                <section className="financeiro-content">
                    {/* Botões de navegação */}
                    <div className="financeiro-tabs">
                        <button
                            className={activeTab === "pagamentos" ? "active" : ""}
                            onClick={() => setActiveTab("pagamentos")}
                        >
                            Pagamentos
                        </button>
                        <button
                            className={activeTab === "histórico" ? "active" : ""}
                            onClick={() => setActiveTab("histórico")}
                        >
                            Histórico
                        </button>
                        <button
                            className={activeTab === "balanco" ? "active" : ""}
                            onClick={() => setActiveTab("balanco")}
                        >
                            Balanço
                        </button>
                        <button
                            className={activeTab === "repasse" ? "active" : ""}
                            onClick={() => setActiveTab("repasse")}
                        >
                            Repasse
                        </button>
                    </div>

                    {/* Seções dinâmicas */}
                    <div className="financeiro-section">
                        {activeTab === "pagamentos" && (
                            <div className="pagamentos">
                                <input
                                    type="text"
                                    placeholder="Buscar paciente por nome..."
                                    className="search-box"
                                />

                                <table className="financeiro-table">
                                    <thead>
                                        <tr>
                                            <th>Paciente</th>
                                            <th>Serviço</th>
                                            <th>Valor</th>
                                            <th>Vencimento</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pagamentos.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.paciente}</td>
                                                <td>{item.servico}</td>
                                                <td>{item.valor}</td>
                                                <td>{item.vencimento}</td>
                                                <td
                                                    className={
                                                        item.status === "Pago" ? "status-pago" : "status-pendente"
                                                    }
                                                >
                                                    {item.status}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}



                        {activeTab === "histórico" && (
                            <div className="financeiro-content historico">
                                <div className="historico-header">
                                    <h2>Histórico de transações</h2>
                                    <button className="exportar-btn">Exportar relatório financeiro</button>
                                </div>

                                <div className="historico-tabela-container">
                                    {historico.length > 0 ? (
                                        <table className="financeiro-table">
                                            <thead>
                                                <tr>
                                                    <th>Paciente</th>
                                                    <th>Valor</th>
                                                    <th>Profissional</th>
                                                    <th>Data</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {historico.map((transacao, index) => (
                                                    <tr key={index}>
                                                        <td>{transacao.paciente}</td>
                                                        <td>{transacao.valor}</td>
                                                        <td>{transacao.profissional}</td>
                                                        <td>{transacao.data}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="historico-vazio">
                                            Nenhuma transação registrada ainda.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}




                        {activeTab === "balanco" && (
                            <div className="financeiro-section balanco">
                                <h2>Balanço mensal</h2>

                                <div className="balanco-cards">
                                    <div className="card">
                                        <h3>Receita</h3>
                                        <p>{balanco.receita}</p>
                                    </div>

                                    <div className="card">
                                        <h3>Despesas</h3>
                                        <p>{balanco.despesas}</p>
                                    </div>

                                    <div className="card">
                                        <h3>Lucro</h3>
                                        <p>{balanco.lucro}</p>
                                    </div>

                                    <div className="card">
                                        <h3>Consultas</h3>
                                        <p>{balanco.consultas}</p>
                                    </div>
                                </div>
                            </div>
                        )}




                        {activeTab === "repasse" && (
                            <div className="repasse">
                                <h2>Repasse aos profissionais</h2>

                                <div className="repasse-tabela-container">
                                    {repasse.length > 0 ? (
                                        <table className="financeiro-table">
                                            <thead>
                                                <tr>
                                                    <th>Profissional</th>
                                                    <th>Faturamento</th>
                                                    <th>Repasse</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {repasse.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.profissional}</td>
                                                        <td>{item.faturamento}</td>
                                                        <td>{item.repasse}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="repasse-vazio">
                                            Nenhum repasse registrado ainda.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Financeiro;
