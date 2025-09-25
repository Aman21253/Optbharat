import React from "react";
import { useNavigate } from "react-router-dom";
import "./floatingAddButton.css";

const FloatingAddButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/add");
  };

  return (
    <button className="floating-add-button" onClick={handleClick}>
      +
    </button>
  );
};

export default FloatingAddButton;