import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getSubjectsByClass, getSubjectDisplayName } from '../Utils/subjectsByClass';

// Add print styles for ClassMarklist
const printStyles = `
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
      margin: 0;
      padding: 0;
    }
    
    .no-print, button, nav, .exam-nav {
      display: none !important;
    }
    
    .print-container {
      margin: 0 !important;
      padding: 10px !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      max-width: none !important;
      width: 100% !important;
    }
    
    table {
      page-break-inside: auto;
      border-collapse: collapse !important;
      width: 100% !important;
      font-size: 10px !important;
    }
    
    thead {
      display: table-header-group;
    }
    
    tr {
      page-break-inside: avoid;
    }
    
    th, td {
      padding: 6px 4px !important;
      font-size: 10px !important;
      border: 1px solid #000 !important;
    }
    
    img {
      max-width: 100% !important;
      height: auto !important;
    }
    
    .table-wrapper {
      overflow: visible !important;
      max-height: none !important;
    }
  }
  
  @page {
    margin: 0.3in;
    size: A4 landscape;
  }
`;

// Inject print styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = printStyles;
  if (!document.head.querySelector('[data-print-styles-marklist]')) {
    styleSheet.setAttribute('data-print-styles-marklist', 'true');
    document.head.appendChild(styleSheet);
  }
}

const ClassMarklist = ({ students, selectedClass }) => {
  // Get subjects based on the selected class or first student's class
  const currentClass = selectedClass || (students.length > 0 ? students[0].class : 'Grade 1');
  const subjects = getSubjectsByClass(currentClass);

  // Sort students by mean score (descending)
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const meanA = typeof a.mean === 'number' ? a.mean : 0;
      const meanB = typeof b.mean === 'number' ? b.mean : 0;
      return meanB - meanA;
    });
  }, [students]);

  const currentDate = new Date().toLocaleDateString();
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
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '8px'
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
    },
      
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