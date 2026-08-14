import React, { useState, useEffect } from 'react';
import api from '../api';

export default function WorkoutDashboard({ onLogout }) {
  const [workouts, setWorkouts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Form states
  const [date, setDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', weight: '' }]);
  
  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchWorkouts();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('users/me/');
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const response = await api.get('workouts/');
      setWorkouts(response.data);
    } catch (err) {
      console.error('Failed to fetch workouts', err);
      setError('Could not load workout history.');
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const addExerciseField = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }]);
  };

  const removeExerciseField = (index) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    } else {
      // If only one remains, reset it
      setExercises([{ name: '', sets: '', reps: '', weight: '' }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (exercises.some(ex => !ex.name.trim() || !ex.sets || !ex.reps || !ex.weight)) {
      setError('Please fill in all exercise fields.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('workouts/', { 
        date, 
        notes: notes.trim(), 
        exercises: exercises.map(ex => ({
          name: ex.name.trim(),
          sets: parseInt(ex.sets, 10),
          reps: parseInt(ex.reps, 10),
          weight: parseFloat(ex.weight)
        }))
      });
      
      // Reset form
      setNotes('');
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);
      setExercises([{ name: '', sets: '', reps: '', weight: '' }]);
      
      // Refresh list
      fetchWorkouts();
    } catch (err) {
      console.error('Failed to create workout', err);
      const data = err.response?.data;
      let errMsg = 'Failed to log workout session. Please try again.';
      if (data) {
        if (typeof data === 'object') {
          errMsg = Object.entries(data)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : val}`)
            .join(' | ');
        } else {
          errMsg = String(data);
        }
      }
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout session?')) {
      return;
    }
    try {
      await api.delete(`workouts/${id}/`);
      fetchWorkouts();
    } catch (err) {
      console.error('Failed to delete workout', err);
      setError('Could not delete workout session.');
    }
  };

  // Helper to format Date string
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // Use parts to avoid local timezone conversions mismatching date
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const dateObj = new Date(year, month, day);
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    return dateStr;
  };

  // Compute stats
  const totalWorkouts = workouts.length;
  const totalExercisesLogged = workouts.reduce((total, w) => total + (w.exercises?.length || 0), 0);
  
  // Sort workouts by date descending
  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const lastWorkoutDate = sortedWorkouts.length > 0 ? formatDate(sortedWorkouts[0].date) : 'No workouts logged';

  // Search logic
  const filteredWorkouts = sortedWorkouts.filter(w => {
    const notesMatch = w.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const exerciseMatch = w.exercises?.some(ex => 
      ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return notesMatch || exerciseMatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Topbar */}
      <header className="app-header">
        <div className="app-header-content">
          <div className="app-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
              <path d="m6.5 6.5 11 11" />
              <path d="m21 21-1-1" />
              <path d="m3 3 1 1" />
              <path d="m18.5 5.5 3 3" />
              <path d="m2.5 15.5 3 3" />
            </svg>
            Gym Logger <span>PRO</span>
          </div>
          <div className="user-controls">
            {currentUser && (
              <span className="username-badge">
                {currentUser.username}
              </span>
            )}
            <button className="btn btn-secondary btn-sm" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container" style={{ flexGrow: 1 }}>
        {/* Statistics Summary */}
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Workouts</span>
            <span className="stat-value stat-value-accent">{totalWorkouts}</span>
            <span className="stat-desc">Sessions completed</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Exercises Logged</span>
            <span className="stat-value">{totalExercisesLogged}</span>
            <span className="stat-desc">Individual movements tracked</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Last Session</span>
            <span className="stat-value" style={{ fontSize: '20px', fontWeight: 700, minHeight: '38px', display: 'flex', alignItems: 'center' }}>
              {lastWorkoutDate}
            </span>
            <span className="stat-desc">Your most recent exercise date</span>
          </div>
        </section>

        {error && (
          <div className="auth-error" style={{ marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {/* Dashboard Panels */}
        <div className="dashboard-layout">
          {/* Left panel: Log Form */}
          <section>
            <div className="form-card">
              <h3 className="form-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)' }}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
                </svg>
                Log New Workout
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="workout-date">Workout Date</label>
                  <input 
                    id="workout-date"
                    type="date" 
                    className="input-control"
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="workout-notes">Workout Focus / Notes</label>
                  <textarea 
                    id="workout-notes"
                    placeholder="e.g., Pull Day, Leg focus, Cardio & Core" 
                    className="input-control"
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                  />
                </div>

                <div className="exercises-heading">
                  <span>EXERCISES</span>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm" 
                    onClick={addExerciseField}
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                  >
                    + Add Row
                  </button>
                </div>

                {exercises.map((ex, index) => (
                  <div key={index} className="exercise-row">
                    <div className="exercise-row-inputs">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <input 
                          type="text" 
                          placeholder="Name (e.g. Squat)" 
                          className="input-control"
                          value={ex.name} 
                          onChange={(e) => handleExerciseChange(index, 'name', e.target.value)} 
                          required 
                          style={{ padding: '8px 10px', fontSize: '13px' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <input 
                          type="number" 
                          placeholder="Sets" 
                          min="1"
                          className="input-control"
                          value={ex.sets} 
                          onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)} 
                          required 
                          style={{ padding: '8px 10px', fontSize: '13px' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <input 
                          type="number" 
                          placeholder="Reps" 
                          min="1"
                          className="input-control"
                          value={ex.reps} 
                          onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)} 
                          required 
                          style={{ padding: '8px 10px', fontSize: '13px' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <input 
                          type="number" 
                          step="0.1" 
                          min="0"
                          placeholder="Wt (kg)" 
                          className="input-control"
                          value={ex.weight} 
                          onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)} 
                          required 
                          style={{ padding: '8px 10px', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="remove-ex-btn" 
                      onClick={() => removeExerciseField(index)}
                      title="Remove exercise row"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '16px' }}
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Workout Session'}
                </button>
              </form>
            </div>
          </section>

          {/* Right panel: History and search */}
          <section className="history-section">
            <div className="history-header">
              <h2>Workout History</h2>
              
              <div className="search-box">
                <span className="search-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  className="input-control" 
                  placeholder="Search notes or exercises..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                Loading your workout history...
              </div>
            ) : filteredWorkouts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏋️‍♂️</div>
                <h3>No workouts found</h3>
                <p>{searchTerm ? "Try searching for something else." : "Get started by logging your first workout session today!"}</p>
              </div>
            ) : (
              <div className="history-grid">
                {filteredWorkouts.map((session) => (
                  <div key={session.id} className="workout-card">
                    <div className="workout-card-meta">
                      <div className="workout-date">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {formatDate(session.date)}
                      </div>
                      <div className="workout-actions">
                        <button 
                          className="btn btn-danger btn-sm" 
                          style={{ padding: '4px 8px' }} 
                          onClick={() => handleDeleteWorkout(session.id)}
                          title="Delete workout"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {session.notes && (
                      <div className="workout-card-notes">
                        {session.notes}
                      </div>
                    )}

                    <ul className="workout-exercises-list">
                      {session.exercises?.map((ex) => (
                        <li key={ex.id} className="workout-exercise-item">
                          <span className="ex-name">{ex.name}</span>
                          <span className="ex-stats">
                            {ex.sets} sets × {ex.reps} reps @ {ex.weight} kg
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}