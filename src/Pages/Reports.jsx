
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

  return (
    <div className="exam-module-container">
      <ExamNavigation />
      <h1>Reports and Printing</h1>

      {/* Global Filter Controls */}
      <div style={{ ...styles.section, display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="examFilter" style={{ marginRight: '0.5em' }}>
            Filter by Exam:
          </label>
          <select
            id="examFilter"
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            style={{ padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc' }}
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
        <h2>Individual Report</h2>
        
        {/* Individual Report Class Filter */}
        <div style={{ display: 'flex', gap: '1em', alignItems: 'center', marginBottom: '1em', flexWrap: 'wrap' }}>
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
        
        {/* Class Marklist Class Filter */}
        <div style={{ display: 'flex', gap: '1em', alignItems: 'center', marginBottom: '1em', flexWrap: 'wrap' }}>
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
  );
};

export default Reports;