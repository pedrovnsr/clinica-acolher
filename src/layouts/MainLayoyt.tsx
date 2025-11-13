import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/mainlayout.css";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default MainLayout;
