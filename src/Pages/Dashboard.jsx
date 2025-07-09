
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Components/styles.css';

const classes = [
  'Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3',
  'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'
];

const Dashboard = () => {
  const [selectedClass, setSelectedClass] = useState("");

  const styles = {
    container: {
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
      backgroundImage: 'url(/Kids.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlendMode: 'overlay',
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
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(15px)'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '40px',
      padding: '30px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
    },
    logo: {
      height: '80px',
      width: 'auto',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
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
      fontSize: '1.3rem',
      color: '#6b7280',
      fontWeight: '500',
      marginTop: '8px'
    },
    motto: {
      fontSize: '1.1rem',
      color: '#4a5568',
      fontWeight: '600',
      fontStyle: 'italic',
      marginTop: '4px'
    },
    classSelectionSection: {
      marginBottom: '40px',
      padding: '30px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    },
    classSelectionTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '20px',
      textAlign: 'center'
    },
    dropdownContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '30px'
    },
    dropdownLabel: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#374151'
    },
    dropdown: {
      padding: '12px 20px',
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
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      marginBottom: '30px',
      padding: '20px 0',
      flexWrap: 'wrap'
    },
    examButton: {
      padding: '24px 32px',
      borderRadius: '20px',
      border: 'none',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '120px',
      minWidth: '200px',
      flex: '1',
      maxWidth: '280px',
      backdropFilter: 'blur(10px)',
      transform: 'perspective(1000px) rotateX(0deg)',
      transformStyle: 'preserve-3d'
    },
    openerBtn: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#fff',
      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4), 0 4px 16px rgba(16, 185, 129, 0.2)'
    },
    midtermBtn: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: '#fff',
      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4), 0 4px 16px rgba(59, 130, 246, 0.2)'
    },
    endtermBtn: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: '#fff',
      boxShadow: '0 8px 32px rgba(245, 158, 11, 0.4), 0 4px 16px rgba(245, 158, 11, 0.2)'
    },
    disabledBtn: {
      background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
      color: '#ffffff',
      cursor: 'not-allowed',
      opacity: 0.5,
      transform: 'none',
      boxShadow: '0 4px 16px rgba(156, 163, 175, 0.2)'
    },
    bottomButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '32px',
      marginTop: '40px',
      padding: '20px 0',
      flexWrap: 'wrap'
    },
    bottomButton: {
      padding: '24px 40px',
      borderRadius: '20px',
      border: 'none',
      fontWeight: '700',
      fontSize: '1.1rem',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '90px',
      minWidth: '300px',
      maxWidth: '400px',
      flex: '1',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      backdropFilter: 'blur(10px)',
      transform: 'perspective(1000px) rotateX(0deg)'
    },
    reportsBtn: {
      background: selectedClass 
        ? 'linear-gradient(135deg, #2355d6 0%, #1e40af 100%)' 
        : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
      color: selectedClass ? '#fff' : '#9ca3af',
      boxShadow: selectedClass 
        ? '0 8px 32px rgba(35, 85, 214, 0.4), 0 4px 16px rgba(35, 85, 214, 0.2)'
        : '0 4px 16px rgba(156, 163, 175, 0.2)',
      cursor: selectedClass ? 'pointer' : 'not-allowed'
    },
    managerBtn: {
      background: selectedClass 
        ? 'linear-gradient(135deg, #4f8cff 0%, #3b82f6 100%)' 
        : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
      color: selectedClass ? '#fff' : '#9ca3af',
      boxShadow: selectedClass 
        ? '0 8px 32px rgba(79, 140, 255, 0.4), 0 4px 16px rgba(79, 140, 255, 0.2)'
        : '0 4px 16px rgba(156, 163, 175, 0.2)',
      cursor: selectedClass ? 'pointer' : 'not-allowed'
    },
    buttonIcon: {
      fontSize: '2rem',
      marginBottom: '8px',
      opacity: '0.9'
    },
    buttonText: {
      fontSize: '1rem',
      fontWeight: '600',
      letterSpacing: '0.5px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <img src="/logschool.png" alt="School Logo" style={styles.logo} />
          <div>
            <h1 style={styles.title}>Spring Valley Baptist School</h1>
            <p style={styles.subtitle}>Student Results Management System</p>
            <p style={styles.motto}>"God, Hardwork and Discipline"</p>
          </div>
        </div>

        <div style={styles.classSelectionSection}>
          <h2 style={styles.classSelectionTitle}>Select Class & Exam Type</h2>
          
          <div style={styles.dropdownContainer}>
            <label style={styles.dropdownLabel}>Class:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={styles.dropdown}
            >
              <option value="">Select a class...</option>
              {classes.map(className => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <div style={styles.examGrid}>
              <Link
                to="/opener"
                state={{ selectedClass }}
                style={{ textDecoration: 'none' }}
              >
                <button 
                  style={{...styles.examButton, ...styles.openerBtn}}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'perspective(1000px) rotateX(-5deg) translateY(-8px) scale(1.05)';
                    e.target.style.boxShadow = '0 16px 48px rgba(16, 185, 129, 0.5), 0 8px 24px rgba(16, 185, 129, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px) scale(1)';
                    e.target.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.4), 0 4px 16px rgba(16, 185, 129, 0.2)';
                  }}
                >
                  <div style={styles.buttonIcon}>🚀</div>
                  <div style={styles.buttonText}>Opener Exam</div>
                </button>
              </Link>
              <Link
                to="/midterm"
                state={{ selectedClass }}
                style={{ textDecoration: 'none' }}
              >
                <button 
                  style={{...styles.examButton, ...styles.midtermBtn}}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'perspective(1000px) rotateX(-5deg) translateY(-8px) scale(1.05)';
                    e.target.style.boxShadow = '0 16px 48px rgba(59, 130, 246, 0.5), 0 8px 24px rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px) scale(1)';
                    e.target.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.4), 0 4px 16px rgba(59, 130, 246, 0.2)';
                  }}
                >
                  <div style={styles.buttonIcon}>📚</div>
                  <div style={styles.buttonText}>Midterm Exam</div>
                </button>
              </Link>
              <Link
                to="/endterm"
                state={{ selectedClass }}
                style={{ textDecoration: 'none' }}
              >
                <button 
                  style={{...styles.examButton, ...styles.endtermBtn}}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'perspective(1000px) rotateX(-5deg) translateY(-8px) scale(1.05)';
                    e.target.style.boxShadow = '0 16px 48px rgba(245, 158, 11, 0.5), 0 8px 24px rgba(245, 158, 11, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px) scale(1)';
                    e.target.style.boxShadow = '0 8px 32px rgba(245, 158, 11, 0.4), 0 4px 16px rgba(245, 158, 11, 0.2)';
                  }}
                >
                  <div style={styles.buttonIcon}>🏆</div>
                  <div style={styles.buttonText}>Endterm Exam</div>
                </button>
              </Link>
            </div>
          )}

          {!selectedClass && (
            <div style={styles.examGrid}>
              <button style={{...styles.examButton, ...styles.disabledBtn}} disabled>
                <div style={styles.buttonIcon}>🚀</div>
                <div style={styles.buttonText}>Opener Exam</div>
              </button>
              <button style={{...styles.examButton, ...styles.disabledBtn}} disabled>
                <div style={styles.buttonIcon}>📚</div>
                <div style={styles.buttonText}>Midterm Exam</div>
              </button>
              <button style={{...styles.examButton, ...styles.disabledBtn}} disabled>
                <div style={styles.buttonIcon}>🏆</div>
                <div style={styles.buttonText}>Endterm Exam</div>
              </button>
            </div>
          )}

          <div style={styles.bottomButtons}>
            <Link 
              to="/reports" 
              state={{ selectedClass }} 
              style={{ textDecoration: 'none', pointerEvents: selectedClass ? 'auto' : 'none' }}
            >
              <button
                style={{...styles.bottomButton, ...styles.reportsBtn}}
                disabled={!selectedClass}
                onMouseEnter={(e) => {
                  if (selectedClass) {
                    e.target.style.transform = 'perspective(1000px) rotateX(-3deg) translateY(-6px) scale(1.03)';
                    e.target.style.boxShadow = '0 16px 48px rgba(35, 85, 214, 0.5), 0 8px 24px rgba(35, 85, 214, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedClass) {
                    e.target.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px) scale(1)';
                    e.target.style.boxShadow = '0 8px 32px rgba(35, 85, 214, 0.4), 0 4px 16px rgba(35, 85, 214, 0.2)';
                  }
                }}
              >
                <span style={{ marginRight: '10px', fontSize: '1.2rem' }}>📊</span>
                View Reports & Marklists
              </button>
            </Link>
            <Link 
              to="/results-manager" 
              state={{ selectedClass }} 
              style={{ textDecoration: 'none', pointerEvents: selectedClass ? 'auto' : 'none' }}
            >
              <button
                style={{...styles.bottomButton, ...styles.managerBtn}}
                disabled={!selectedClass}
                onMouseEnter={(e) => {
                  if (selectedClass) {
                    e.target.style.transform = 'perspective(1000px) rotateX(-3deg) translateY(-6px) scale(1.03)';
                    e.target.style.boxShadow = '0 16px 48px rgba(79, 140, 255, 0.5), 0 8px 24px rgba(79, 140, 255, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedClass) {
                    e.target.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px) scale(1)';
                    e.target.style.boxShadow = '0 8px 32px rgba(79, 140, 255, 0.4), 0 4px 16px rgba(79, 140, 255, 0.2)';
                  }
                }}
              >
                <span style={{ marginRight: '10px', fontSize: '1.2rem' }}>⚙️</span>
                Results Manager
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;