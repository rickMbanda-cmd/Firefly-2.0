import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
// import './styles.css'; // Assuming styles are moved to a CSS file

const ClassMarklist = ({ students }) => {
  // Ensure all means are numbers and not null/undefined
  const validMeans = useMemo(
    () => students.map(s => typeof s.mean === 'number' ? s.mean : null).filter(mean => mean !== null),
    [students]
  );
  const classAverage = useMemo(
    () => validMeans.length ? validMeans.reduce((a, b) => a + b, 0) / validMeans.length : 0,
    [validMeans]
  );
  const letterhead = useMemo(() => {
    const storedLetterhead = localStorage.getItem('letterhead');
    return storedLetterhead ? JSON.parse(storedLetterhead) : {
      logoUrl: 'Letterhead.png',
      schoolName: 'Spring Valley Baptist Children Centre & School',
      address: 'P.O. Box 396-00518, Kayole Junction, Nairobi, Kenya',
      phone: 'Your School Phone',
    };
  }, []);

  // Get class name from the first student (if available)
  const className = students.length > 0 && students[0].class ? students[0].class : '';

  return (
    <div className="class-marklist">
      <div className="header">
        {letterhead.logoUrl && <img src={letterhead.logoUrl} className="logo" alt="Logo" />}
        <h2>{letterhead.schoolName}</h2>
        <p>{letterhead.address} | {letterhead.phone}</p>
      </div>
      <h3>Class Marklist{className && ` - ${className}`}</h3>
      <table className="table">
        <thead style={{ backgroundColor: '#f5f5f5' }}>
          <tr>
            <th>Name</th>
            <th>Math</th>
            <th>English</th>
            <th>Science</th>
            <th>Mean</th>
            <th>Rubric</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id || student._id}>
              <td>{student.name || 'N/A'}</td>
              <td>{typeof student.math === 'number' && !isNaN(student.math) ? student.math : '-'}</td>
              <td>{typeof student.english === 'number' && !isNaN(student.english) ? student.english : '-'}</td>
              <td>{typeof student.science === 'number' && !isNaN(student.science) ? student.science : '-'}</td>
              <td>
                {typeof student.mean === 'number' && !isNaN(student.mean)
                  ? student.mean.toFixed(2)
                  : '-'}
              </td>
              <td>{student.rubric || '-'}</td>
              <td>{student.class || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><strong>Class Mean:</strong> {validMeans.length ? classAverage.toFixed(2) : '-'}</p>
    </div>
  );
};

ClassMarklist.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      math: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      english: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      science: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      mean: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      rubric: PropTypes.string,
      class: PropTypes.string,
    })
  ).isRequired,
};

export default ClassMarklist;