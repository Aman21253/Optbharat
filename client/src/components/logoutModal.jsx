// src/components/LogoutModal.jsx
import React from "react";
import "./logoutModal.css";

const LogoutModal = ({ onCancel, onConfirm }) => {
  return ( // ✅ Must return this block
    <div className="logout-modal-overlay">
      <div className="logout-modal">
        <h3>Are you sure you want to logout?</h3>
        <div className="logout-buttons">
          <button className="cancel" onClick={onCancel}>Cancel</button>
          <button className="confirm" onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;