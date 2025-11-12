import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import NotificationHeader from "../components/NotificationHeader";
import "../styles/Patients.css";

const Patients: React.FC = () => {
    const [isDependent, setIsDependent] = useState(false);

    return (
        <div className="patients-container">
            <Sidebar />

            <main className="patients-main">
                <div className="patients-header">
                    <h1>Cadastro de pacientes</h1>
                    <NotificationHeader />
                </div>

                <form className="patients-form">
                    <div className="form-group">
                        <label>Nome completo</label>
                        <input type="text" name="name" placeholder="Digite o nome completo" />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Sexo</label>
                            <select name="sex" defaultValue="">
                                <option value="" disabled>
                                    Selecione
                                </option>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Data de nascimento</label>
                            <input type="date" name="birthDate" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>CPF</label>
                            <input type="text" name="cpf" placeholder="Digite o CPF" />
                        </div>

                        <div className="form-group">
                            <label>RG</label>
                            <input type="text" name="rg" placeholder="Digite o RG" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Telefone</label>
                            <input type="text" name="telefone" placeholder="Digite o telefone" />
                        </div>

                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="email" name="email" placeholder="Digite o e-mail" />
                        </div>
                    </div>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isDependent"
                            checked={isDependent}
                            onChange={(e) => setIsDependent(e.target.checked)}
                        />
                        <label htmlFor="isDependent">O paciente possui responsável?</label>
                    </div>

                    {isDependent && (
                        <div className="responsavel-section">
                            <h2>Informações do responsável</h2>

                            <div className="form-group">
                                <label>Nome completo</label>
                                <input type="text" name="responsible_name" placeholder="Digite o nome" />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>CPF</label>
                                    <input type="text" name="responsible_cpf" placeholder="Digite o CPF" />
                                </div>

                                <div className="form-group">
                                    <label>RG</label>
                                    <input type="text" name="responsible_rg" placeholder="Digite o RG" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Parentesco</label>
                                    <input type="text" name="relationship" placeholder="Digite o parentesco" />
                                </div>

                                <div className="form-group">
                                    <label>Telefone</label>
                                    <input type="text" name="responsible_telephone" placeholder="Digite o telefone" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>E-mail</label>
                                <input type="email" name="responsible_email" placeholder="Digite o e-mail" />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="submit-btn">
                        Cadastrar paciente
                    </button>
                </form>
            </main>
        </div>
    );
};

export default Patients;
