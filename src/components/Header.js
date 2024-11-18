import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css'; // CSS för styling

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hantera Logga ut
  const handleLogout = () => {
    localStorage.clear(); // Ta bort användardata från localStorage
    navigate('/'); // Navigera till Login-sidan
  };

  // Hantera Tillbaka
  const handleBack = () => {
    navigate(-1); // Navigera tillbaka till föregående sida
  };

  // Visa inte header-komponenten på Login-sidan
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="header">
      <button className="back-button" onClick={handleBack} title="Tillbaka">
        ←
      </button>
      <button className="logout-button" onClick={handleLogout} title="Logga ut">
        ⎋
      </button>
    </div>
  );
};

export default Header;
