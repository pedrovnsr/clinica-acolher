import type { FC } from "react";
import { FaBell } from "react-icons/fa";
import "../styles/NotificationHeader.css";

const NotificationHeader: FC = () => {
  return (
    <div className="notification-header">
      <FaBell className="notification-icon" />

      <div className="user-info">
        <div className="user-details">
          <span className="user-name">Dra. Anne Caroline</span>
          <span className="user-role">Diretora</span>
        </div>

        <div className="user-photo">Photo</div>
      </div>
    </div>
  );
};

export default NotificationHeader;
