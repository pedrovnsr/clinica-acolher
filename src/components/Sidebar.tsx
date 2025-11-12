import React from "react";
import { FaTachometerAlt, FaUserMd, FaUsers, FaCalendarAlt, FaMoneyBillWave, FaFileMedical, FaCog, FaSignOutAlt } from "react-icons/fa";
import "../styles/sidebar.css";
import logo from "../assets/logo.png";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo Clínica" className="sidebar-logo" />
        <h2 className="clinic-name">Clínica Acolher</h2>
      </div>

      <div className="sidebar-user">
        <p className="user-name1"> Dra. Anne Caroline</p>
        <span className="user-role1">Diretora</span>
      </div>

      <nav className="sidebar-menu">
        <ul>
          <li><FaTachometerAlt /><span>Dashboard</span></li>
          <li><FaUserMd /><span>Profissionais</span></li>
          <li><FaUsers /><span>Pacientes</span></li>
          <li><FaCalendarAlt /><span>Agenda</span></li>
          <li><FaMoneyBillWave /><span>Financeiro</span></li>
          <li><FaFileMedical /><span>Prontuários</span></li>
          <li><FaCog /><span>Configurações</span></li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <FaSignOutAlt /> <span onClick={() => window.location.href = "/"}>Sair</span>
        </button>
      </div>
    </aside>

  );
};

export default Sidebar;
