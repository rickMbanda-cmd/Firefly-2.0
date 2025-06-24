import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './examNavigationStyles.css';

const modules = [
  { path: '/opener', label: 'Opener Exam' },
  { path: '/midterm', label: 'Midterm Exam' },
  { path: '/endterm', label: 'Endterm Exam' },
  { path: '/reports', label: 'Reports & Marklists' },
  { path: '/', label: 'Dashboard' }
];

const ExamNavigation = () => {
  const location = useLocation();
  const selectedClass = location.state?.selectedClass;

  return (
    <nav className="exam-nav">
      {modules.map(mod => (
        <NavLink
          key={mod.path}
          to={mod.path}
          state={selectedClass ? { selectedClass } : undefined}
          className={({ isActive }) =>
            isActive ? 'exam-nav-link active' : 'exam-nav-link'
          }
          end={mod.path === '/'}
        >
          {mod.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default ExamNavigation;