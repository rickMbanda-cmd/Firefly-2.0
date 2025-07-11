import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getSubjectsByClass, getSubjectDisplayName } from '../Utils/subjectsByClass';

// Add print styles for ClassMarklist
// Print styles will be injected dynamically from the parent component

const ClassMarklist = ({ students, selectedClass }) => {
  // Get subjects based on the selected class or first student's class
  const currentClass = selectedClass || (students.length > 0 ? students[0].class : 'Grade 1');
  const subjects = getSubjectsByClass(currentClass);

  // Calculate total marks for each student and sort by total marks (descending)
  const sortedStudents = useMemo(() => {
    return [...students].map(student => {
      // Calculate total marks by summing all subject scores
      const totalMarks = subjects.reduce((sum, subject) => {
        const score = parseFloat(student[subject]);
        return sum + (isNaN(score) ? 0 : score);
      }, 0);
      
      return {
        ...student,
        totalMarks
      };
    }).sort((a, b) => {
      return b.totalMarks - a.totalMarks;
    });
  }, [students, subjects]);

  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const examType = students.length > 0 ? students[0].examType : '';
  const displayExamType = examType === 'opener' ? 'Opener' : 
                         examType === 'midterm' ? 'Midterm' : 
                         examType === 'endterm' ? 'Endterm' : examType;

  const styles = {
    container: {
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px',
      backgroundColor: '#fff',
      borderRadius: '20px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundDecoration: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '300px',
      height: '300px',
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
      borderRadius: '50%',
      transform: 'translate(100px, -100px)',
      zIndex: 0
    },
    letterheadContainer: {
      textAlign: 'center',
      marginBottom: '30px',
      position: 'relative',
      zIndex: 1
    },
    letterheadImage: {
      width: '100%',
      maxWidth: '700px',
      height: 'auto',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    },
    titleSection: {
      textAlign: 'center',
      marginBottom: '40px',
      position: 'relative',
      zIndex: 1,
      padding: '30px 0',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    },
    reportTitle: {
      color: '#1e293b',
      fontSize: '2rem',
      fontWeight: '800',
      marginBottom: '12px',
      fontFamily: '"Inter", sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-1px',
      textTransform: 'uppercase'
    },
    subtitle: {
      color: '#777',
      fontSize: '16px',
      marginBottom: '5px'
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
      marginBottom: '30px',
      backgroundColor: '#fff',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      fontSize: '14px',
      position: 'relative',
      zIndex: 1
    },
    tableHeader: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      fontWeight: '700',
      padding: '20px 12px',
      textAlign: 'center',
      fontSize: '13px',
      borderBottom: 'none',
      position: 'sticky',
      top: '0',
      zIndex: '10',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    tableCell: {
      padding: '16px 12px',
      borderBottom: '1px solid #f1f5f9',
      textAlign: 'center',
      fontSize: '13px',
      color: '#334155',
      minWidth: '70px',
      fontWeight: '500',
      transition: 'background-color 0.2s ease'
    },
    nameCell: {
      textAlign: 'left',
      fontWeight: '700',
      minWidth: '180px',
      maxWidth: '220px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      padding: '16px 12px',
      color: '#1e293b'
    },
    tableRowEven: {
      backgroundColor: '#f8fafc',
      borderLeft: '4px solid transparent'
    },
    tableRowOdd: {
      backgroundColor: '#fff',
      borderLeft: '4px solid transparent'
    },
    tableRowHover: {
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    summarySection: {
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)',
      padding: '30px',
      borderRadius: '20px',
      border: '2px solid #667eea',
      textAlign: 'center',
      position: 'relative',
      zIndex: 1,
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)'
    },
    summaryText: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    tableWrapper: {
      overflowX: 'auto',
      maxHeight: '700px',
      border: 'none',
      borderRadius: '16px',
      position: 'relative',
      zIndex: 1
    },
    subjectRankingsSection: {
      marginTop: '40px',
      padding: '40px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '20px',
      border: '2px solid #667eea',
      position: 'relative',
      zIndex: 1,
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
    },
    subjectRankingsTitle: {
      color: '#2c3e50',
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '20px',
      fontFamily: '"Playfair Display", "Georgia", serif',
      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
    },
    subjectRankingsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px'
    },
    subjectRankingCard: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      border: '1px solid #e9ecef',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    subjectRankingPosition: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#4a90e2',
      marginBottom: '8px'
    },
    subjectRankingName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '8px'
    },
    subjectRankingAverage: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#28a745',
      backgroundColor: '#e8f5e8',
      padding: '8px 16px',
      borderRadius: '20px'
    }
  };

    return (
    <div style={styles.container} className="print-container">
      {/* Background Decoration */}
      <div style={styles.backgroundDecoration}></div>
      
      {/* Letterhead Header */}
      <div style={styles.letterheadContainer}>
        <img 
          src="Letterhead.png" 
          alt="School Letterhead" 
          style={styles.letterheadImage}
        />
      </div>

      {/* Report Title Section */}
      <div style={styles.titleSection}>
        <h2 style={styles.reportTitle}>CLASS MARKLIST</h2>
        {selectedClass && <p style={styles.subtitle}>{selectedClass}</p>}
        {displayExamType && <p style={styles.subtitle}>{displayExamType} - {currentDate}</p>}
      </div>

      {/* Table */}
      <div className="table-wrapper" style={styles.tableWrapper}>
        <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Position</th>
            <th style={styles.tableHeader}>Name</th>
            {subjects.map(subject => (
              <th key={subject} style={styles.tableHeader}>
                {getSubjectDisplayName(subject)}
              </th>
            ))}
            <th style={styles.tableHeader}>Total</th>
            <th style={styles.tableHeader}>Mean</th>
            <th style={styles.tableHeader}>Rubric</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student, index) => (
            <tr 
              key={student.id || student._id || index}
              style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderLeft = '4px solid #667eea';
                e.currentTarget.style.backgroundColor = '#f0f4ff';
                e.currentTarget.style.transform = 'translateX(2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.1)';
                e.currentTarget.style.transition = 'all 0.2s ease';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderLeft = '4px solid transparent';
                e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f8fafc' : '#fff';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <td style={styles.tableCell}>{student.position || index + 1}</td>
              <td style={styles.nameCell}>{student.name || '-'}</td>
              {subjects.map(subject => (
                <td key={subject} style={styles.tableCell}>
                  {student[subject] || '-'}
                </td>
              ))}
              <td style={styles.tableCell}>
                <strong>{student.totalMarks.toFixed(0)}</strong>
              </td>
              <td style={styles.tableCell}>
                {typeof student.mean === 'number' ? student.mean.toFixed(1) : '-'}
              </td>
              <td style={styles.tableCell}>{student.rubric || '-'}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      <div style={styles.summarySection}>
        <div style={styles.summaryText}>
          Total Students: {sortedStudents.length}
        </div>
      </div>

      {/* Subject Rankings Table */}
      <div style={styles.subjectRankingsSection}>
        <h3 style={styles.subjectRankingsTitle}>Subject Rankings by Class Average</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Subject Ranking</th>
                {(() => {
                  // Calculate averages and sort subjects by performance
                  const subjectAverages = subjects.map(subject => {
                    const subjectScores = sortedStudents
                      .map(student => parseFloat(student[subject]))
                      .filter(score => !isNaN(score));
                    
                    const average = subjectScores.length > 0 
                      ? subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length
                      : 0;
                    
                    return { subject, average };
                  }).sort((a, b) => b.average - a.average);

                  return subjectAverages.map((item, index) => (
                    <th key={item.subject} style={styles.tableHeader}>
                      {index + 1}. {getSubjectDisplayName(item.subject)}
                    </th>
                  ));
                })()}
              </tr>
            </thead>
          </table>
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