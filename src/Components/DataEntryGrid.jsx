import React from 'react';

const DataEntryGrid = ({ students, updateStudent, addStudentRow, saveStudent }) => (
  <div>
    <table className="data-entry-grid-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Math</th>
          <th>English</th>
          <th>Science</th>
          <th>Mean</th>
          <th>Rubric</th>
          <th>Class</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map(student => (
          <tr key={student.id || student._id}>
            <td>
              <input
                type="text"
                value={student.name}
                onChange={e => updateStudent(student.id, 'name', e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                value={student.math}
                onChange={e => updateStudent(student.id, 'math', e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                value={student.english}
                onChange={e => updateStudent(student.id, 'english', e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                value={student.science}
                onChange={e => updateStudent(student.id, 'science', e.target.value)}
              />
            </td>
            <td>{student.mean}</td>
            <td>{student.rubric}</td>
            <td>{student.class || '-'}</td>
            <td>
              <button onClick={() => saveStudent(student)}>Save</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <button onClick={addStudentRow}>Add Student</button>
  </div>
);

export default DataEntryGrid;