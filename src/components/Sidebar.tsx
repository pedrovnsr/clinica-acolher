import type { FC } from "react";
import { FaTachometerAlt, FaUserMd, FaUsers, FaCalendarAlt, FaMoneyBillWave, FaFileMedical, FaCog, FaSignOutAlt } from "react-icons/fa";
import "../styles/sidebar.css";
import logo from "../assets/logo.png";
import { getCurrentUser } from '../utils/auth';
import type { AppUser } from '../utils/auth';

const Sidebar: FC = () => {
  const user: AppUser | null = getCurrentUser();
  const displayName = user?.name ? ` ${user.name}` : ' Dra. Anne Caroline';
  const displayRole = user?.role ? user.role : 'Diretora';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo Clínica" className="sidebar-logo" />
        <h2 className="clinic-name">Clínica Acolher</h2>
      </div>

      <div className="sidebar-user">
        <p className="user-name1">{displayName}</p>
        <span className="user-role1">{displayRole}</span>
      </div>

      <nav className="sidebar-menu">
        <ul>
          <li><FaTachometerAlt /><span onClick={() => window.location.href = "/dashboard"}>Dashboard</span></li>
          <li><FaUserMd /><span onClick={() => window.location.href = "/professionals"}>Profissionais</span></li>
          <li><FaUsers /><span onClick={() => window.location.href = "/patients"}>Pacientes</span></li>
          <li><FaCalendarAlt /><span onClick={() => window.location.href = "/agenda"}>Agenda</span></li>
          <li><FaMoneyBillWave /><span onClick={() => window.location.href = "/financeiro"}>Financeiro</span></li>
          {/* Mostrar Prontuários somente para profissionais */}
          {user?.role === 'profissional' && (
            <li><FaFileMedical /><span onClick={() => window.location.href = "/prontuario"}>Prontuários</span></li>
          )}
          <li><FaCog /><span onClick={() => window.location.href = "/configuracoes"}>Configurações</span></li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> <span>Sair</span>
        </button>
      </div>
    </aside>

  );
};

export default Sidebar;
