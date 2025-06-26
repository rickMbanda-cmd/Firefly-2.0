
import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { getSubjectsByClass, getSubjectDisplayName } from '../Utils/subjectsByClass';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const StudentPerformanceChart = ({ students, selectedClass }) => {
  const [selectedId, setSelectedId] = useState(null);
  const selectedStudent = students.find(s => s.id === Number(selectedId));
  
  const subjects = getSubjectsByClass(selectedClass);

  const classAveragesBySubject = useMemo(() => {
    const averages = {};
    subjects.forEach(subject => {
      const validScores = students
        .map(s => parseFloat(s[subject]))
        .filter(score => !isNaN(score));
      averages[subject] = validScores.length > 0 
        ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
        : 0;
    });
    return averages;
  }, [students, subjects]);

  const chartData = useMemo(() => {
    if (!selectedStudent) return null;

    const studentScores = subjects.map(subject => parseFloat(selectedStudent[subject]) || 0);
    const classAverages = subjects.map(subject => classAveragesBySubject[subject]);
    const subjectLabels = subjects.map(subject => getSubjectDisplayName(subject));

    return {
      labels: subjectLabels,
      datasets: [
        {
          label: selectedStudent.name || `Student ${selectedStudent.id}`,
          data: studentScores,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          tension: 0.4,
          pointBackgroundColor: 'rgba(75,192,192,1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
        },
        {
          label: 'Class Average',
          data: classAverages,
          borderColor: 'rgba(255,99,132,1)',
          backgroundColor: 'rgba(255,99,132,0.2)',
          tension: 0.4,
          pointBackgroundColor: 'rgba(255,99,132,1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
        }
      ]
    };
  }, [selectedStudent, subjects, classAveragesBySubject]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      title: { 
        display: true, 
        text: `Performance Comparison - ${selectedStudent?.name || 'Select Student'}`,
        font: {
          size: 16,
          weight: 'bold'
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
            size: 14,
            weight: 'bold'
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Subjects',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  };

  return (
    <div className="student-performance-chart" style={{ marginTop: '2em' }}>
      <label htmlFor="studentSelect" style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
        Select Student for Performance Comparison: 
      </label>
      <select
        id="studentSelect"
        value={selectedId || ""}
        onChange={(e) => setSelectedId(e.target.value)}
        style={{
          padding: '0.5em 1em',
          borderRadius: 8,
          border: '1px solid #2355d6',
          fontSize: '1em',
          color: '#2355d6',
          fontWeight: 500,
          background: '#fff',
          marginLeft: '0.5em'
        }}
      >
        <option value="" disabled>Select a student</option>
        {students.map(student => (
          <option key={student.id} value={student.id}>
            {student.name || `Student ${student.id}`}
          </option>
        ))}
      </select>
      {selectedStudent && chartData && (
        <div style={{ 
          marginTop: '1.5em', 
          backgroundColor: '#f8f9fa', 
          padding: '1.5em', 
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default StudentPerformanceChart;