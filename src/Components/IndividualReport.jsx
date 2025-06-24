import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
//import './styles.css'; // Assuming external CSS is used

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const useLetterhead = () => {
  const storedLetterhead = localStorage.getItem('letterhead');
  return storedLetterhead ? JSON.parse(storedLetterhead) : {
    logoUrl: 'https://via.placeholder.com/150',
    schoolName: 'Your School Name',
    address: 'Your School Address',
    phone: 'Your School Phone',
  };
};

const IndividualReport = ({ student: { name, mean, rubric, class: studentClass }, classData }) => {
  const letterhead = useLetterhead();

  const classAverage = useMemo(() => {
    const validMeans = classData.map(s => s.mean).filter(mean => mean !== null);
    return validMeans.length ? validMeans.reduce((a, b) => a + b, 0) / validMeans.length : 0;
  }, [classData]);

  const data = {
    labels: ['Student Mean', 'Class Average'],
    datasets: [
      {
        label: name,
        data: [mean || 0, classAverage],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Performance Comparison',
      },
    },
  };

  return (
    <div className="report-container">
      <div className="letterhead">
        {letterhead.logoUrl && (
          <img src={letterhead.logoUrl} className="logo" alt={`${letterhead.schoolName} Logo`} />
        )}
        <h2>{letterhead.schoolName}</h2>
        <p>{letterhead.address} | {letterhead.phone}</p>
      </div>
      <h3>
        Individual Report for {name}
        {studentClass && <span> &mdash; <strong>Class: {studentClass}</strong></span>}
      </h3>
      <p>
        <strong>Student Mean:</strong> {mean != null ? mean.toFixed(2) : 'Data not available'}
      </p>
      <p>
        <strong>Assessment Rubric:</strong> {rubric || 'No rubric provided'}
      </p>
      <div className="graph-container">
        <Bar data={data} options={chartOptions} />
      </div>
    </div>
  );
};

export default IndividualReport;