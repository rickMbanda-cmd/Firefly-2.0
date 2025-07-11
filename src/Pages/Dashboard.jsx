import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ExamNavigation from '../Components/ExamNavigation';

const Dashboard = () => {
  const [selectedClass, setSelectedClass] = useState('Playgroup');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');

  const classes = [
    'Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 
    'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'
  ];

  const terms = ['Term 1', 'Term 2', 'Term 3'];

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    },
    contentWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: '3rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
      letterSpacing: '-1px'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#6b7280',
      fontWeight: '500',
      marginTop: '8px'
    },
    selectionSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px',
      marginBottom: '40px',
      padding: '30px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    },
    selectionGroup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px'
    },
    label: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#1f2937'
    },
    dropdown: {
      padding: '15px 25px',
      fontSize: '1.1rem',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      background: '#ffffff',
      color: '#374151',
      cursor: 'pointer',
      minWidth: '200px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    },
    examGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginTop: '30px'
    },
    examButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '32px 24px',
      borderRadius: '20px',
      border: 'none',
      fontSize: '1.2rem',
      fontWeight: '700',
      cursor: 'pointer',
      textDecoration: 'none',
      color: '#ffffff',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '120px',
      width: '100%',
      maxWidth: '300px',
      '@media (maxWidth: 768px)': {
        padding: '20px 16px',
        fontSize: '1rem',
        minHeight: '100px'
      }
    },
    openerButton: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    midtermButton: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    endtermButton: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    },
    buttonIcon: {
      fontSize: '3rem',
      marginBottom: '12px'
    },
    buttonText: {
      fontSize: '1.3rem',
      fontWeight: '700'
    },
    currentSelection: {
      textAlign: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      borderRadius: '16px',
      marginBottom: '30px',
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
    }
  };

  return (
    <div style={styles.container}>
      <ExamNavigation />
      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '10px' }}>
            <img 
              src="/logschool.png" 
              alt="School Logo" 
              style={{ width: '80px', height: '80px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
            />
            <h1 style={styles.title}>Spring Valley Baptist School</h1>
          </div>
          <p style={{ ...styles.subtitle, fontStyle: 'italic', color: '#6366f1', fontWeight: '600', fontSize: '1.1rem' }}>
            "God, Hardwork and Discipline"
          </p>
          <p style={styles.subtitle}>Comprehensive student performance tracking</p>
        </div>

        <div style={styles.selectionSection}>
          <div style={styles.selectionGroup}>
            <label style={styles.label} htmlFor="termSelect">Select Term</label>
            <select
              id="termSelect"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              style={styles.dropdown}
            >
              {terms.map(term => (
                <option key={term} value={term}>{term}</option>
              ))}
            </select>
          </div>

          <div style={styles.selectionGroup}>
            <label style={styles.label} htmlFor="classSelect">Select Class</label>
            <select
              id="classSelect"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={styles.dropdown}
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.currentSelection}>
          <h3>Current Selection: {selectedTerm} - {selectedClass}</h3>
        </div>

        <div style={styles.examGrid}>
          <Link 
            to="/opener" 
            state={{ selectedClass, selectedTerm }}
            style={{...styles.examButton, ...styles.openerButton}}
          >
            <div style={styles.buttonIcon}>🚀</div>
            <div style={styles.buttonText}>Opener Exam</div>
          </Link>

          <Link 
            to="/midterm" 
            state={{ selectedClass, selectedTerm }}
            style={{...styles.examButton, ...styles.midtermButton}}
          >
            <div style={styles.buttonIcon}>📚</div>
            <div style={styles.buttonText}>Midterm Exam</div>
          </Link>

          <Link 
            to="/endterm" 
            state={{ selectedClass, selectedTerm }}
            style={{...styles.examButton, ...styles.endtermButton}}
          >
            <div style={styles.buttonIcon}>🏆</div>
            <div style={styles.buttonText}>Endterm Exam</div>
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link 
            to="/reports" 
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.3s ease',
              marginRight: '20px'
            }}
          >
            📄 View Reports
          </Link>

          <Link 
            to="/results-manager" 
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 8px 32px rgba(20, 184, 166, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            ⚙️ Manage Results
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;