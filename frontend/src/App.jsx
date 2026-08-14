import React, { useState } from 'react';
import Login from './components/Login';
import WorkoutDashboard from './components/WorkoutDashboard';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <WorkoutDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}