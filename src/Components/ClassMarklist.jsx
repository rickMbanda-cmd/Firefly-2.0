
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getSubjectsByClass, getSubjectDisplayName } from '../Utils/subjectsByClass';

const ClassMarklist = ({ students, selectedClass }) => {
  // Sort students by mean score and add position
  const rankedStudents = useMemo(() => {
    const studentsWithMean = students.filter(s => typeof s.mean === 'number' && !isNaN(s.mean));
    const studentsWithoutMean = students.filter(s => !(typeof s.mean === 'number' && !isNaN(s.mean)));
    
    // Sort by mean score in descending order
    studentsWithMean.sort((a, b) => b.mean - a.mean);
    
    // Add position to students with valid means
    studentsWithMean.forEach((student, index) => {
      student.position = index + 1;
    });
    
    // Students without valid means get no position
    studentsWithoutMean.forEach(student => {
      student.position = '-';
    });
    
    return [...studentsWithMean, ...studentsWithoutMean];
  }, [students]);
  
  // Ensure all means are numbers and not null/undefined
  const validMeans = useMemo(
    () => rankedStudents.map(s => typeof s.mean === 'number' ? s.mean : null).filter(mean => mean !== null),
    [rankedStudents]
  );
  
  const classAverage = useMemo(
    () => validMeans.length ? validMeans.reduce((a, b) => a + b, 0) / validMeans.length : 0,
    [validMeans]
  );
  
  const letterhead = useMemo(() => {
    return {
      logoUrl: 'Letterhead.png'
    };
  }, []);

  // Get class name from selectedClass prop or first student
  const className = selectedClass || (students.length > 0 && students[0].class ? students[0].class : '');
  
  // Get subjects for the current class
  const subjects = getSubjectsByClass(className);

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    letterhead: {
      textAlign: 'center',
      marginBottom: '30px',
      borderBottom: '3px solid #4a90e2',
      paddingBottom: '20px'
    },
    title: {
      color: '#2c3e50',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '25px',
      textAlign: 'center',
      borderBottom: '2px solid #ecf0f1',
      paddingBottom: '15px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '25px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      fontSize: '13px'
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
      padding: '10px 8px',
      borderBottom: '1px solid #e9ecef',
      textAlign: 'center',
      fontSize: '12px',
      color: '#2c3e50',
      minWidth: '60px'
    },
    nameCell: {
      textAlign: 'left',
      fontWeight: 'bold',
      minWidth: '120px',
      maxWidth: '150px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    tableRowEven: {
      backgroundColor: '#f8f9fa'
    },
    tableRowOdd: {
      backgroundColor: '#fff'
    },
    tableRowHover: {
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    },
    summarySection: {
      backgroundColor: '#e8f4fd',
      padding: '20px',
      borderRadius: '8px',
      border: '2px solid #4a90e2',
      textAlign: 'center'
    },
    summaryText: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#2c3e50'
    },
    tableWrapper: {
      overflowX: 'auto',
      maxHeight: '600px',
      border: '1px solid #e9ecef',
      borderRadius: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.letterhead}>
        <img 
          src={letterhead.logoUrl} 
          alt="School Letterhead" 
          style={{ width: '100%', maxWidth: '600px', height: 'auto' }} 
        />
      </div>
      
      <h2 style={styles.title}>
        Class Marklist{className && ` - ${className}`}
      </h2>
      
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Position</th>
              <th style={{...styles.tableHeader, ...styles.nameCell}}>Student Name</th>
              {subjects.map(subject => (
                <th key={subject} style={styles.tableHeader}>
                  {getSubjectDisplayName(subject)}
                </th>
              ))}
              <th style={styles.tableHeader}>Mean</th>
              <th style={styles.tableHeader}>Rubric</th>
              <th style={styles.tableHeader}>Class</th>
            </tr>
          </thead>
          <tbody>
            {rankedStudents.map((student, index) => (
              <tr 
                key={student.id || student._id || index}
                style={{
                  ...(index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd),
                  ...styles.tableRowHover
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e3f2fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : '#fff';
                }}
              >
                <td style={{...styles.tableCell, fontWeight: 'bold', color: '#e74c3c'}}>
                  {student.position}
                </td>
                <td style={{...styles.tableCell, ...styles.nameCell}} title={student.name || 'N/A'}>
                  {student.name || 'N/A'}
                </td>
                {subjects.map(subject => (
                  <td key={subject} style={styles.tableCell}>
                    {typeof student[subject] === 'number' && !isNaN(student[subject]) 
                      ? student[subject].toFixed(1) 
                      : '-'}
                  </td>
                ))}
                <td style={{...styles.tableCell, fontWeight: 'bold', color: '#2980b9'}}>
                  {typeof student.mean === 'number' && !isNaN(student.mean)
                    ? student.mean.toFixed(2)
                    : '-'}
                </td>
                <td style={{...styles.tableCell, fontWeight: 'bold', color: '#27ae60'}}>
                  {student.rubric || '-'}
                </td>
                <td style={styles.tableCell}>
                  {student.class || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={styles.summarySection}>
        <div style={styles.summaryText}>
          Class Average: {validMeans.length ? classAverage.toFixed(2) : '-'}
        </div>
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#34495e' }}>
          Total Students: {rankedStudents.length} | Students with Scores: {validMeans.length}
        </div>
      </div>
    </div>
  );
};

ClassMarklist.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      mean: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      rubric: PropTypes.string,
      class: PropTypes.string,
    })
  ).isRequired,
  selectedClass: PropTypes.string,
};

export default ClassMarklist;