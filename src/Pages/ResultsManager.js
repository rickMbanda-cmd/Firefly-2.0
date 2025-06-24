import React, { useEffect, useState } from 'react';
import {
  fetchResults,
  addResult,
  updateResult,
  deleteResult
} from '../api/results';
import ExamNavigation from '../Components/ExamNavigation';

const examTypes = ['opener', 'midterm', 'endterm'];
const classes = [
  'Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3',
  'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'
];

const emptyResult = {
  name: '',
  math: '',
  english: '',
  science: '',
  mean: '',
  rubric: '',
  examType: 'opener',
  class: '' // Ensure class is always present in the form state
};

const ResultsManager = () => {
  const [results, setResults] = useState([]);
  const [form, setForm] = useState(emptyResult);
  const [editingId, setEditingId] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState('opener');

  useEffect(() => {
    fetchResults().then(setResults);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = result => {
    setEditingId(result._id);
    setForm({
      name: result.name,
      math: result.math,
      english: result.english,
      science: result.science,
      mean: result.mean,
      rubric: result.rubric,
      examType: result.examType,
      class: result.class || ''
    });
  };

  const handleDelete = async id => {
    await deleteResult(id);
    setResults(results.filter(r => r._id !== id));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Ensure class is selected in the form (now in the form, not dashboard)
    if (!form.class) {
      alert('Please select a class.');
      return;
    }
    const formWithClass = { ...form };
    if (editingId) {
      const updated = await updateResult(editingId, formWithClass);
      setResults(results.map(r => (r._id === editingId ? updated : r)));
      setEditingId(null);
    } else {
      const created = await addResult(formWithClass);
      setResults([...results, created]);
    }
    setForm({ ...emptyResult, examType: selectedExamType });
  };

  // Filter results by selected exam type only
  const filteredResults = results.filter(
    r => r.examType === selectedExamType
  );

  return (
    <div className="exam-module-container">
      <ExamNavigation />
      <h1>Results Manager</h1>
      <div style={{ marginBottom: '1.5em', display: 'flex', gap: '1em', alignItems: 'center' }}>
        <label htmlFor="exam-type-select" style={{ fontWeight: 500 }}>Select Exam Type:</label>
        <select
          id="exam-type-select"
          value={selectedExamType}
          onChange={e => {
            setSelectedExamType(e.target.value);
            setForm({ ...form, examType: e.target.value });
          }}
          style={{
            padding: '0.5em 1em',
            borderRadius: 8,
            border: '1px solid #2355d6',
            fontSize: '1em',
            color: '#2355d6',
            fontWeight: 500,
            background: '#fff'
          }}
        >
          {examTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        {/* Class selection dropdown removed from dashboard */}
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2em', display: 'flex', gap: '1em', flexWrap: 'wrap' }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="math" type="number" value={form.math} onChange={handleChange} placeholder="Math" required />
        <input name="english" type="number" value={form.english} onChange={handleChange} placeholder="English" required />
        <input name="science" type="number" value={form.science} onChange={handleChange} placeholder="Science" required />
        {/* Class selection is now here, in the exam module form */}
        <select
          name="class"
          value={form.class}
          onChange={handleChange}
          required
          style={{
            padding: '0.5em 1em',
            borderRadius: 8,
            border: '1px solid #2355d6',
            fontSize: '1em',
            color: '#2355d6',
            fontWeight: 500,
            background: '#fff'
          }}
        >
          <option value="">Select Class</option>
          {classes.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'} Result</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ ...emptyResult, examType: selectedExamType }); }}>
            Cancel
          </button>
        )}
      </form>
      <table className="data-entry-grid-table" style={{ width: '100%', background: '#f8fafc', borderRadius: 10 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Math</th>
            <th>English</th>
            <th>Science</th>
            <th>Exam Type</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map(r => (
            <tr key={r._id}>
              <td>{r.name}</td>
              <td>{r.math}</td>
              <td>{r.english}</td>
              <td>{r.science}</td>
              <td>{r.examType}</td>
              <td>{r.class}</td>
              <td>
                <button onClick={() => handleEdit(r)}>Edit</button>
                <button onClick={() => handleDelete(r._id)} style={{ marginLeft: 8 }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsManager;