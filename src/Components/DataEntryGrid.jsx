import React from 'react';
import { getSubjectsByClass, getSubjectDisplayName } from '../Utils/subjectsByClass';

const DataEntryGrid = ({ students, updateStudent, addStudentRow, saveStudent, selectedClass }) => {
  const subjects = getSubjectsByClass(selectedClass || 'Grade 1');

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    tableWrapper: {
      overflowX: 'auto',
      maxHeight: '600px',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      backgroundColor: '#fff'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '13px',
      minWidth: '800px'
    },
    tableHeader: {
      backgroundColor: '#4a90e2',
      color: '#fff',
      fontWeight: 'bold',
      padding: '15px 8px',
      textAlign: 'center',
      fontSize: '12px',
      borderBottom: '2px solid #357abd',
      position: 'sticky',
      top: '0',
      zIndex: '10'
    },
    tableCell: {
      padding: '8px',
      borderBottom: '1px solid #e9ecef',
      textAlign: 'center'
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '12px',
      textAlign: 'center',
      backgroundColor: '#fff',
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box'
    },
    nameInput: {
      textAlign: 'left',
      minWidth: '120px'
    },
    button: {
      padding: '8px 16px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 'bold',
      transition: 'background-color 0.2s ease'
    },
    addButton: {
      padding: '12px 24px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      marginTop: '20px',
      transition: 'background-color 0.2s ease'
    },
    tableRowEven: {
      backgroundColor: '#f8f9fa'
    },
    tableRowOdd: {
      backgroundColor: '#fff'
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#2c3e50', fontSize: '18px', margin: 0 }}>
          Enter the marks - {selectedClass || 'Grade 1'}
        </h3>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{...styles.tableHeader, minWidth: '120px'}}>Name</th>
              {subjects.map(subject => (
                <th key={subject} style={{...styles.tableHeader, minWidth: '80px'}}>
                  {getSubjectDisplayName(subject)}
                </th>
              ))}
              <th style={{...styles.tableHeader, minWidth: '80px'}}>Mean</th>
              <th style={{...styles.tableHeader, minWidth: '80px'}}>Rubric</th>
              <th style={{...styles.tableHeader, minWidth: '80px'}}>Class</th>
              <th style={{...styles.tableHeader, minWidth: '80px'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr 
                key={student.id || student._id || index}
                style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
              >
                <td style={styles.tableCell}>
                  <input
                    style={{...styles.input, ...styles.nameInput}}
                    type="text"
                    value={student.name || ''}
                    onChange={e => {
                      const value = e.target.value;
                      if (/^[a-zA-Z\s'-]*$/.test(value)) {
                        updateStudent(student.id, 'name', value);
                      }
                    }}
                    placeholder="Student name"
                    onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                  />
                </td>
                {subjects.map(subject => (
                  <td key={subject} style={styles.tableCell}>
                    <input
                      style={styles.input}
                      type="number"
                      min="0"
                      max="100"
                      value={student[subject] || ''}
                      onChange={e => {
                        const value = e.target.value;
                        if (value === '') {
                          updateStudent(student.id, subject, '');
                          return;
                        }
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                          updateStudent(student.id, subject, value);
                        }
                      }}
                      placeholder="0-100"
                      onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
                      onBlur={(e) => e.target.style.borderColor = '#ddd'}
                    />
                  </td>
                ))}
                <td style={styles.tableCell}>
                  <strong style={{ color: '#2980b9' }}>
                    {typeof student.mean === 'number' ? student.mean.toFixed(2) : '-'}
                  </strong>
                </td>
                <td style={styles.tableCell}>
                  <strong style={{ color: '#27ae60' }}>
                    {student.rubric || '-'}
                  </strong>
                </td>
                <td style={styles.tableCell}>
                  <strong>{student.class || selectedClass || '-'}</strong>
                </td>
                <td style={styles.tableCell}>
                  <button 
                    style={styles.button}
                    onClick={() => saveStudent(student)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button 
        style={styles.addButton}
        onClick={addStudentRow}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
      >
        + Add Student
      </button>
    </div>
  );
};

export default DataEntryGrid;