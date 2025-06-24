import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DataEntryGrid from '../Components/DataEntryGrid';
import { calculateMean, calculateRubric } from '../Utils/calculations';
import { addResult, updateResult } from '../api/results';
import ExamNavigation from '../Components/ExamNavigation';

const initialStudents = [
  { id: 1, name: '', math: '', english: '', science: '', mean: '', rubric: '', examType: 'opener' }
];

const OpenerExam = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedClass = location.state?.selectedClass ||
  new URLSearchParams(Location.search).get('class') //

  const [students, setStudents] = useState(initialStudents);

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
          const newStudent = { ...student, [field]: value, examType: 'opener', class: selectedClass };
          const parsedMath = parseFloat(newStudent.math);
          const parsedEnglish = parseFloat(newStudent.english);
          const parsedScience = parseFloat(newStudent.science);
          if (
            !isNaN(parsedMath) &&
            !isNaN(parsedEnglish) &&
            !isNaN(parsedScience)
          ) {
            newStudent.mean = calculateMean([parsedMath, parsedEnglish, parsedScience]);
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
    setStudents([
      ...students,
      { id: newId, name: '', math: '', english: '', science: '', mean: '', rubric: '', examType: 'opener', class: selectedClass }
    ]);
  };

  return (
    <div className="exam-module-container">
      <ExamNavigation />
      <h1>Opener Exam Results - {selectedClass}</h1>
      <DataEntryGrid
        students={students}
        updateStudent={updateStudent}
        addStudentRow={addStudentRow}
        saveStudent={saveStudent}
      />
    </div>
  );
};

export default OpenerExam;