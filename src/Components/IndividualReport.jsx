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
// Print styles will be injected dynamically from the parent component

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, Filler);



const getSubjectRemark = (rubric) => {
  const remarks = {
    'Exceeds Expectations (E.E)': 'Excellent',
    'Meets Expectations (M.E)': 'Outstanding', 
    'Approaching Expectations (A.E)': 'You can do better',
    'Below Expectations (B.E)': 'Needs improved study habits'
  };
  
  // Handle both full rubric names and abbreviated forms
  if (rubric === 'E.E' || rubric === 'Exceeds Expectations (E.E)') {
    return remarks['Exceeds Expectations (E.E)'];
  }
  if (rubric === 'M.E' || rubric === 'Meets Expectations (M.E)') {
    return remarks['Meets Expectations (M.E)'];
  }
  if (rubric === 'A.E' || rubric === 'Approaching Expectations (A.E)') {
    return remarks['Approaching Expectations (A.E)'];
  }
  if (rubric === 'B.E' || rubric === 'Below Expectations (B.E)') {
    return remarks['Below Expectations (B.E)'];
  }
  
  return remarks[rubric] || remarks['Below Expectations (B.E)'];
};

const getOverallRemark = (rubric) => {
  const remarks = {
    'Exceeds Expectations (E.E)': 'An exemplary learner; continues to set the bar for others.',
    'Meets Expectations (M.E)': 'Has a good grasp of concepts and shows steady improvement.',
    'Approaching Expectations (A.E)': 'Beginning to understand core ideas; would benefit from targeted support.',
    'Below Expectations (B.E)': 'Can do better with increased effort and a structured learning plan.'
  };
  return remarks[rubric] || remarks['Below Expectations (B.E)'];
};

const IndividualReport = ({ student, classData }) => {

  // Get subjects from the student's class
  const subjects = getSubjectsByClass(student.class);

  // Extract subject marks and calculate total
  const subjectMarks = {};
  let totalMarks = 0;
  subjects.forEach(subject => {
    subjectMarks[subject] = student[subject];
    const score = parseFloat(student[subject]);
    if (!isNaN(score)) {
      totalMarks += score;
    }
  });

  // Calculate class statistics and subject averages
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

    // Calculate subject-wise class averages
    const subjectAverages = {};
    subjects.forEach(subject => {
      const subjectScores = classData
        .map(s => parseFloat(s[subject]))
        .filter(score => !isNaN(score));
      
      subjectAverages[subject] = subjectScores.length > 0 
        ? subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length 
        : 0;
    });

    return { average, highest, lowest, subjectAverages };
  }, [classData, subjects]);

  // Create chart data for student vs class comparison
  const chartData = useMemo(() => {
    if (!classStats || !classStats.subjectAverages) return null;

    const studentScores = subjects.map(subject => parseFloat(student[subject]) || 0);
    const classAverages = subjects.map(subject => classStats.subjectAverages[subject] || 0);
    const subjectLabels = subjects.map(subject => {
      const displayName = {
        'english': 'English',
        'kiswahili': 'Kiswahili',
        'mathematics': 'Mathematics',
        'science': 'Science',
        'socialStudies': 'Social Studies',
        'creativeArts': 'Creative Arts',
        'religiousEducation': 'Religious Education',
        'physicalEducation': 'Physical Education',
        'homeScience': 'Home Science',
        'agriculture': 'Agriculture',
        'premath': 'Pre-Math',
        'preTechnical': 'Pre-Technical',
        'environmentalActivities': 'Environmental Activities',
        'pshe': 'PSHE',
        'hygiene': 'Hygiene',
        'languageActivities': 'Language Activities',
        'literacy': 'Literacy',
        'numeracy': 'Numeracy'
      };
      return displayName[subject] || subject;
    });

    return {
      labels: subjectLabels,
      datasets: [
        {
          label: `${student.name} (Individual)`,
          data: studentScores,
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          pointBackgroundColor: 'rgba(99, 102, 241, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 8,
          pointHoverRadius: 10,
          borderWidth: 4,
          fill: true
        },
        {
          label: 'Class Average',
          data: classAverages,
          borderColor: 'rgba(239, 68, 68, 1)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          pointBackgroundColor: 'rgba(239, 68, 68, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 8,
          pointHoverRadius: 10,
          borderWidth: 4,
          fill: true
        }
      ]
    };
  }, [student, classStats, subjects]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false // Hide legend to save space - using custom legend below
      },
      title: { 
        display: false // Hide title to save space - using custom title
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Marks',
          font: {
            size: 11,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 10
          }
        }
      },
      x: {
        title: {
          display: false // Hide to save space
        },
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 30,
          minRotation: 0,
          font: {
            size: 9
          }
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#fff',
        hoverBorderWidth: 4
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // Get student's position in class - use the position already assigned to the student
  const studentPosition = student.position || null;

  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const examType = student.examType;
  const displayExamType = examType === 'opener' ? 'Opener' : 
                         examType === 'midterm' ? 'Midterm' : 
                         examType === 'endterm' ? 'Endterm' : examType;

  const overallRubric = student.rubric || getRubric(student.mean);

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
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#777',
      fontSize: '16px'
    },
    topSection: {
      display: 'flex',
      gap: '20px',
      marginBottom: '25px',
      '@media (max-width: 768px)': {
        flexDirection: 'column'
      }
    },
    studentInfoCompact: {
      flex: '0 0 300px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef'
    },
    chartContainer: {
      flex: '1',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      border: '2px solid #e9ecef',
      minHeight: '300px'
    },
    chartTitle: {
      color: '#2c3e50',
      fontSize: '16px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '15px',
      borderBottom: '2px solid #3498db',
      paddingBottom: '8px'
    },
    chartWrapper: {
      height: '220px',
      marginBottom: '10px'
    },
    chartLegend: {
      fontSize: '12px',
      color: '#1565c0',
      textAlign: 'center',
      fontStyle: 'italic',
      padding: '8px',
      backgroundColor: '#f0f8ff',
      borderRadius: '6px'
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
      borderBottom: '1px solid #ecf0f1',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
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

      {/* Student Information and Performance Chart Section */}
      <div style={styles.topSection}>
        {/* Student Information */}
        <div style={styles.studentInfoCompact}>
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
            <span style={styles.label}>Total Marks:</span>
            <span style={styles.value}>{totalMarks.toFixed(0)}</span>
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

        {/* Performance Comparison Chart */}
        {chartData && (
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>📊 Performance vs Class Average</h3>
            <div style={styles.chartWrapper}>
              <Line data={chartData} options={chartOptions} />
            </div>
            <div style={styles.chartLegend}>
              🔵 {student.name} | 🔴 Class Average
            </div>
          </div>
        )}
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

      

      

      {/* Overall Performance Summary */}
      <div style={{
        ...styles.remarksSection,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
        padding: '12px',
        marginBottom: '15px'
      }}>
        <h3 style={{ 
          color: '#fff', 
          marginBottom: '12px', 
          fontSize: '16px',
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          🎯 Overall Performance Summary
        </h3>
        <div style={{ 
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          <span style={{ 
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#fff'
          }}>
            Student's Overall Rubric: 
          </span>
          <span style={{ 
            padding: '6px 12px', 
            borderRadius: '20px', 
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            fontWeight: '700',
            fontSize: '14px',
            marginLeft: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            {overallRubric}
          </span>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '10px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p style={{
            ...styles.overallRemark,
            color: '#fff',
            fontSize: '13px',
            lineHeight: '1.4',
            textAlign: 'center',
            margin: '0'
          }}>
            <strong>Performance Remarks: </strong>{getOverallRemark(overallRubric)}
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default IndividualReport;