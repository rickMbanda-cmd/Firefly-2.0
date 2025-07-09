import React, { useEffect, useState } from 'react';
import {
  fetchResults,
  addResult,
  updateResult,
  deleteResult
} from '../api/results';
import ExamNavigation from '../Components/ExamNavigation';
import { getSubjectsByClass, getSubjectDisplayName, getRubric } from '../Utils/subjectsByClass';

const examTypes = ['opener', 'midterm', 'endterm'];
const classes = [
  'Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3',
  'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'
];

const createEmptyResult = (examType, selectedClass) => {
  const subjects = getSubjectsByClass(selectedClass);
  const result = {
    name: '',
    mean: '',
    rubric: '',
    examType: examType,
    class: selectedClass || ''
  };

  // Initialize all subjects to empty string
  subjects.forEach(subject => {
    result[subject] = '';
  });

  return result;
};

const ResultsManager = () => {
  const [results, setResults] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState('opener');
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    fetchResults().then(setResults);
  }, []);

  useEffect(() => {
    // Reset form when class or exam type changes
    setForm(createEmptyResult(selectedExamType, selectedClass));
    setEditingId(null);
  }, [selectedClass, selectedExamType]);

  const currentSubjects = getSubjectsByClass(selectedClass);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = result => {
    setEditingId(result._id);
    setSelectedExamType(result.examType);
    setSelectedClass(result.class);

    const editForm = {
      name: result.name,
      mean: result.mean,
      rubric: result.rubric,
      examType: result.examType,
      class: result.class || ''
    };

    // Get subjects for the result's class
    const resultSubjects = getSubjectsByClass(result.class);

    // Add all subjects for this class
    resultSubjects.forEach(subject => {
      editForm[subject] = result[subject] || '';
    });

    setForm(editForm);
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      await deleteResult(id);
      setResults(results.filter(r => r._id !== id));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.class) {
      alert('Please select a class.');
      return;
    }

    // Calculate mean from current subjects
    const subjectScores = currentSubjects.map(subject => parseFloat(form[subject])).filter(score => !isNaN(score));
    const mean = subjectScores.length > 0 ? subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length : 0;

    const formWithMean = { 
      ...form, 
      mean: mean.toFixed(2),
      rubric: getRubric(mean)
    };

    if (editingId) {
      const updated = await updateResult(editingId, formWithMean);
      setResults(results.map(r => (r._id === editingId ? updated : r)));
      setEditingId(null);
    } else {
      const created = await addResult(formWithMean);
      setResults([...results, created]);
    }
    setForm(createEmptyResult(selectedExamType, selectedClass));
  };

  // Filter results by selected exam type and class
  const filteredResults = results.filter(
    r => r.examType === selectedExamType && (!selectedClass || r.class === selectedClass)
  );

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    },
    contentWrapper: {
      maxWidth: '1400px',
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
      marginBottom: '10px',
      letterSpacing: '-1px'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#6b7280',
      fontWeight: '400'
    },
    filtersContainer: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px',
      display: 'flex',
      gap: '24px',
      alignItems: 'center',
      flexWrap: 'wrap',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#374151',
      letterSpacing: '0.5px'
    },
    select: {
      padding: '12px 16px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      fontSize: '1rem',
      color: '#374151',
      fontWeight: '500',
      background: '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      outline: 'none',
      minWidth: '160px'
    },
    formContainer: {
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
    },
    formTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#92400e',
      marginBottom: '20px',
      textAlign: 'center'
    },
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      alignItems: 'end'
    },
    input: {
      padding: '12px 16px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      fontSize: '1rem',
      fontWeight: '500',
      background: '#fff',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    buttonPrimary: {
      padding: '12px 24px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#fff',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    buttonSecondary: {
      padding: '12px 24px',
      borderRadius: '12px',
      border: '2px solid #6b7280',
      background: 'transparent',
      color: '#6b7280',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    tableContainer: {
      background: '#fff',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9'
    },
    tableWrapper: {
      overflowX: 'auto',
      overflowY: 'auto',
      maxHeight: '600px'
    },
    table: {
      width: '100%',
      minWidth: '800px',
      borderCollapse: 'collapse',
      fontSize: '0.95rem'
    },
    tableHeader: {
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      color: '#fff'
    },
    th: {
      padding: '16px 12px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '0.9rem',
      letterSpacing: '0.5px',
      textTransform: 'uppercase'
    },
    td: {
      padding: '16px 12px',
      borderBottom: '1px solid #f1f5f9',
      color: '#374151',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '200px'
    },
    row: {
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    actionButton: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '0.85rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginRight: '8px',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    editButton: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
    },
    deleteButton: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#6b7280'
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '16px',
      opacity: '0.5'
    },
    emptyText: {
      fontSize: '1.2rem',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <ExamNavigation />
      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Results Manager</h1>
          <p style={styles.subtitle}>Manage and organize student examination results</p>
        </div>

        <div style={styles.filtersContainer}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Exam Type</label>
            <select
              value={selectedExamType}
              onChange={e => setSelectedExamType(e.target.value)}
              style={{
                ...styles.select,
                ':hover': { borderColor: '#3b82f6' },
                ':focus': { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)' }
              }}
            >
              {examTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Class Filter</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              style={styles.select}
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '4px' }}>Total Results</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>
              {filteredResults.length}
            </div>
          </div>
        </div>

        <div style={styles.formContainer}>
          <h3 style={styles.formTitle}>
            {editingId ? '✏️ Edit Student Result' : '➕ Add New Student Result'}
          </h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input 
              name="name" 
              value={form.name || ''} 
              onChange={handleChange} 
              placeholder="Student Name" 
              required 
              style={{
                ...styles.input,
                ':focus': { borderColor: '#10b981', boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)' }
              }}
            />

            {currentSubjects.map(subject => (
              <input 
                key={subject}
                name={subject} 
                type="number" 
                value={form[subject] || ''} 
                onChange={handleChange} 
                placeholder={getSubjectDisplayName(subject)} 
                required 
                style={styles.input}
                min="0"
                max="100"
              />
            ))}

            <select
              name="class"
              value={form.class || ''}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>

            <button 
              type="submit" 
              style={{
                ...styles.buttonPrimary,
                ':hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)' }
              }}
            >
              {editingId ? '💾 Update' : '➕ Add'} Result
            </button>

            {editingId && (
              <button 
                type="button" 
                onClick={() => { 
                  setEditingId(null); 
                  setForm(createEmptyResult(selectedExamType, selectedClass)); 
                }}
                style={styles.buttonSecondary}
              >
                ❌ Cancel
              </button>
            )}
          </form>
        </div>

        <div style={styles.tableContainer}>
          {filteredResults.length > 0 ? (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.th}>👤 Student Name</th>
                  {currentSubjects.map(subject => (
                    <th key={subject} style={styles.th}>📚 {getSubjectDisplayName(subject)}</th>
                  ))}
                  <th style={styles.th}>📊 Mean</th>
                  <th style={styles.th}>📋 Rubric</th>
                  <th style={styles.th}>🏫 Class</th>
                  <th style={styles.th}>⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((r, index) => (
                  <tr 
                    key={r._id} 
                    style={{
                      ...styles.row,
                      backgroundColor: index % 2 === 0 ? '#f8fafc' : '#fff',
                      ':hover': { backgroundColor: '#e0f2fe', transform: 'scale(1.01)' }
                    }}
                  >
                    <td style={{ ...styles.td, fontWeight: '600', color: '#1f2937' }}>{r.name}</td>
                    {currentSubjects.map(subject => (
                      <td key={subject} style={styles.td}>
                        {r[subject] ? (
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '6px', 
                            background: r[subject] >= 80 ? '#dcfce7' : r[subject] >= 65 ? '#fef3c7' : r[subject] >= 50 ? '#fed7aa' : '#fecaca',
                            color: r[subject] >= 80 ? '#166534' : r[subject] >= 65 ? '#92400e' : r[subject] >= 50 ? '#9a3412' : '#991b1b',
                            fontWeight: '600'
                          }}>
                            {r[subject]}
                          </span>
                        ) : '-'}
                      </td>
                    ))}
                    <td style={styles.td}>
                      <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: '8px', 
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '0.9rem'
                      }}>
                        {r.mean || '-'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        background: '#f3f4f6',
                        color: '#374151',
                        fontWeight: '600',
                        fontSize: '0.85rem'
                      }}>
                        {r.rubric || '-'}
                      </span>
                    </td>
                    <td style={styles.td}>{r.class}</td>
                    <td style={styles.td}>
                      <button 
                        onClick={() => handleEdit(r)} 
                        style={{ ...styles.actionButton, ...styles.editButton }}
                        title="Edit Result"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(r._id)} 
                        style={{ ...styles.actionButton, ...styles.deleteButton }}
                        title="Delete Result"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📊</div>
              <div style={styles.emptyText}>No results found for the selected filters</div>
              <p style={{ marginTop: '8px', color: '#9ca3af' }}>
                Select a class and add some student results to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsManager;