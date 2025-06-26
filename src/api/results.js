const API_URL = 'http://localhost:5000/api/results';

export const fetchResults = async () => (await fetch(API_URL)).json();

export const fetchResultsByType = async (type) =>
  (await fetch(`${API_URL}/exam/${type}`)).json();

export const fetchResultsByClass = async (className) =>
  (await fetch(`${API_URL}/class/${className}`)).json();

export const fetchResultsByClassAndType = async (className, examType) =>
  (await fetch(`${API_URL}/class/${className}/exam/${examType}`)).json();

export const addResult = async (data) =>
  (await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })).json();

export const updateResult = async (id, data) =>
  (await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })).json();

export const deleteResult = async (id) =>
  (await fetch(`${API_URL}/${id}`, { method: 'DELETE' })).json();