import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import IndividualReport from '../Components/IndividualReport';
import ClassMarklist from '../Components/ClassMarklist';
import ExamNavigation from '../Components/ExamNavigation';
import '../Components/examModuleStyles.css';

// Example initial data (replace with your actual data source)
const initialStudents = [
  { id: 1, name: 'John Doe', math: 90, english: 85, science: 88, mean: 87.67, rubric: 'A' },
  { id: 2, name: 'Jane Smith', math: 78, english: 92, science: 80, mean: 83.33, rubric: 'B' }
];

const Reports = () => {
  const [students] = useState(initialStudents);
  const [selectedStudentId, setSelectedStudentId] = useState(
    students.length > 0 ? students[0].id : ""
  );

  const individualRef = useRef();
  const classRef = useRef();

  // Memoize print handlers for performance and to avoid unnecessary re-renders
  const handlePrintIndividual = useReactToPrint({
    content: useCallback(() => individualRef.current, [individualRef]),
    documentTitle: 'Individual Report',
    removeAfterPrint: true,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .exam-module-container {
          box-shadow: none !important;
          background: #fff !important;
        }
        button, nav, .exam-nav { display: none !important; }
      }
    `
  });

  const handlePrintClass = useReactToPrint({
    content: useCallback(() => classRef.current, [classRef]),
    documentTitle: 'Class Marklist',
    removeAfterPrint: true,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .exam-module-container {
          box-shadow: none !important;
          background: #fff !important;
        }
        button, nav, .exam-nav { display: none !important; }
      }
    `
  });

  const selectedStudent = useMemo(() =>
    students.find(s => s.id === Number(selectedStudentId)),
    [students, selectedStudentId]
  );

  const styles = {
    container: { padding: '2em', fontFamily: 'sans-serif' },
    section: { marginBottom: '2em' },
    report: { marginTop: '1em', border: '1px solid #aaa', padding: '1em', borderRadius: '8px', background: '#fff' },
    button: {
      marginTop: '1em',
      padding: '1em 1.5em',
      cursor: 'pointer',
      background: 'linear-gradient(90deg, #4f8cff 0%, #2355d6 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 500,
      fontSize: '1.05em',
      transition: 'background 0.2s, transform 0.2s',
      boxShadow: '0 2px 8px rgba(79,140,255,0.08)'
    }
  };

  return (
    <div className="exam-module-container">
      <ExamNavigation />
      <h1>Reports and Printing</h1>

      <div style={styles.section}>
        <h2>Individual Report</h2>
        <label htmlFor="studentSelect" style={{ marginRight: '0.5em' }}>
          Select Student:
        </label>
        <select
          id="studentSelect"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
        >
          {students.filter(Boolean).map(student => (
            <option key={student.id} value={student.id}>
              {student.name || `Student ${student.id}`}
            </option>
          ))}
        </select>
        {selectedStudent && (
          <div ref={individualRef} style={styles.report}>
            <IndividualReport student={selectedStudent} classData={students} />
          </div>
        )}
        <button
          onClick={handlePrintIndividual}
          style={styles.button}
          disabled={!selectedStudent}
        >
          Print Individual Report
        </button>
      </div>

      <div>
        <h2>Class Marklist</h2>
        <div ref={classRef} style={styles.report}>
          <ClassMarklist students={students.filter(Boolean)} />
        </div>
        <button
          onClick={handlePrintClass}
          style={styles.button}
        >
          Print Class Marklist
        </button>
      </div>
    </div>
  );
};

export default Reports;