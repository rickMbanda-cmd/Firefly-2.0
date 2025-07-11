
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './examNavigationStyles.css';

const ExamNavigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    alert('You have been successfully logged out!');
  };

  const styles = {
    nav: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '16px 24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    logo: {
      height: '40px',
      width: 'auto',
      borderRadius: '8px'
    },
    brandText: {
      color: '#ffffff',
      fontSize: '1.5rem',
      fontWeight: '700',
      textDecoration: 'none',
      letterSpacing: '-0.5px'
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    navLink: {
      color: '#ffffff',
      textDecoration: 'none',
      padding: '12px 20px',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      background: location.pathname === '/dashboard' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
      border: '2px solid transparent'
    },
    logoutButton: {
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
    },
    userInfo: {
      color: '#ffffff',
      marginRight: '20px',
      fontSize: '0.9rem',
      fontWeight: '500'
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/dashboard" style={styles.brand}>
          <img src="/logschool.png" alt="School Logo" style={styles.logo} />
          <span style={styles.brandText}>Spring Valley Baptist School</span>
        </Link>
        
        <div style={styles.navLinks}>
          <span style={styles.userInfo}>Welcome, {user?.name}</span>
          <Link 
            to="/dashboard" 
            style={styles.navLink}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseOut={(e) => e.target.style.background = location.pathname === '/dashboard' ? 'rgba(255, 255, 255, 0.2)' : 'transparent'}
          >
            🏠 Dashboard
          </Link>
          <Link 
            to="/reports" 
            style={styles.navLink}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            📊 Reports
          </Link>
          <Link 
            to="/results-manager" 
            style={styles.navLink}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            ⚙️ Manage Results
          </Link>
          <button 
            style={styles.logoutButton}
            onClick={handleLogout}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#dc2626';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#ef4444';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ExamNavigation;
