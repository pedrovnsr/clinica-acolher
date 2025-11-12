import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";
import { FaBell } from "react-icons/fa";
import { FaUserInjured, FaCalendarCheck, FaDollarSign, FaUserMd } from "react-icons/fa";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <h1 className="page-title">Dashboard</h1>

          <div className="header-right">
            <FaBell className="notification-icon" />

            <div className="user-info">
              <div className="user-details">
                <span className="user-name">Dra. Anne Caroline</span>
                <span className="user-role">Diretora</span>
              </div>
              <div className="user-photo">Photo</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="dashboard-content">
          <div className="cards-grid">
            <div className="dashboard-card">
              <FaUserInjured className="card-icon" />
              <div className="card-info">
                <h3>Pacientes</h3>
                <p>128 ativos hoje</p>
              </div>
            </div>

            <div className="dashboard-card">
              <FaCalendarCheck className="card-icon" />
              <div className="card-info">
                <h3>Consultas</h3>
                <p>312 este mês</p>
              </div>
            </div>

            <div className="dashboard-card">
              <FaDollarSign className="card-icon" />
              <div className="card-info">
                <h3>Receita</h3>
                <p>R$ 45.230</p>
              </div>
            </div>

            <div className="dashboard-card">
              <FaUserMd className="card-icon" />
              <div className="card-info">
                <h3>Profissionais</h3>
                <p>18 ativos</p>
              </div>
            </div>
          </div>

          <button className="export-button">Exportar dados</button>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
