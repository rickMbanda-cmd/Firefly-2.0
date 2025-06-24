import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './Pages/Dashboard';
import OpenerExam from './Pages/OpenerExam';
import MidtermExam from './Pages/MidtermExam';
import EndTermExam from './Pages/EndTermExam';
import Reports from './Pages/Reports';
import ResultsManager from './Pages/ResultsManager'; // <-- Add this import

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/opener" element={<OpenerExam />} />
      <Route path="/midterm" element={<MidtermExam />} />
      <Route path="/endterm" element={<EndTermExam />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/results-manager" element={<ResultsManager />} /> {/* <-- Add this route */}
    </Routes>
  </BrowserRouter>
);

export default App;
