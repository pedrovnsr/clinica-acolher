import Sidebar from '../components/Sidebar';
import NotificationHeader from "../components/NotificationHeader";
import "../styles/Prontuario.css";

const Prontuario = () => {
  const pacientes = [
    { nome: 'João Silva', cpf: 'CPF: 123.456.789-00', selected: true },
    { nome: 'Maria Santos', cpf: 'CPF: 987.654.321-00', selected: false },
    { nome: 'Pedro Oliveira', cpf: 'CPF: 456.789.123-00', selected: false },
  ];

  return (
    <div className="prontuario-container-main">
      <Sidebar />

      <div className="prontuario-content-area">
        
        {/* Cabeçalho fixo com espaçamento */}
        <div className="prontuario-header-wrapper">
          <h1 className="prontuario-header-title">Prontuários</h1>
          <NotificationHeader />
        </div>

        <div className="prontuario-page">
          <div className="prontuario-layout">
            
            {/* Lista de pacientes */}
            <div className="patient-list-card">
              <h2>Lista de Pacientes</h2>
              {pacientes.map((paciente, index) => (
                <div
                  key={index}
                  className={`patient-item ${paciente.selected ? 'selected' : ''}`}
                >
                  <h3>{paciente.nome}</h3>
                  <p>{paciente.cpf}</p>
                </div>
              ))}
            </div>

            {/* Detalhes do prontuário */}
            <div className="prontuario-details-card">
              <div className="prontuario-header">
                <h2>Prontuário - João Silva</h2>
                <div className="prontuario-header-actions">
                  <button className="export-btn">Exportar</button>
                  <button className="delete-btn">Excluir</button>
                </div>
              </div>

              <form>
                <div className="form-group">
                  <label className="form-label">Data da Consulta</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      className="form-input"
                      defaultValue="11 / 12 / 2025"
                    />
                    <span className="input-icon">📅</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Profissional</label>
                  <select className="form-select" defaultValue="">
                    <option value="" disabled>
                      Selecione o profissional...
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Observações da Consulta</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Descreva as observações da consulta..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Próxima Consulta</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="mm / dd / yyyy"
                    />
                    <span className="input-icon">📅</span>
                  </div>
                </div>

                <div className="prontuario-footer-actions">
                  <button type="button" className="update-btn">
                    Atualizar
                  </button>
                  <button type="submit" className="save-btn">
                    Salvar Prontuário
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prontuario;