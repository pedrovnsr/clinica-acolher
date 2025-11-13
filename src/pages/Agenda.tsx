import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NotificationHeader from '../components/NotificationHeader';
import "../styles/Agenda.css";
import { fetchProfessionals, fetchPatients, createAppointment } from '../controller/api';

const StatusDot = ({ color }: { color: string }) => (
  <span className="status-dot" style={{ backgroundColor: color }}></span>
);

const CalendarDay = ({ day, isSelected, hasEvent, isFaded }: { day: number | string, isSelected?: boolean, hasEvent?: boolean, isFaded?: boolean }) => {
  const classes = `calendar-day ${isSelected ? 'selected' : ''} ${isFaded ? 'faded' : ''}`;
  return (
    <div className={classes}>
      {day}
      {hasEvent && <div className="event-dot"></div>}
    </div>
  );
};

const Agenda: React.FC = () => {
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const calendarDays = [
    { day: 26, isFaded: true }, { day: 27, isFaded: true }, { day: 28, isFaded: true }, { day: 29, isFaded: true }, { day: 30, isFaded: true }, { day: 31, isFaded: true }, { day: 1 },
    { day: 2 }, { day: 3 }, { day: 4 }, { day: 5, hasEvent: true }, { day: 6 }, { day: 7, hasEvent: true }, { day: 8 },
    { day: 9 }, { day: 10 }, { day: 11 }, { day: 12, isSelected: true }, { day: 13, hasEvent: true }, { day: 14 }, { day: 15 },
    { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 }, { day: 21 }, { day: 22 },
    { day: 23, hasEvent: true }, { day: 24 }, { day: 25 }, { day: 26 }, { day: 27 }, { day: 28, hasEvent: true }, { day: 29, hasEvent: true },
    { day: 30 }, { day: 1, isFaded: true }, { day: 2, isFaded: true }, { day: 3, isFaded: true }, { day: 4, isFaded: true }, { day: 5, isFaded: true }, { day: 6, isFaded: true },
  ];

  const [professionals, setProfessionals] = useState<Array<{ id: number; name: string }>>([]);
  const [patients, setPatients] = useState<Array<{ id: number; name: string }>>([]);
  const [formAppointment, setFormAppointment] = useState({
    patientId: '',
    professionalId: '',
    appointmentDate: '',
    appointmentTime: '',
    amount: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const professionalsResponse = await fetchProfessionals();
        setProfessionals(professionalsResponse.data || []);
        const patientsResponse = await fetchPatients();
        setPatients(patientsResponse.data || []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchData();
  }, []);

  // yyyy-mm-dd → dd-MM-yyyy
  function formatDateToDDMMYYYY(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }

  // HH:mm:ss → HH:mm
  function formatTime(timeString: string): string {
    if (!timeString) return '';
    return timeString.slice(0, 5);
  }

  // Junta data e hora no formato dd-MM-yyyy HH:mm
  function buildAppointmentDateTime(date: string, time: string): string {
    const formattedDate = formatDateToDDMMYYYY(date);
    const formattedTime = formatTime(time);
    return formattedDate && formattedTime ? `${formattedDate} ${formattedTime}` : '';
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target as HTMLInputElement;
    setFormAppointment(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const appointmentDateTime = buildAppointmentDateTime(
      formAppointment.appointmentDate,
      formAppointment.appointmentTime
    );

    if (!formAppointment.patientId || !formAppointment.professionalId || !appointmentDateTime || !formAppointment.amount) {
      alert("Preencha todos os campos obrigatórios antes de agendar.");
      return;
    }

    setIsSubmitting(true);

    const payloadToSend = {
      patientId: formAppointment.patientId,
      professionalId: formAppointment.professionalId,
      appointmentDate: appointmentDateTime,
      amount: parseFloat(formAppointment.amount),
    };

    try {
      await createAppointment(payloadToSend);
      alert("Consulta agendada com sucesso!");
      setFormAppointment({
        patientId: '',
        professionalId: '',
        appointmentDate: '',
        appointmentTime: '',
        amount: '',
      });
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      alert("Ocorreu um erro ao agendar a consulta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // === Renderização ===
  return (
    <div className="agenda-container-main">
      <Sidebar />
      <div className="agenda-content-wrapper">
        {/* Header */}
        <div className="patients-header">
          <h1>Agenda</h1>
          <NotificationHeader />
        </div>

        <div className="agenda-page">
          <div className="agenda-container">
            <div className="agenda-main-content">
              <h2 className="card-title">Calendário</h2>
              <div className="calendar-grid">
                {weekDays.map(day => <div key={day} className="calendar-weekday">{day}</div>)}
                {calendarDays.map((dayInfo, index) => (
                  <CalendarDay key={index} {...dayInfo} />
                ))}
              </div>
            </div>

            <div className="agenda-sidebar">
              <div className="form-card">
                <h2 className="card-title">Agendar Consulta</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Paciente</label>
                    <select
                      name="patientId"
                      className="form-input"
                      value={formAppointment.patientId}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Selecione o paciente...</option>
                      {patients?.map((patient) => (
                        <option key={patient.id} value={patient.id}>{patient.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Profissional</label>
                    <select
                      name="professionalId"
                      className="form-input"
                      value={formAppointment.professionalId}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Selecione o profissional...</option>
                      {professionals?.map((professional) => (
                        <option key={professional.id} value={professional.id}>{professional.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sala</label>
                    <select className="form-input" defaultValue="">
                      <option value="" disabled>Selecione a sala...</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Data</label>
                    <input
                      type="date"
                      name="appointmentDate"
                      className="form-input"
                      value={formAppointment.appointmentDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Horário</label>
                    <input
                      type="time"
                      name="appointmentTime"
                      className="form-input"
                      value={formAppointment.appointmentTime}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Valor (R$)</label>
                    <input
                      type="number"
                      name="amount"
                      className="form-input"
                      placeholder="0.00"
                      step="0.01"
                      value={formAppointment.amount}
                      onChange={handleChange}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="form-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Agendando..." : "Agendar Consulta"}
                  </button>
                </form>
              </div>

              <div className="legend-card">
                <h3 className="card-title">Legenda de Status</h3>
                <div>
                  <div className="legend-item">
                    <StatusDot color="#5CB85C" /> Confirmado
                  </div>
                  <div className="legend-item">
                    <StatusDot color="#F0AD4E" /> Pendente
                  </div>
                  <div className="legend-item">
                    <StatusDot color="#D9534F" /> Cancelado
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
