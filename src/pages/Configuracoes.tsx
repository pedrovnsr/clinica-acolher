import React from 'react';
import Sidebar from '../components/Sidebar';
import NotificationHeader from '../components/NotificationHeader';
import '../styles/Configuracoes.css';

// Mock icons. Em um projeto real, você usaria uma biblioteca como react-icons.
const Icon = ({ name, className }: { name: string, className?: string }) => <i className={`${className} icon-placeholder`}>{name}</i>;

const Configuracoes = () => {
  return (
    <div className="config-container-main">
      <Sidebar />
      <div className="config-content-wrapper">
        <NotificationHeader />
        <div className="config-page">
          <h1 className="config-header">Configurações</h1>

          <div className="config-tabs">
            <button className="tab-item active">
              <Icon name="🗄️" /> Geral
            </button>
            <button className="tab-item">
              <Icon name="🎨" /> Aparência & Design
            </button>
            <button className="tab-item">
              <Icon name="🛡️" /> Permissões
            </button>
          </div>

          <div className="config-grid">
            <div className="config-card">
              <div className="card-content">
                <h3>Backup Automático</h3>
                <p>Backup diário às 02:00</p>
                <div className="status">
                  <span className="status-dot"></span>
                  Ativo
                </div>
              </div>
              <div className="card-icon icon-db">
                <Icon name="💾" />
              </div>
            </div>

            <div className="config-card">
              <div className="card-content">
                <h3>Backup Manual</h3>
                <p>Último backup: 10/12/2024</p>
                <a href="#" className="action-link">Criar backup agora</a>
              </div>
              <div className="card-icon icon-file">
                <Icon name="📄" />
              </div>
            </div>

            <div className="config-card">
              <div className="card-content">
                <h3>Política de Senha</h3>
                <p>Mínimo 8 caracteres</p>
                <p>Renovação a cada 90 dias</p>
              </div>
              <div className="card-icon icon-lock">
                <Icon name="🔒" />
              </div>
            </div>

            <div className="config-card">
              <div className="card-content">
                <h3>Exportar Backup</h3>
                <p>Baixar dados completos</p>
                <button className="export-button">Exportar</button>
              </div>
              <div className="card-icon icon-download">
                <Icon name="📥" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
