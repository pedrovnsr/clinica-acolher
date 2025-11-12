import React from "react";
import { FaTachometerAlt, FaUserMd, FaUsers, FaCalendarAlt, FaMoneyBillWave, FaFileMedical, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
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
          <li><Link to="/dashboard"><FaTachometerAlt /><span>Dashboard</span></Link></li>
          <li><Link to="/agenda"><FaCalendarAlt /><span>Agenda</span></Link></li>
          <li><Link to="/patients"><FaUsers /><span>Pacientes</span></Link></li>
          <li><Link to="/prontuario"><FaFileMedical /><span>Prontuários</span></Link></li>
          <li><Link to="/professionals"><FaUserMd /><span>Profissionais</span></Link></li>
          <li><Link to="/financeiro"><FaMoneyBillWave /><span>Financeiro</span></Link></li>
          <li><Link to="/configuracoes"><FaCog /><span>Configurações</span></Link></li>
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
