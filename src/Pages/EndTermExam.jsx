import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DataEntryGrid from '../Components/DataEntryGrid';
import { calculateMean, calculateRubric } from '../Utils/calculations';
import { addResult, updateResult } from '../api/results';
import ExamNavigation from '../Components/ExamNavigation';
import { getSubjectsByClass } from '../Utils/subjectsByClass';

const EndtermExam = () => {
  const location = useLocation();
  // Get selectedClass from route state (preferred for dashboard integration)
  const selectedClass =
    location.state?.selectedClass ||
    new URLSearchParams(location.search).get('class') ||
    'Playgroup';

  const subjects = getSubjectsByClass(selectedClass);
  
  const createInitialStudent = () => {
    const student = { id: 1, name: '', mean: '', rubric: '', examType: 'endterm', class: selectedClass };
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
          const newStudent = { ...student, [field]: value, examType: 'endterm', class: selectedClass };
          
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
    const newStudent = { id: newId, name: '', mean: '', rubric: '', examType: 'endterm', class: selectedClass };
    subjects.forEach(subject => {
      newStudent[subject] = '';
    });
    setStudents([...students, newStudent]);
  };

  return (
    <div className="exam-module-container">
      <ExamNavigation />
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <img 
          src="/logschool.png" 
          alt="School Logo" 
          style={{ height: '40px', width: 'auto' }}
        />
        <h1>Endterm Exam Results - {selectedClass}</h1>
      </div>
      <DataEntryGrid
        students={students}
        updateStudent={updateStudent}
        addStudentRow={addStudentRow}
        saveStudent={saveStudent}
        selectedClass={selectedClass}
      />
    </div>
  );
};

export default EndtermExam;