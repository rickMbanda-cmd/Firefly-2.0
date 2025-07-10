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
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    letterheadContainer: {
      textAlign: 'center',
      marginBottom: '20px'
    },
    letterheadImage: {
      width: '100%',
      maxWidth: '600px',
      height: 'auto'
    },
    titleSection: {
      textAlign: 'center',
      marginBottom: '20px'
    },
    reportTitle: {
      color: '#2c3e50',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '8px',
      fontFamily: '"Playfair Display", "Georgia", serif',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
      letterSpacing: '1px'
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
      minWidth: '150px',
      maxWidth: '200px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      padding: '12px 8px'
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
    },
    subjectRankingsSection: {
      marginTop: '30px',
      padding: '25px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      border: '2px solid #4a90e2'
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
            <tr key={student.id || student._id || index}>
              <td style={styles.tableCell}>{student.position || index + 1}</td>
              <td style={styles.tableCell}>{student.name || '-'}</td>
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