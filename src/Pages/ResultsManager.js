
import React, { useEffect, useState } from 'react';
import {
  fetchResults,
  addResult,
  updateResult,
  deleteResult
} from '../api/results';
import ExamNavigation from '../Components/ExamNavigation';
import { getSubjectsByClass, getSubjectDisplayName, getRubric } from '../Utils/subjectsByClass';

const examTypes = ['opener', 'midterm', 'endterm'];
const classes = [
  'Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3',
  'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'
];

const createEmptyResult = (examType, selectedClass) => {
  const subjects = getSubjectsByClass(selectedClass);
  const result = {
    name: '',
    mean: '',
    rubric: '',
    examType: examType,
    class: selectedClass || ''
  };
  
  // Initialize all subjects to empty string
  subjects.forEach(subject => {
    result[subject] = '';
  });
  
  return result;
};

const ResultsManager = () => {
  const [results, setResults] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState('opener');
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    fetchResults().then(setResults);
  }, []);

  useEffect(() => {
    // Reset form when class or exam type changes
    setForm(createEmptyResult(selectedExamType, selectedClass));
    setEditingId(null);
  }, [selectedClass, selectedExamType]);

  const currentSubjects = getSubjectsByClass(selectedClass);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = result => {
    setEditingId(result._id);
    const editForm = {
      name: result.name,
      mean: result.mean,
      rubric: result.rubric,
      examType: result.examType,
      class: result.class || ''
    };
    
    // Add all current subjects
    currentSubjects.forEach(subject => {
      editForm[subject] = result[subject] || '';
    });
    
    setForm(editForm);
  };

  const handleDelete = async id => {
    await deleteResult(id);
    setResults(results.filter(r => r._id !== id));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!form.class) {
      alert('Please select a class.');
      return;
    }

    // Calculate mean from current subjects
    const subjectScores = currentSubjects.map(subject => parseFloat(form[subject])).filter(score => !isNaN(score));
    const mean = subjectScores.length > 0 ? subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length : 0;
    
    const formWithMean = { 
      ...form, 
      mean: mean.toFixed(2),
      rubric: getRubric(mean)
    };
    
    if (editingId) {
      const updated = await updateResult(editingId, formWithMean);
      setResults(results.map(r => (r._id === editingId ? updated : r)));
      setEditingId(null);
    } else {
      const created = await addResult(formWithMean);
      setResults([...results, created]);
    }
    setForm(createEmptyResult(selectedExamType, selectedClass));
  };

  // Filter results by selected exam type and class
  const filteredResults = results.filter(
    r => r.examType === selectedExamType && (!selectedClass || r.class === selectedClass)
  );

  return (
    <div className="exam-module-container">
      <ExamNavigation />
      <h1>Results Manager</h1>
      
      <div style={{ marginBottom: '1.5em', display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="exam-type-select" style={{ fontWeight: 500 }}>Select Exam Type:</label>
          <select
            id="exam-type-select"
            value={selectedExamType}
            onChange={e => setSelectedExamType(e.target.value)}
            style={{
              padding: '0.5em 1em',
              borderRadius: 8,
              border: '1px solid #2355d6',
              fontSize: '1em',
              color: '#2355d6',
              fontWeight: 500,
              background: '#fff',
              marginLeft: '0.5em'
            }}
          >
            {examTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="class-select" style={{ fontWeight: 500 }}>Select Class:</label>
          <select
            id="class-select"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            style={{
              padding: '0.5em 1em',
              borderRadius: 8,
              border: '1px solid #2355d6',
              fontSize: '1em',
              color: '#2355d6',
              fontWeight: 500,
              background: '#fff',
              marginLeft: '0.5em'
            }}
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2em', display: 'flex', gap: '1em', flexWrap: 'wrap' }}>
        <input 
          name="name" 
          value={form.name || ''} 
          onChange={handleChange} 
          placeholder="Name" 
          required 
        />
        
        {currentSubjects.map(subject => (
          <input 
            key={subject}
            name={subject} 
            type="number" 
            value={form[subject] || ''} 
            onChange={handleChange} 
            placeholder={getSubjectDisplayName(subject)} 
            required 
          />
        ))}
        
        <select
          name="class"
          value={form.class || ''}
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
          <button type="button" onClick={() => { 
            setEditingId(null); 
            setForm(createEmptyResult(selectedExamType, selectedClass)); 
          }}>
            Cancel
          </button>
        )}
      </form>
      
      <table className="data-entry-grid-table" style={{ width: '100%', background: '#f8fafc', borderRadius: 10 }}>
        <thead>
          <tr>
            <th>Name</th>
            {currentSubjects.map(subject => (
              <th key={subject}>{getSubjectDisplayName(subject)}</th>
            ))}
            <th>Mean</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map(r => (
            <tr key={r._id}>
              <td>{r.name}</td>
              {currentSubjects.map(subject => (
                <td key={subject}>{r[subject] || '-'}</td>
              ))}
              <td>{r.mean || '-'}</td>
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