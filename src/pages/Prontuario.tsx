import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import NotificationHeader from "../components/NotificationHeader";
import "../styles/Prontuario.css";
import { getCurrentUser } from '../utils/auth';
import { getProntuariosForProfissional, saveProntuarioForProfissional, deleteProntuarioForProfissional, ensureMockData } from '../utils/prontuarioService';
import type { Prontuario as ProntuarioType } from '../utils/prontuarioService';

const Prontuario: React.FC = () => {
  const [pacientes, setPacientes] = useState<ProntuarioType[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<ProntuarioType | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | undefined>(undefined);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'profissional' || !user.profissionalId) {
      // not authorized to view this page -> redirect to dashboard
      window.location.href = '/dashboard';
      return;
    }

    const profissionalId = user.profissionalId;

    // ensure there is example data to improve developer UX
    ensureMockData(profissionalId);

    const lista = getProntuariosForProfissional(profissionalId);
    setPacientes(lista);
    setSelectedPaciente(lista.length > 0 ? lista[0] : null);

    setLoading(false);
  }, []);

  function handleSelectPaciente(p: ProntuarioType) {
    setSelectedPaciente(p);
    setPdfBase64(p.pdfBase64);
    setPdfName(p.pdfBase64 ? `${p.pacienteNome}-prontuario.pdf` : null);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (!selectedPaciente) return;
    const { name, value } = e.currentTarget;
    setSelectedPaciente({ ...selectedPaciente, [name]: value });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Por favor, envie um arquivo PDF.');
      return;
    }
    setPdfName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setPdfBase64(base64);
    };
    reader.readAsDataURL(file);
  }

  function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const user = getCurrentUser();
    if (!user || !user.profissionalId || !selectedPaciente) return;

    const toSave: ProntuarioType = {
      pacienteId: selectedPaciente.pacienteId,
      pacienteNome: selectedPaciente.pacienteNome,
      dataConsulta: selectedPaciente.dataConsulta,
      observacoes: selectedPaciente.observacoes,
      pdfBase64: pdfBase64,
    };

    saveProntuarioForProfissional(user.profissionalId, toSave);

    const updated = getProntuariosForProfissional(user.profissionalId);
    setPacientes(updated);
    setSelectedPaciente(toSave);

    // Simulate sending only PDF + resumo (observacoes) to backend
    const payload = {
      pacienteId: toSave.pacienteId,
      resumo: toSave.observacoes,
      pdfBase64: toSave.pdfBase64,
    };
    console.log('Payload enviado (pdf + resumo):', payload);

    alert('Prontuário salvo com sucesso (pdf + resumo enviados).');
  }

  function handleDelete() {
    const user = getCurrentUser();
    if (!user || !user.profissionalId || !selectedPaciente) return;
    if (!confirm('Confirma exclusão do prontuário deste paciente?')) return;

    deleteProntuarioForProfissional(user.profissionalId, selectedPaciente.pacienteId);
    const updated = getProntuariosForProfissional(user.profissionalId);
    setPacientes(updated);
    setSelectedPaciente(updated.length > 0 ? updated[0] : null);
    alert('Prontuário excluído.');
  }

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="prontuario-container-main">
      <Sidebar />

      <div className="prontuario-content-area">
        <div className="prontuario-header-wrapper">
          <h1 className="prontuario-header-title">Prontuários</h1>
          <NotificationHeader />
        </div>

        <div className="prontuario-page">
          <div className="prontuario-layout">

            <div className="patient-list-card">
              <h2>Lista de Pacientes</h2>
              {pacientes.map((paciente) => (
                <div
                  key={paciente.pacienteId}
                  className={`patient-item ${selectedPaciente && selectedPaciente.pacienteId === paciente.pacienteId ? 'selected' : ''}`}
                  onClick={() => handleSelectPaciente(paciente)}
                >
                  <h3>{paciente.pacienteNome}</h3>
                  <p>ID: {paciente.pacienteId}</p>
                </div>
              ))}

              {pacientes.length === 0 && <p>Nenhum paciente com prontuário encontrado.</p>}
            </div>

            <div className="prontuario-details-card">
              {selectedPaciente ? (
                <>
                  <div className="prontuario-header">
                    <h2>Prontuário - {selectedPaciente.pacienteNome}</h2>
                    <div className="prontuario-header-actions">
                      <button className="export-btn" onClick={() => {
                        if (!selectedPaciente.pdfBase64) { alert('Nenhum PDF anexado.'); return; }
                        const link = document.createElement('a');
                        link.href = 'data:application/pdf;base64,' + selectedPaciente.pdfBase64;
                        link.download = `${selectedPaciente.pacienteNome}-prontuario.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}>Exportar</button>

                      <button className="delete-btn" onClick={handleDelete}>Excluir</button>
                    </div>
                  </div>

                  <form onSubmit={handleSave}>
                    <div className="form-group">
                      <label className="form-label">Data da Consulta</label>
                      <div className="input-with-icon">
                        <input
                          type="text"
                          className="form-input"
                          name="dataConsulta"
                          value={selectedPaciente.dataConsulta}
                          onChange={handleInputChange}
                        />
                        <span className="input-icon">📅</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Observações da Consulta</label>
                      <textarea
                        className="form-textarea"
                        name="observacoes"
                        value={selectedPaciente.observacoes}
                        onChange={handleInputChange}
                        placeholder="Descreva as observações da consulta..."
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Enviar PDF do prontuário (modelo do profissional)</label>
                      <input type="file" accept="application/pdf" onChange={handleFileChange} />
                      {pdfName && <p>Arquivo pronto para enviar: {pdfName}</p>}
                    </div>

                    <div className="prontuario-footer-actions">
                      <button type="button" className="update-btn" onClick={handleSave}>
                        Atualizar
                      </button>
                      <button type="submit" className="save-btn">
                        Salvar Prontuário
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div>
                  <h3>Selecione um paciente para ver ou editar o prontuário.</h3>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Prontuario;