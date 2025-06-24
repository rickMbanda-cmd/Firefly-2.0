import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Components/styles.css';

const examTypes = [
  { path: '/opener', label: 'Opener Exam Results' },
  { path: '/midterm', label: 'Midterm Exam Results' },
  { path: '/endterm', label: 'Endterm Exam Results' }
];

const classes = [
  'Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3',
  'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'
];

const Dashboard = () => {
  // Ensure initial value is empty so user must select a class
  const [selectedClass, setSelectedClass] = useState("");

  return (
    <section className="dashboard" style={{
      maxWidth: 600,
      margin: '2em auto',
      padding: '2em',
      background: '#f8fafc',
      borderRadius: 16,
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '0.5em', color: '#2355d6' }}>Dashboard</h1>
      <p style={{ textAlign: 'center', marginBottom: '2em', color: '#444' }}>
        Select a class and an option below to proceed:
      </p>

      {/* Class selection dropdown */}
      <div style={{ marginBottom: '2em', textAlign: 'center' }}>
        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          style={{
            padding: '0.5em 1em',
            borderRadius: 8,
            border: '1px solid #2355d6',
            fontSize: '1em',
            color: '#2355d6',
            fontWeight: 500,
            background: '#fff'
          }}
        >
          <option value="">Select Class</option>
          {classes.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', marginBottom: '2em' }}>
        {examTypes.map((exam) => (
          <Link
            key={exam.path}
            to={exam.path}
            state={{ selectedClass }}  // Passing the selectedClass via state
            style={{ textDecoration: 'none' }}
          >
            <button
              style={{
                width: '100%',
                padding: '1em',
                fontSize: '1.1em',
                borderRadius: 8,
                border: 'none',
                background: selectedClass
                  ? 'linear-gradient(90deg, #4f8cff 0%, #2355d6 100%)'
                  : '#cfd8e3',
                color: '#fff',
                fontWeight: 500,
                boxShadow: '0 2px 8px rgba(79,140,255,0.08)',
                cursor: selectedClass ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s, transform 0.2s'
              }}
              aria-label={`Enter ${exam.label}`}
              disabled={!selectedClass}
            >
              {exam.label}
            </button>
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1em', justifyContent: 'center' }}>
        <Link to="/reports" state={{ selectedClass }} style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '1em 1.5em',
              borderRadius: 8,
              border: 'none',
              background: selectedClass ? '#2355d6' : '#cfd8e3',
              color: '#fff',
              fontWeight: 500,
              fontSize: '1em',
              cursor: selectedClass ? 'pointer' : 'not-allowed',
              boxShadow: '0 2px 8px rgba(79,140,255,0.08)'
            }}
            aria-label="View Reports & Marklists"
            disabled={!selectedClass}
          >
            View Reports & Marklists
          </button>
        </Link>
        <Link to="/results-manager" state={{ selectedClass }} style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '1em 1.5em',
              borderRadius: 8,
              border: 'none',
              background: selectedClass ? '#4f8cff' : '#cfd8e3',
              color: '#fff',
              fontWeight: 500,
              fontSize: '1em',
              cursor: selectedClass ? 'pointer' : 'not-allowed',
              boxShadow: '0 2px 8px rgba(79,140,255,0.08)'
            }}
            aria-label="Results Manager"
            disabled={!selectedClass}
          >
            Results Manager
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Dashboard;