import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DataEntryGrid from '../Components/DataEntryGrid';
import { calculateMean, calculateRubric } from '../Utils/calculations';
import { addResult, updateResult } from '../api/results';
import ExamNavigation from '../Components/ExamNavigation';
import { getSubjectsByClass } from '../Utils/subjectsByClass';

const MidtermExam = () => {
  const location = useLocation();
  // Get selectedClass from route state (preferred for dashboard integration)
  const selectedClass =
    location.state?.selectedClass ||
    new URLSearchParams(location.search).get('class') ||
    'Playgroup';

  const subjects = getSubjectsByClass(selectedClass);

  const createInitialStudent = () => {
    const student = { id: 1, name: '', mean: '', rubric: '', examType: 'midterm', class: selectedClass };
    subjects.forEach(subject => {
      student[subject] = '';
    });
    return student;
  };

  const [students, setStudents] = useState([createInitialStudent()]);

  const saveStudent = async (student) => {
    const studentWithClass = { ...student, class: selectedClass };
    if (student._id) {
      await updateResult(student._id, studentWithClass);
    } else {
      await addResult(studentWithClass);
    }
  };

  const updateStudent = (id, field, value) => {
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id === id) {
          const newStudent = { ...student, [field]: value, examType: 'midterm', class: selectedClass };

          // Calculate mean using all subjects for this class
          const subjectScores = subjects.map(subject => parseFloat(newStudent[subject])).filter(score => !isNaN(score));

          if (subjectScores.length === subjects.length) {
            newStudent.mean = calculateMean(subjectScores);
            newStudent.rubric = calculateRubric(newStudent.mean);
          } else {
            newStudent.mean = '';
            newStudent.rubric = '';
          }
          return newStudent;
        }
        return student;
      });
    });
  };

  const addStudentRow = () => {
    const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
    const newStudent = { id: newId, name: '', mean: '', rubric: '', examType: 'midterm', class: selectedClass };
    subjects.forEach(subject => {
      newStudent[subject] = '';
    });
    setStudents([...students, newStudent]);
  };

  const styles = {
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
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '40px',
      padding: '20px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
    },
    logo: {
      height: '60px',
      width: 'auto',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
      letterSpacing: '-1px'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#6b7280',
      fontWeight: '500',
      marginTop: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <ExamNavigation />
      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <img 
            src="/logschool.png" 
            alt="School Logo" 
            style={styles.logo}
          />
          <div>
            <h1 style={styles.title}>Midterm Exam Results</h1>
            <p style={styles.subtitle}>Class: {selectedClass} | Enter and manage student scores</p>
          </div>
        </div>
        <DataEntryGrid
          students={students}
          updateStudent={updateStudent}
          addStudentRow={addStudentRow}
          saveStudent={saveStudent}
          selectedClass={selectedClass}
        />
      </div>
    </div>
  );
};

export default MidtermExam;