import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import IndividualReport from '../Components/IndividualReport';
import ClassMarklist from '../Components/ClassMarklist';
import ExamNavigation from '../Components/ExamNavigation';
import { fetchResults } from '../api/results';
import '../Components/examModuleStyles.css';

const Reports = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedExamType, setSelectedExamType] = useState('All Exams');
  const [marklistClass, setMarklistClass] = useState('All Classes');
  const [loading, setLoading] = useState(true);

  // Fetch all results on component mount
  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        const results = await fetchResults();
        setAllStudents(results);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, []);

  // Filter students based on selected class and exam type for individual reports
  const filteredStudents = useMemo(() => {
    let filtered = allStudents;

    if (selectedClass !== 'All Classes') {
      filtered = filtered.filter(student => student.class === selectedClass);
    }

    if (selectedExamType !== 'All Exams') {
      filtered = filtered.filter(student => student.examType === selectedExamType);
    }

    // Add ranking/position to filtered students
    const studentsWithMean = filtered.filter(s => typeof s.mean === 'number' && !isNaN(s.mean));
    const studentsWithoutMean = filtered.filter(s => !(typeof s.mean === 'number' && !isNaN(s.mean)));

    // Sort by mean score in descending order and add position
    studentsWithMean.sort((a, b) => b.mean - a.mean);
    studentsWithMean.forEach((student, index) => {
      student.position = index + 1;
    });

    // Students without valid means get no position
    studentsWithoutMean.forEach(student => {
      student.position = '-';
    });

    return [...studentsWithMean, ...studentsWithoutMean];
  }, [allStudents, selectedClass, selectedExamType]);

  // Filter students for marklist based on marklist class selection
  const marklistStudents = useMemo(() => {
    let filtered = allStudents;

    if (marklistClass !== 'All Classes') {
      filtered = filtered.filter(student => student.class === marklistClass);
    }

    if (selectedExamType !== 'All Exams') {
      filtered = filtered.filter(student => student.examType === selectedExamType);
    }

    // Add ranking/position to marklist students
    const studentsWithMean = filtered.filter(s => typeof s.mean === 'number' && !isNaN(s.mean));
    const studentsWithoutMean = filtered.filter(s => !(typeof s.mean === 'number' && !isNaN(s.mean)));

    // Sort by mean score in descending order and add position
    studentsWithMean.sort((a, b) => b.mean - a.mean);
    studentsWithMean.forEach((student, index) => {
      student.position = index + 1;
    });

    // Students without valid means get no position
    studentsWithoutMean.forEach(student => {
      student.position = '-';
    });

    return [...studentsWithMean, ...studentsWithoutMean];
  }, [allStudents, marklistClass, selectedExamType]);

  // Get unique classes and exam types for filters
  const availableClasses = useMemo(() => {
    const classes = [...new Set(allStudents.map(s => s.class).filter(Boolean))];
    return ['All Classes', ...classes];
  }, [allStudents]);

  const availableExamTypes = useMemo(() => {
    const examTypes = [...new Set(allStudents.map(s => s.examType).filter(Boolean))];
    return ['All Exams', ...examTypes];
  }, [allStudents]);

  const [selectedStudentId, setSelectedStudentId] = useState("");

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
        button, nav, .exam-nav, .no-print { display: none !important; }
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
        button, nav, .exam-nav, .no-print { display: none !important; }
      }
    `
  });

  const selectedStudent = useMemo(() =>
    filteredStudents.find(s => (s.id || s._id) === selectedStudentId),
    [filteredStudents, selectedStudentId]
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

  if (loading) {
    return (
      <div className="exam-module-container">
        <ExamNavigation />
        <h1>Reports and Printing</h1>
        <p>Loading student data...</p>
      </div>
    );
  }

  const modernStyles = {
    container: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    },
    contentWrapper: {
      maxWidth: '1600px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: '3rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '10px',
      letterSpacing: '-1px'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#6b7280',
      fontWeight: '400'
    },
    filtersContainer: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px',
      display: 'flex',
      gap: '24px',
      alignItems: 'center',
      flexWrap: 'wrap',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
    },
    label: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#374151',
      letterSpacing: '0.5px',
      marginRight: '12px'
    },
    select: {
      padding: '12px 16px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      fontSize: '1rem',
      color: '#374151',
      fontWeight: '500',
      background: '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      outline: 'none',
      minWidth: '160px'
    },
    sectionHeader: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '24px',
      padding: '16px 0',
      borderBottom: '3px solid #e5e7eb'
    }
  };

  return (
    <div style={modernStyles.container}>
      <ExamNavigation />
      <div style={modernStyles.contentWrapper}>
        <div style={modernStyles.header}>
          <h1 style={modernStyles.title}>Reports and Printing</h1>
          <p style={modernStyles.subtitle}>Generate and print comprehensive student reports</p>
        </div>

        {/* Global Filter Controls */}
        <div className="no-print" style={modernStyles.filtersContainer}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label htmlFor="examFilter" style={modernStyles.label}>
              Filter by Exam:
            </label>
            <select
              id="examFilter"
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              style={modernStyles.select}
            >
              {availableExamTypes.map(examType => (
                <option key={examType} value={examType}>
                  {examType === 'opener' ? 'Opener' : 
                   examType === 'midterm' ? 'Midterm' : 
                   examType === 'endterm' ? 'Endterm' : examType}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={modernStyles.sectionHeader}>📄 Individual Report</h2>

        {/* Filters */}
        <div className="no-print" style={{ display: 'flex', gap: '1em', alignItems: 'center', marginBottom: '1em', flexWrap: 'wrap' }}>
          <div>
            <label htmlFor="individualClassFilter" style={{ marginRight: '0.5em' }}>
              Filter by Class:
            </label>
            <select
              id="individualClassFilter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {availableClasses.map(className => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
            Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
          </div>
        </div>

        <label htmlFor="studentSelect" style={{ marginRight: '0.5em' }}>
          Select Student:
        </label>
        <select
          id="studentSelect"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          style={{ padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Select a student...</option>
          {filteredStudents.filter(Boolean).map(student => (
            <option key={student.id || student._id} value={student.id || student._id}>
              {student.name || `Student ${student.id || student._id}`} 
              {student.class && ` (${student.class})`}
              {student.examType && ` - ${student.examType}`}
            </option>
          ))}
        </select>
        {selectedStudent && (
          <div ref={individualRef} style={styles.report}>
            <IndividualReport student={selectedStudent} classData={filteredStudents} />
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

        {/* Filters */}
        <div className="no-print" style={{ display: 'flex', gap: '1em', alignItems: 'center', marginBottom: '1em', flexWrap: 'wrap' }}>
          <div>
            <label htmlFor="marklistClassFilter" style={{ marginRight: '0.5em' }}>
              Select Class for Marklist:
            </label>
            <select
              id="marklistClassFilter"
              value={marklistClass}
              onChange={(e) => setMarklistClass(e.target.value)}
              style={{ padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {availableClasses.map(className => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
            Showing {marklistStudents.length} student{marklistStudents.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div ref={classRef} style={styles.report}>
          <ClassMarklist 
            students={marklistStudents.filter(Boolean)} 
            selectedClass={marklistClass !== 'All Classes' ? marklistClass : null}
          />
        </div>
        <button
          onClick={handlePrintClass}
          style={styles.button}
          disabled={marklistStudents.length === 0}
        >
          Print Class Marklist
        </button>
      </div>
      </div>
    </div>
  );
};

export default Reports;