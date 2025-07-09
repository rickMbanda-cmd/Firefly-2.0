import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { getSubjectsByClass, getSubjectDisplayName, getRubric } from '../Utils/subjectsByClass';

// Add print styles
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
      page-break-inside: avoid;
      border-collapse: collapse !important;
    }
    
    tr {
      page-break-inside: avoid;
    }
    
    .page-break {
      page-break-before: always;
    }
    
    img {
      max-width: 100% !important;
      height: auto !important;
    }
  }
  
  @page {
    margin: 0.5in;
    size: A4;
  }
`;

// Inject print styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = printStyles;
  if (!document.head.querySelector('[data-print-styles]')) {
    styleSheet.setAttribute('data-print-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, Filler);

const useLetterhead = () => {
  return {
    logoUrl: 'Letterhead.png'
  };
};

const getSubjectRemark = (rubric) => {
  const remarks = {
    'E.E': 'Excellent',
    'M.E': 'Outstanding',
    'A.E': 'You can do better',
    'B.E': 'Needs improved study habits'
  };
  return remarks[rubric] || remarks['B.E'];
};

const getOverallRemark = (rubric) => {
  const remarks = {
    'E.E': 'An exemplary learner; continues to set the bar for others.',
    'M.E': 'Has a good grasp of concepts and shows steady improvement.',
    'A.E': 'Beginning to understand core ideas; would benefit from targeted support.',
    'B.E': 'Can do better with increased effort and a structured learning plan.'
  };
  return remarks[rubric] || remarks['B.E'];
};

const IndividualReport = ({ student, classData }) => {
  const letterhead = useLetterhead();

  // Get subjects from the student's class
  const subjects = getSubjectsByClass(student.class);

  // Extract subject marks
  const subjectMarks = {};
  subjects.forEach(subject => {
    subjectMarks[subject] = student[subject];
  });

  // Calculate class statistics
  const classStats = useMemo(() => {
    if (!classData || classData.length === 0) return null;

    const validMeans = classData
      .map(s => s.mean)
      .filter(mean => typeof mean === 'number' && !isNaN(mean));

    if (validMeans.length === 0) return null;

    const sum = validMeans.reduce((a, b) => a + b, 0);
    const average = sum / validMeans.length;
    const highest = Math.max(...validMeans);
    const lowest = Math.min(...validMeans);

    return { average, highest, lowest };
  }, [classData]);

  // Get student's position in class
  const studentPosition = useMemo(() => {
    if (!classData || classData.length === 0) return null;

    const sorted = [...classData]
      .filter(s => typeof s.mean === 'number' && !isNaN(s.mean))
      .sort((a, b) => b.mean - a.mean);

    const position = sorted.findIndex(s => s._id === student._id || s.id === student.id);
    return position >= 0 ? position + 1 : null;
  }, [classData, student]);

  const currentDate = new Date().toLocaleDateString();
  const examType = student.examType;
  const displayExamType = examType === 'opener' ? 'Opener' : 
                         examType === 'midterm' ? 'Midterm' : 
                         examType === 'endterm' ? 'Endterm' : examType;

  const overallRubric = student.rubric || getRubric(student.mean);
  const overallRemark = getOverallRemark(overallRubric);

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      '@media print': {
        boxShadow: 'none',
        margin: '0',
        padding: '10px',
        maxWidth: 'none'
      }
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
      fontSize: '16px'
    },
    studentInfo: {
      marginBottom: '25px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },
    label: {
      fontWeight: 'bold',
      color: '#495057'
    },
    value: {
      color: '#6c757d'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
    },
    tableHeader: {
      backgroundColor: '#3498db',
      color: '#fff',
      fontWeight: 'bold',
      padding: '12px',
      textAlign: 'left',
      borderBottom: '2px solid #2980b9'
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #ecf0f1'
    },
    tableRowEven: {
      backgroundColor: '#f8f9fa'
    },
    tableRowOdd: {
      backgroundColor: '#fff'
    },
    statsSection: {
      marginBottom: '25px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px'
    },
    statItem: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    statLabel: {
      fontWeight: 'bold',
      color: '#495057'
    },
    statValue: {
      color: '#6c757d'
    },
    remarksSection: {
      padding: '15px',
      backgroundColor: '#fff3cd',
      borderRadius: '6px',
      border: '1px solid #ffeaa7'
    },
    overallRemark: {
      fontSize: '16px',
      lineHeight: '1.5',
      color: '#495057'
    },
    signatureSection: {
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: '30px'
    },
    signature: {
      textAlign: 'center'
    },
    signatureLine: {
      borderBottom: '1px solid #000',
      marginBottom: '5px',
      width: '150px',
      margin: '0 auto'
    },
    signatureLabel: {
      color: '#777',
      fontSize: '14px'
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

      {/* Report Title */}
      <div style={styles.titleSection}>
        <h2 style={styles.reportTitle}>INDIVIDUAL ACADEMIC REPORT</h2>
        <p style={styles.subtitle}>
          {displayExamType} Examination - {currentDate}
        </p>
      </div>

      {/* Student Information */}
      <div style={styles.studentInfo}>
        <div style={styles.infoRow}>
          <span style={styles.label}>Student Name:</span>
          <span style={styles.value}>{student.name}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Class:</span>
          <span style={styles.value}>{student.class}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Position:</span>
          <span style={styles.value}>{studentPosition || '-'}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Overall Mean:</span>
          <span style={styles.value}>
            {typeof student.mean === 'number' ? student.mean.toFixed(1) : '-'}
          </span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Overall Rubric:</span>
          <span style={styles.value}>{overallRubric}</span>
        </div>
      </div>

      {/* Subject Performance Table */}
      <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '18px' }}>Subject Performance</h3>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Subject</th>
            <th style={styles.tableHeader}>Marks</th>
            <th style={styles.tableHeader}>Rubric</th>
            <th style={styles.tableHeader}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => {
            const score = subjectMarks[subject];
            const subjectRubric = typeof score === 'number' ? getRubric(score) : '-';
            const remark = typeof score === 'number' ? getSubjectRemark(subjectRubric) : '-';

            return (
              <tr 
                key={subject} 
                style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
              >
                <td style={styles.tableCell}>
                  <strong>{getSubjectDisplayName(subject)}</strong>
                </td>
                <td style={styles.tableCell}>
                  {typeof score === 'number' ? score.toFixed(1) : '-'}
                </td>
                <td style={styles.tableCell}>{subjectRubric}</td>
                <td style={styles.tableCell}>{remark}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Class Statistics */}
      {classStats && (
        <div style={styles.statsSection}>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '18px' }}>Class Statistics</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Class Average:</span>
              <span style={styles.statValue}>{classStats.average.toFixed(1)}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Highest Score:</span>
              <span style={styles.statValue}>{classStats.highest.toFixed(1)}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Lowest Score:</span>
              <span style={styles.statValue}>{classStats.lowest.toFixed(1)}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Total Students:</span>
              <span style={styles.statValue}>{classData.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Remarks */}
      <div style={styles.remarksSection}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '18px' }}>Overall Remarks</h3>
        <p style={styles.overallRemark}>{overallRemark}</p>
      </div>

      {/* Signature Section */}
      <div style={styles.signatureSection}>
        <div style={styles.signature}>
          <p style={styles.signatureLine}>_______________________</p>
          <p style={styles.signatureLabel}>Class Teacher</p>
        </div>
        <div style={styles.signature}>
          <p style={styles.signatureLine}>_______________________</p>
          <p style={styles.signatureLabel}>Head Teacher</p>
        </div>
      </div>
    </div>
  );
};

export default IndividualReport;