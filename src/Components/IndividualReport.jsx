
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
  const { name, mean, rubric, class: studentClass, ...subjectMarks } = student;
  const letterhead = useLetterhead();

  const classAverage = useMemo(() => {
    const validMeans = classData.map(s => s.mean).filter(mean => mean !== null);
    return validMeans.length ? validMeans.reduce((a, b) => a + b, 0) / validMeans.length : 0;
  }, [classData]);

  const subjects = getSubjectsByClass(studentClass);

  const data = {
    labels: ['Student Performance', 'Class Average'],
    datasets: [
      {
        label: `${name}'s Performance`,
        data: [mean || 0, classAverage],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Class Average',
        data: [classAverage, classAverage],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10,
        fill: false,
        tension: 0.4,
        borderDash: [10, 5],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: 'bold' }
        }
      },
      title: {
        display: true,
        text: 'Performance Comparison',
        font: { size: 18, weight: 'bold' },
        color: '#2c3e50',
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#4a90e2',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0,0,0,0.1)',
          lineWidth: 1
        },
        ticks: {
          color: '#2c3e50',
          font: { size: 12 }
        }
      },
      x: {
        grid: {
          color: 'rgba(0,0,0,0.1)',
          lineWidth: 1
        },
        ticks: {
          color: '#2c3e50',
          font: { size: 12 }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      lineHeight: '1.6'
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
      marginBottom: '20px',
      textAlign: 'center',
      borderBottom: '2px solid #ecf0f1',
      paddingBottom: '15px'
    },
    infoSection: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '25px',
      border: '1px solid #e9ecef'
    },
    infoItem: {
      margin: '8px 0',
      fontSize: '16px',
      color: '#2c3e50'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '25px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
    },
    tableHeader: {
      backgroundColor: '#4a90e2',
      color: '#fff',
      fontWeight: 'bold',
      padding: '15px 12px',
      textAlign: 'left',
      fontSize: '14px',
      borderBottom: '2px solid #357abd'
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #e9ecef',
      fontSize: '14px',
      color: '#2c3e50'
    },
    tableRowEven: {
      backgroundColor: '#f8f9fa'
    },
    tableRowOdd: {
      backgroundColor: '#fff'
    },
    overallSection: {
      backgroundColor: '#e8f4fd',
      padding: '20px',
      borderRadius: '8px',
      border: '2px solid #4a90e2',
      marginBottom: '25px'
    },
    overallText: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '10px'
    },
    remarkText: {
      fontSize: '14px',
      color: '#34495e',
      fontStyle: 'italic',
      lineHeight: '1.5'
    },
    chartContainer: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      marginTop: '20px'
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
        Individual Academic Report
      </h2>

      <div style={styles.infoSection}>
        <div style={styles.infoItem}>
          <strong>Student Name:</strong> {name}
        </div>
        {studentClass && (
          <div style={styles.infoItem}>
            <strong>Class:</strong> {studentClass}
          </div>
        )}
        <div style={styles.infoItem}>
          <strong>Class Position:</strong> {student.position || 'N/A'}
        </div>
      </div>

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

      <div style={styles.overallSection}>
        <div style={styles.overallText}>
          Overall Performance: {mean != null ? mean.toFixed(2) : 'N/A'} | Rubric: {rubric || 'N/A'}
        </div>
        <div style={styles.remarkText}>
          {rubric ? getOverallRemark(rubric) : 'Performance data not available.'}
        </div>
      </div>

      <div style={{...styles.chartContainer, height: '400px'}}>
        <Line data={data} options={chartOptions} />
      </div>
    </div>
  );
};

export default IndividualReport;