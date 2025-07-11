import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [printOrientation, setPrintOrientation] = useState("portrait");
  const individualRef = useRef();
  const classRef = useRef();

  // Fetch all results on component mount
  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        const results = await fetchResults();
        // Ensure results is always an array
        setAllStudents(Array.isArray(results) ? results : []);
      } catch (error) {
        console.error('Error fetching results:', error);
        setAllStudents([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, []);

  // Filter students based on selected class and exam type for individual reports
  const filteredStudents = useMemo(() => {
    // Ensure allStudents is an array before filtering
    let filtered = Array.isArray(allStudents) ? allStudents : [];

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

    // Filter students based on search term
    const searchFilteredStudents = useMemo(() => {
      if (!studentSearchTerm.trim()) return filteredStudents;
      return filteredStudents.filter(student => 
        student.name?.toLowerCase().includes(studentSearchTerm.toLowerCase())
      );
    }, [filteredStudents, studentSearchTerm]);

    const selectedStudent = useMemo(() =>
      filteredStudents.find(s => (s.id || s._id) === selectedStudentId),
      [filteredStudents, selectedStudentId]
    );

  // Filter students for marklist based on marklist class selection
  const marklistStudents = useMemo(() => {
    // Ensure allStudents is an array before filtering
    let filtered = Array.isArray(allStudents) ? allStudents : [];

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


  // Download handlers
  const handleDownloadIndividual = useCallback(async () => {
    if (!selectedStudent || !individualRef.current) return;

    try {
      // Hide buttons and navigation during capture
      const style = document.createElement('style');
      style.innerHTML = `
        .no-print { display: none !important; }
        button { display: none !important; }
        nav { display: none !important; }
        .exam-nav { display: none !important; }
      `;
      document.head.appendChild(style);

      const canvas = await html2canvas(individualRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: individualRef.current.scrollWidth,
        height: individualRef.current.scrollHeight
      });

      // Remove the temporary style
      document.head.removeChild(style);

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF(printOrientation, 'mm', 'a4');
      let position = 0;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Individual_Report_${selectedStudent.name}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  }, [selectedStudent, printOrientation]);

  const handleDownloadClass = useCallback(async () => {
    if (!classRef.current || marklistStudents.length === 0) return;

    try {
      // Hide buttons and navigation during capture
      const style = document.createElement('style');
      style.innerHTML = `
        .no-print { display: none !important; }
        button { display: none !important; }
        nav { display: none !important; }
        .exam-nav { display: none !important; }
      `;
      document.head.appendChild(style);

      const canvas = await html2canvas(classRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: classRef.current.scrollWidth,
        height: classRef.current.scrollHeight
      });

      // Remove the temporary style
      document.head.removeChild(style);

      const orientation = printOrientation === 'landscape' ? 'l' : 'p';
      const pdf = new jsPDF(orientation, 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasAspectRatio = canvas.height / canvas.width;
      const pdfAspectRatio = pdfHeight / pdfWidth;

      let imgWidth, imgHeight;
      if (canvasAspectRatio > pdfAspectRatio) {
        imgHeight = pdfHeight;
        imgWidth = imgHeight / canvasAspectRatio;
      } else {
        imgWidth = pdfWidth;
        imgHeight = imgWidth * canvasAspectRatio;
      }

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, imgWidth, imgHeight);

      const className = marklistClass !== 'All Classes' ? marklistClass : 'All';
      pdf.save(`Class_Marklist_${className}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  }, [marklistStudents, marklistClass, printOrientation]);


  // Memoize print handlers for performance and to avoid unnecessary re-renders
  const handlePrintIndividual = useReactToPrint({
    contentRef: individualRef,
    documentTitle: `Individual_Report_${selectedStudent?.name || 'Student'}`,
    removeAfterPrint: true,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        // Remove any existing print styles
        const existingStyles = document.querySelectorAll('[data-print-styles]');
        existingStyles.forEach(style => style.remove());

        // Add new print styles with current orientation
        const printStyles = `
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              margin: 0;
              padding: 0;
            }
            .exam-module-container {
              box-shadow: none !important;
              background: #fff !important;
            }
            button, nav, .exam-nav, .no-print { display: none !important; }
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
            size: A4 ${printOrientation};
          }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = printStyles;
        styleSheet.setAttribute('data-print-styles', 'true');
        document.head.appendChild(styleSheet);

        setTimeout(resolve, 100);
      });
    }
  });

  const handlePrintClass = useReactToPrint({
    contentRef: classRef,
    documentTitle: `Class_Marklist_${marklistClass !== 'All Classes' ? marklistClass : 'All'}`,
    removeAfterPrint: true,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        // Remove any existing print styles
        const existingStyles = document.querySelectorAll('[data-print-styles-marklist]');
        existingStyles.forEach(style => style.remove());

        // Add new print styles with current orientation
        const printStyles = `
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              margin: 0;
              padding: 0;
            }
            .exam-module-container {
              box-shadow: none !important;
              background: #fff !important;
            }
            button, nav, .exam-nav, .no-print { display: none !important; }
            .print-container {
              margin: 0 !important;
              padding: 10px !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              max-width: none !important;
              width: 100% !important;
            }
            table {
              page-break-inside: auto;
              border-collapse: collapse !important;
              width: 100% !important;
              font-size: ${printOrientation === 'landscape' ? '10px' : '9px'} !important;
            }
            thead {
              display: table-header-group;
            }
            tr {
              page-break-inside: avoid;
            }
            th, td {
              padding: ${printOrientation === 'landscape' ? '6px 4px' : '4px 2px'} !important;
              font-size: ${printOrientation === 'landscape' ? '10px' : '9px'} !important;
              border: 1px solid #000 !important;
            }
            img {
              max-width: 100% !important;
              height: auto !important;
            }
            .table-wrapper {
              overflow: visible !important;
              max-height: none !important;
            }
          }
          @page {
            margin: 0.3in;
            size: A4 ${printOrientation};
          }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = printStyles;
        styleSheet.setAttribute('data-print-styles-marklist', 'true');
        document.head.appendChild(styleSheet);

        setTimeout(resolve, 100);
      });
    }
  });

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

        <div style={{ display: 'flex', gap: '1em', alignItems: 'center', marginBottom: '1em', flexWrap: 'wrap' }}>
          <div>
            <label htmlFor="studentSelect" style={{ marginRight: '0.5em' }}>
              Select Student:
            </label>
            <select
              id="studentSelect"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              style={{ padding: '0.5em', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
            >
              <option value="">Select a student...</option>
              {searchFilteredStudents.filter(Boolean).map(student => (
                <option key={student.id || student._id} value={student.id || student._id}>
                  {student.name || `Student ${student.id || student._id}`} 
                  {student.class && ` (${student.class})`}
                  {student.examType && ` - ${student.examType}`}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
            <label htmlFor="studentSearch" style={{ marginRight: '0.5em' }}>
              Search Students:
            </label>
            <input
              id="studentSearch"
              type="text"
              value={studentSearchTerm}
              onChange={(e) => setStudentSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchFilteredStudents.length > 0) {
                  setSelectedStudentId(searchFilteredStudents[0].id || searchFilteredStudents[0]._id);
                }
              }}
              placeholder="Search by name..."
              style={{ 
                padding: '0.5em', 
                borderRadius: '4px', 
                border: '1px solid #ccc',
                minWidth: '200px'
              }}
            />
            <button
              onClick={() => {
                if (searchFilteredStudents.length > 0) {
                  setSelectedStudentId(searchFilteredStudents[0].id || searchFilteredStudents[0]._id);
                }
              }}
              disabled={searchFilteredStudents.length === 0}
              style={{
                padding: '0.5em 1em',
                borderRadius: '4px',
                border: '1px solid #4f8cff',
                backgroundColor: searchFilteredStudents.length > 0 ? '#4f8cff' : '#ccc',
                color: '#fff',
                cursor: searchFilteredStudents.length > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3em'
              }}
            >
              🔍 Search
            </button>
          </div>
        </div>
        {selectedStudent && (
          <div ref={individualRef} style={styles.report}>
            <IndividualReport student={selectedStudent} classData={filteredStudents} />
          </div>
        )}
        {/* Print Options */}
        <div className="no-print" style={{ margin: '1em 0', padding: '1em', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <label style={{ fontWeight: 'bold', marginRight: '1em' }}>Print Orientation:</label>
          <label style={{ marginRight: '1em' }}>
            <input
              type="radio"
              value="portrait"
              checked={printOrientation === 'portrait'}
              onChange={(e) => setPrintOrientation(e.target.value)}
              style={{ marginRight: '0.5em' }}
            />
            Portrait
          </label>
          <label>
            <input
              type="radio"
              value="landscape"
              checked={printOrientation === 'landscape'}
              onChange={(e) => setPrintOrientation(e.target.value)}
              style={{ marginRight: '0.5em' }}
            />
            Landscape
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={handlePrintIndividual}
          style={{
            ...styles.button,
            opacity: !selectedStudent ? 0.6 : 1,
            cursor: !selectedStudent ? 'not-allowed' : 'pointer'
          }}
          disabled={!selectedStudent}
        >
          Print Individual Report ({printOrientation})
        </button>
        <button
          onClick={handleDownloadIndividual}
          style={{
            ...styles.button,
            backgroundColor: '#28a745',
            opacity: !selectedStudent ? 0.6 : 1,
            cursor: !selectedStudent ? 'not-allowed' : 'pointer'
          }}
          disabled={!selectedStudent}
        >
          📥 Download Individual Report (PDF)
        </button>
      </div>
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
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handlePrintClass}
            style={styles.button}
            disabled={marklistStudents.length === 0}
          >
            Print Class Marklist ({printOrientation})
          </button>
          <button
            onClick={handleDownloadClass}
            style={{
              ...styles.button,
              backgroundColor: '#28a745'
            }}
            disabled={marklistStudents.length === 0}
          >
            📥 Download Class Marklist (PDF)
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Reports;