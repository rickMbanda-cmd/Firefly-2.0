
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  // Admin-only authentication
  const demoUsers = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = demoUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      login({
        id: Date.now(),
        username: user.username,
        name: user.name,
        role: user.role
      });
      setError('');
      // Show success message briefly
      setError('Login successful! Redirecting...');
      setTimeout(() => setError(''), 2000);
    } else {
      setError('Invalid username or password');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '"Inter", "Segoe UI", sans-serif'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '24px',
      padding: '48px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      width: '100%',
      maxWidth: '420px',
      textAlign: 'center'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px',
      letterSpacing: '-1px'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '1.1rem',
      marginBottom: '32px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    input: {
      padding: '16px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      outline: 'none',
      background: '#fff'
    },
    button: {
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
    },
    error: {
      color: '#ef4444',
      backgroundColor: '#fee2e2',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '0.9rem'
    },
    demoCredentials: {
      marginTop: '24px',
      padding: '16px',
      background: '#f8fafc',
      borderRadius: '12px',
      fontSize: '0.85rem',
      color: '#64748b',
      textAlign: 'left'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to access the exam system</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            style={styles.input}
            required
          />
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Sign In
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default Login;