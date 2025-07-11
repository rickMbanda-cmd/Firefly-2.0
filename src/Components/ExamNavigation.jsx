
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './examNavigationStyles.css';

const ExamNavigation = ({ user, logout }) => {
  const location = useLocation();

  return (
    <nav className="exam-nav">
      <div className="nav-container">
        <h2 className="exam-nav-title">Exam Modules</h2>
        <div className="nav-buttons">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button className={`nav-button ${location.pathname === '/' ? 'active' : ''}`}>
              Dashboard
            </button>
          </Link>
          <Link to="/opener" style={{ textDecoration: 'none' }}>
            <button className={`nav-button ${location.pathname === '/opener' ? 'active' : ''}`}>
              Opener
            </button>
          </Link>
          <Link to="/midterm" style={{ textDecoration: 'none' }}>
            <button className={`nav-button ${location.pathname === '/midterm' ? 'active' : ''}`}>
              Midterm
            </button>
          </Link>
          <Link to="/endterm" style={{ textDecoration: 'none' }}>
            <button className={`nav-button ${location.pathname === '/endterm' ? 'active' : ''}`}>
              Endterm
            </button>
          </Link>
          <Link to="/reports" style={{ textDecoration: 'none' }}>
            <button className={`nav-button ${location.pathname === '/reports' ? 'active' : ''}`}>
              Reports
            </button>
          </Link>
          <Link to="/results-manager" style={{ textDecoration: 'none' }}>
            <button className={`nav-button ${location.pathname === '/results-manager' ? 'active' : ''}`}>
              Results Manager
            </button>
          </Link>
        </div>

        {/* User Menu */}
        <div className="user-menu">
          <div className="user-info">
            <span className="user-name">👤 {user?.name || user?.username}</span>
            <span className="user-role">({user?.role})</span>
          </div>
          <button 
            onClick={logout}
            className="logout-btn"
            title="Logout"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ExamNavigation;