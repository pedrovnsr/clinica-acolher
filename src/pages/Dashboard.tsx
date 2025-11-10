import React from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="dashboard-container">
        <h1>Bem-vindo ao painel do Diretor Geral!</h1>
        <p>Aqui você pode acompanhar as principais informações da clínica.</p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
