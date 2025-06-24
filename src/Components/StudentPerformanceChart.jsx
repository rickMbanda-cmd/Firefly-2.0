import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const StudentPerformanceChart = ({ students }) => {
  const [selectedId, setSelectedId] = useState(null);
  const selectedStudent = students.find(s => s.id === Number(selectedId));

  const classAverage = useMemo(() => {
    const validMeans = students.map(s => s.mean).filter(mean => mean !== null);
    return validMeans.length ? validMeans.reduce((a, b) => a + b, 0) / validMeans.length : 0;
  }, [students]);

  const selectedMean = selectedStudent?.mean ?? 0;

  const data = {
    labels: ['Student Mean', 'Class Average'],
    datasets: [{
      label: selectedStudent ? selectedStudent.name : 'Performance',
      data: [selectedMean, classAverage],
      backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(54,162,235,0.6)']
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Performance for ${selectedStudent?.name}` }
    }
  };

  return (
    <div className="student-performance-chart" style={{ marginTop: '2em' }}>
      <label htmlFor="studentSelect">Select Student: </label>
      <select
        id="studentSelect"
        value={selectedId || ""}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="" disabled>Select a student</option>
        {students.map(student => (
          <option key={student.id} value={student.id}>
            {student.name || `Student ${student.id}`}
          </option>
        ))}
      </select>
      {selectedStudent && (
        <div style={{ marginTop: '1em' }}>
          <Bar data={data} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default StudentPerformanceChart;