import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import NotificationHeader from "../components/NotificationHeader";
import "../styles/Prontuario.css";
import {
  fetchPatientsByProfessional,
  fetchAppointmentsByProfessionalAndPatient,
  createAppointmentRecord,
  fetchPatientRecordByAppointment,
  fetchPatientRecordFile,
  updatePatientRecord,
  deletePatientRecord
} from '../controller/api';

type Paciente = {
  id: number;
  nome: string;
  cpf: string;
  selected?: boolean;
};

type Consulta = {
  id: number;
  pacienteId: number;
  professionalId?: number;
  appointmentDate?: string;
  issueDate?: string;
  amount?: number | null;
  data: string;
  observacoes: string;
  arquivo?: File | null;
  pdfUrl?: string | null;
  recordId?: number | null;
};

const Prontuario: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState<number | null>(null);

  useEffect(() => {
    function getUserIdFromToken(token?: string | null): number | null {
      if (!token) return null;
      try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        return typeof payload.userId === 'number' ? payload.userId : (payload.userId ? Number(payload.userId) : null);
      } catch (e) {
        console.warn('[Prontuario] erro ao decodificar token JWT:', e);
        return null;
      }
    }

    (async () => {
      setLoading(true);
      const storedId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      let profId: number | null = null;
      if (storedId) profId = Number(storedId);
      else profId = getUserIdFromToken(token);

      if (!profId) {
        console.warn('[Prontuario] professionalId não encontrado. Configure localStorage.userId ou forneça token válido.');
        setLoading(false);
        return;
      }

      setProfessionalId(profId);

      try {
        const response = await fetchPatientsByProfessional(profId);
        const pacientesData: Paciente[] = (response.data || []).map((p: any) => ({
          id: p.id,
          nome: p.name,
          cpf: p.cpf,
          selected: false,
        }));
        if (pacientesData.length > 0) pacientesData[0].selected = true;
        setPacientes(pacientesData);
      } catch (err) {
        console.error('[Prontuario] erro ao buscar pacientes:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const consultasDoPaciente = pacienteSelecionado ? consultas.filter(c => c.pacienteId === pacienteSelecionado.id) : [];
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(null);

  const [formData, setFormData] = useState({
    data: '',
    observacoes: '',
  });
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  useEffect(() => {
    if (pacientes.length > 0) {
      const first = pacientes.find(p => p.selected) || pacientes[0];
      setPacienteSelecionado(first || null);
    } else {
      setPacienteSelecionado(null);
    }
  }, [pacientes]);

  useEffect(() => {
    if (!pacienteSelecionado) {
      setConsultaSelecionada(null);
      return;
    }

    const consultasDoPacienteAtual = consultas.filter(c => c.pacienteId === pacienteSelecionado.id);

    if (!consultaSelecionada) {
      setConsultaSelecionada(consultasDoPacienteAtual[0] || null);
      return;
    }

    const existe = consultasDoPacienteAtual.find(c => c.id === consultaSelecionada.id);
    if (!existe) {
      setConsultaSelecionada(consultasDoPacienteAtual[0] || null);
    }
  }, [pacienteSelecionado, consultas]);

  useEffect(() => {
    setFormData({
      data: consultaSelecionada?.data || '',
      observacoes: consultaSelecionada?.observacoes || '',
    });
    setSelectedFileName(consultaSelecionada?.arquivo ? consultaSelecionada.arquivo.name || null : null);
  }, [consultaSelecionada]);

  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  async function handleSelectPaciente(p: Paciente) {
    setPacientes(prev => prev.map(x => ({ ...x, selected: x.id === p.id })));
    setPacienteSelecionado(p);

    if (!professionalId) {
      setConsultas([]);
      setConsultaSelecionada(null);
      setFormData({ data: '', observacoes: '' });
      return;
    }

    try {
      const resp = await fetchAppointmentsByProfessionalAndPatient(professionalId, p.id);
      const appointments: any[] = resp.data || [];

      const mapped: Consulta[] = appointments.map(a => ({
        id: a.id,
        pacienteId: a.patientId,
        professionalId: a.professionalId,
        appointmentDate: a.appointmentDate,
        issueDate: a.issueDate,
        amount: a.amount ?? null,
        data: a.appointmentDate || '',
        observacoes: a.issueDate ? `Emitido: ${a.issueDate}` : '',
        arquivo: null,
        pdfUrl: (a as any).pdfUrl ?? null,
        recordId: null,
      }));

      setConsultas(mapped);

      if (mapped[0]) {
        await handleSelectConsulta(mapped[0]);
      } else {
        setConsultaSelecionada(null);
      }
    } catch (err) {
      console.error('[Prontuario] erro ao buscar consultas:', err);
      setConsultas([]);
      setConsultaSelecionada(null);
    }
  }

  async function handleSelectConsulta(c: Consulta) {
    try {
      const resp = await fetchPatientRecordByAppointment(c.id);
      const record = resp?.data;
      const observacoesBackend = record?.appointmentSummary ?? c.observacoes;
      const recordId = record?.id ?? null;

      const updated: Consulta = { ...c, observacoes: observacoesBackend, recordId };
      setConsultas(prev => prev.map(x => (x.id === c.id ? updated : x)));
      setConsultaSelecionada(updated);
      setSelectedFileName(updated.arquivo ? updated.arquivo.name || null : null);
    } catch (err) {
      console.warn('[Prontuario] erro ao buscar patient record, usando dados locais', err);
      setConsultaSelecionada(c);
      setSelectedFileName(c.arquivo ? c.arquivo.name || null : null);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!consultaSelecionada) return;
    const file = e.target.files?.[0] ?? null;
    setConsultas(prev =>
      prev.map(c =>
        c.id === consultaSelecionada.id
          ? { ...c, arquivo: file, data: formData.data, observacoes: formData.observacoes }
          : c,
      ),
    );
    setConsultaSelecionada(prev =>
      prev && prev.id === consultaSelecionada.id
        ? { ...prev, arquivo: file, data: formData.data, observacoes: formData.observacoes }
        : prev,
    );
    setSelectedFileName(file ? file.name : null);
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleCriarRegistro() {
    if (!consultaSelecionada) {
      alert('Selecione uma consulta antes de criar o registro.');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('appointmentId', String(consultaSelecionada.id));
      payload.append('appointmentSummary', formData.observacoes || '');
      payload.append('recordDate', formData.data || '');
      if (consultaSelecionada.arquivo) {
        payload.append('file', consultaSelecionada.arquivo);
      }

      const resp = await createAppointmentRecord(payload);
      const created = resp.data;
      setConsultaSelecionada(prev => prev ? { ...prev, observacoes: created.appointmentSummary ?? prev.observacoes, recordId: created.id ?? prev.recordId } : prev);
      setConsultas(prev => prev.map(c => c.id === consultaSelecionada!.id ? { ...c, observacoes: created.appointmentSummary ?? c.observacoes, recordId: created.id ?? c.recordId } : c));
      setFormData(prev => ({ ...prev, observacoes: created.appointmentSummary ?? prev.observacoes }));
      alert('Registro criado com sucesso.');
    } catch (err) {
      console.error('[Prontuario] erro ao criar registro:', err);
      alert('Erro ao criar registro. Veja console para detalhes.');
    }
  }

  async function handleAtualizarRegistro() {
    if (!consultaSelecionada || !consultaSelecionada.recordId) {
      alert('Nenhum registro existente para atualizar.');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('id', String(consultaSelecionada.recordId));
      payload.append('appointmentId', String(consultaSelecionada.id));
      payload.append('appointmentSummary', formData.observacoes || '');
      payload.append('recordDate', formData.data || '');
      if (consultaSelecionada.arquivo) {
        payload.append('file', consultaSelecionada.arquivo);
      }

      const resp = await updatePatientRecord(payload);
      const updated = resp.data;
      setConsultaSelecionada(prev => prev ? { ...prev, observacoes: updated.appointmentSummary ?? prev.observacoes, recordId: updated.id ?? prev.recordId } : prev);
      setConsultas(prev => prev.map(c => c.id === consultaSelecionada!.id ? { ...c, observacoes: updated.appointmentSummary ?? c.observacoes, recordId: updated.id ?? c.recordId } : c));
      setFormData(prev => ({ ...prev, observacoes: updated.appointmentSummary ?? prev.observacoes }));
      alert('Registro atualizado com sucesso.');
    } catch (err) {
      console.error('[Prontuario] erro ao atualizar registro:', err);
      alert('Erro ao atualizar registro. Veja console para detalhes.');
    }
  }

  async function handleExcluirConsulta() {
    if (!consultaSelecionada) return;
    if (!window.confirm('Deseja excluir Prontuario?')) return;

    try {
      // Se existir registro vinculado, deleta no backend
      if (consultaSelecionada.recordId) {
        await deletePatientRecord(consultaSelecionada.recordId);
      }

      // Remove consulta do estado local
      setConsultas(prev => prev.filter(c => c.id !== consultaSelecionada.id));
      const próximas = consultas.filter(c => c.pacienteId === (pacienteSelecionado?.id || -1) && c.id !== consultaSelecionada.id);
      const nova = próximas[0] || null;
      setConsultaSelecionada(nova);
      setFormData({ data: nova?.data || '', observacoes: nova?.observacoes || '' });
      setSelectedFileName(nova?.arquivo ? nova.arquivo.name || null : null);

      alert('Prontuario excluída com sucesso.');
    } catch (err) {
      console.error('[Prontuario] erro ao excluir consulta:', err);
      alert('Erro ao excluir consulta. Veja console para detalhes.');
    }
  }

  async function handleVisualizarPDF() {
    if (!consultaSelecionada) {
      alert('Nenhuma consulta selecionada.');
      return;
    }

    if (consultaSelecionada.arquivo) {
      const url = URL.createObjectURL(consultaSelecionada.arquivo);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(url);
      setPdfModalOpen(true);
      return;
    }

    if (consultaSelecionada.recordId) {
      try {
        const resp = await fetchPatientRecordFile(consultaSelecionada.recordId);
        const blob = resp.data as Blob;
        const url = URL.createObjectURL(blob);
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        setPdfUrl(url);
        setPdfModalOpen(true);
      } catch (err) {
        console.error('[Prontuario] erro ao baixar arquivo do backend:', err);
        alert('Sem pdf disponível para visualização.');
      }
      return;
    }

    alert('Nenhum PDF anexado para visualizar.');
  }

  function handleClosePdfModal() {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfModalOpen(false);
    setPdfUrl(null);
  }

  const pacientesUnicos = Array.from(new Map(pacientes.map(p => [p.id, p])).values());

  if (loading) {
    return (
      <div className="prontuario-container-main">
        <Sidebar />
        <div className="prontuario-content-area">
          <div className="prontuario-header-wrapper">
            <h1 className="prontuario-header-title">Prontuários</h1>
            <NotificationHeader />
          </div>
          <div className="prontuario-page">
            <p>Carregando pacientes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (pacientesUnicos.length === 0) {
    return (
      <div className="prontuario-container-main">
        <Sidebar />
        <div className="prontuario-content-area">
          <div className="prontuario-header-wrapper">
            <h1 className="prontuario-header-title">Prontuários</h1>
            <NotificationHeader />
          </div>
          <div className="prontuario-page">
            <p>Nenhum paciente encontrado.</p>
          </div>
        </div>
      </div>
    );
  }

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
              {pacientesUnicos.map((paciente) => (
                <div
                  key={paciente.id}
                  className={`patient-item ${paciente.selected ? 'selected' : ''}`}
                  onClick={() => handleSelectPaciente(paciente)}
                  role="button"
                  tabIndex={0}
                >
                  <h3>{paciente.nome}</h3>
                  <p>{paciente.cpf}</p>
                </div>
              ))}
            </div>

            <div className="prontuario-details-card">
              <div className="prontuario-header">
                <h2>
                  Prontuário - {pacienteSelecionado?.nome}
                  {consultaSelecionada ? ` • ${consultaSelecionada.data}` : ' • nenhuma consulta selecionada'}
                </h2>
                <div className="prontuario-header-actions">
                  <button
                    className="view-pdf-btn"
                    type="button"
                    onClick={handleVisualizarPDF}
                    disabled={!consultaSelecionada?.arquivo && !consultaSelecionada?.recordId}
                  >
                    Visualizar PDF
                  </button>
                  <button
                    className="export-btn"
                    type="button"
                    onClick={() => {
                      if (consultaSelecionada?.arquivo) {
                        alert(`Exportar arquivo: ${consultaSelecionada.arquivo.name}`);
                      } else {
                        alert('Nenhum PDF anexado para exportar.');
                      }
                    }}
                  >
                    Exportar
                  </button>
                  <button
                    className="delete-btn"
                    type="button"
                    onClick={handleExcluirConsulta}
                    disabled={!consultaSelecionada}
                  >
                    Excluir
                  </button>
                </div>
              </div>

              <div className="prontuario-right-columns">
                <aside className="consultations-column">
                  <h3>Consultas de {pacienteSelecionado?.nome}</h3>
                  <div className="consult-list">
                    {consultasDoPaciente.length === 0 && <p>Nenhuma consulta encontrada.</p>}
                    {consultasDoPaciente.map(consulta => (
                      <div
                        key={consulta.id}
                        className={`consulta-item ${consultaSelecionada?.id === consulta.id ? 'selected-consulta' : ''}`}
                        onClick={() => handleSelectConsulta(consulta)}
                        role="button"
                        tabIndex={0}
                      >
                        <span className="consulta-data">{consulta.data}</span>
                        <span className="consulta-summary">{consulta.observacoes}</span>
                      </div>
                    ))}
                  </div>
                </aside>

                <section className="prontuario-form-column">
                  <form onSubmit={e => e.preventDefault()}>
                    <div className="form-group">
                      <label className="form-label">Data da Consulta</label>
                      <div className="input-with-icon">
                        <input
                          type="text"
                          name="data"
                          className="form-input"
                          value={formData.data}
                          onChange={handleFormChange}
                          disabled={!consultaSelecionada}
                        />
                        <span className="input-icon">📅</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Observações da Consulta</label>
                      <textarea
                        name="observacoes"
                        className="form-textarea"
                        placeholder="Descreva as observações da consulta..."
                        value={formData.observacoes}
                        onChange={handleFormChange}
                        disabled={!consultaSelecionada}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Anexar PDF (opcional)</label>
                      <div className="file-upload">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          disabled={!consultaSelecionada}
                        />
                        <div className="file-name">
                          {selectedFileName ? `Arquivo: ${selectedFileName}` : 'Nenhum arquivo anexado'}
                        </div>
                      </div>
                    </div>

                    <div className="prontuario-footer-actions">
                      {consultaSelecionada?.recordId ? (
                        <button type="button" className="save-btn" onClick={handleAtualizarRegistro}>
                          Atualizar Registro
                        </button>
                      ) : (
                        <button type="button" className="save-btn" onClick={handleCriarRegistro}>
                          Criar Registro
                        </button>
                      )}
                    </div>
                  </form>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      {pdfModalOpen && (
        <div className="pdf-modal-overlay" onClick={handleClosePdfModal}>
          <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h3>Visualizar PDF - {consultaSelecionada?.arquivo?.name ?? (consultaSelecionada?.recordId ? `Registro #${consultaSelecionada.recordId}` : '')}</h3>
              <button className="pdf-modal-close" onClick={handleClosePdfModal}>✕</button>
            </div>
            <div className="pdf-modal-body">
              <iframe
                src={pdfUrl || ''}
                title="PDF Viewer"
                className="pdf-viewer"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prontuario;
