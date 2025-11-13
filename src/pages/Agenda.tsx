import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import NotificationHeader from '../components/NotificationHeader';
import "../styles/Agenda.css";

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

const Agenda = () => {
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const calendarDays = [
    { day: 26, isFaded: true }, { day: 27, isFaded: true }, { day: 28, isFaded: true }, { day: 29, isFaded: true }, { day: 30, isFaded: true }, { day: 31, isFaded: true }, { day: 1 },
    { day: 2 }, { day: 3 }, { day: 4 }, { day: 5, hasEvent: true }, { day: 6 }, { day: 7, hasEvent: true }, { day: 8 },
    { day: 9 }, { day: 10 }, { day: 11 }, { day: 12, isSelected: true }, { day: 13, hasEvent: true }, { day: 14 }, { day: 15 },
    { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 }, { day: 21 }, { day: 22 },
    { day: 23, hasEvent: true }, { day: 24 }, { day: 25 }, { day: 26 }, { day: 27 }, { day: 28, hasEvent: true }, { day: 29, hasEvent: true },
    { day: 30 }, { day: 1, isFaded: true }, { day: 2, isFaded: true }, { day: 3, isFaded: true }, { day: 4, isFaded: true }, { day: 5, isFaded: true }, { day: 6, isFaded: true },
  ];

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
                <form>
                  <div className="form-group">
                    <label className="form-label">Paciente</label>
                    <select className="form-input" defaultValue="">
                      <option value="" disabled>Selecione o paciente...</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Profissional</label>
                    <select className="form-input" defaultValue="">
                      <option value="" disabled>Selecione o profissional...</option>
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
                    <input type="text" className="form-input" defaultValue="11 / 12 / 2025" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Horário</label>
                    <input type="text" className="form-input" placeholder="-- : --" />
                  </div>
                  <button type="submit" className="form-button">Agendar Consulta</button>
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
