import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      {/* Mobile navbar */}
      <nav className="mobile-navbar">
        <div className="mobile-navbar-container">
          <Link to="/dashboard" className="mobile-logo">
            Debt Tracker
          </Link>
          <button className="menu-toggle" onClick={toggleMenu}>
            <span className="menu-icon">{isOpen ? '✕' : '☰'}</span>
          </button>
        </div>
        
        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
          <Link to="/dashboard" className={isActive('/dashboard')} onClick={toggleMenu}>Dashboard</Link>
          <Link to="/debtors" className={isActive('/debtors')} onClick={toggleMenu}>Devedores</Link>
          <Link to="/new-debt" className={isActive('/new-debt')} onClick={toggleMenu}>Nova Dívida</Link>
          <Link to="/debts" className={isActive('/debts')} onClick={toggleMenu}>Dívidas</Link>
          <Link to="/settings" className={isActive('/settings')} onClick={toggleMenu}>Configurações</Link>
        </div>
      </nav>

      {/* Desktop sidebar */}
      <nav className="desktop-sidebar">
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-logo">
            Debt Tracker
          </Link>
        </div>
        
        <div className="sidebar-menu">
          <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard')}`}>
            Dashboard
          </Link>
          <Link to="/debtors" className={`sidebar-link ${isActive('/debtors')}`}>
            Devedores
          </Link>
          <Link to="/new-debt" className={`sidebar-link ${isActive('/new-debt')}`}>
            Nova Dívida
          </Link>
          <Link to="/debts" className={`sidebar-link ${isActive('/debts')}`}>
            Dívidas
          </Link>
          <Link to="/settings" className={`sidebar-link ${isActive('/settings')}`}>
            Configurações
          </Link>
        </div>
        
        <div className="sidebar-footer">
          <Link to="/" className="logout-button">
            Sair
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;