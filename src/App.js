
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './Components/Login';

import Dashboard from './Pages/Dashboard';
import OpenerExam from './Pages/OpenerExam';
import MidtermExam from './Pages/MidtermExam';
import EndTermExam from './Pages/EndTermExam';
import Reports from './Pages/Reports';
import ResultsManager from './Pages/ResultsManager';

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/opener" element={<OpenerExam />} />
      <Route path="/midterm" element={<MidtermExam />} />
      <Route path="/endterm" element={<EndTermExam />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/results-manager" element={<ResultsManager />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <ProtectedRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;