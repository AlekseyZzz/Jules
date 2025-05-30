import React, { useState, useEffect, useCallback } from 'react';
import SessionForm from '../components/Sessions/SessionForm';
import SessionList from '../components/Sessions/SessionList';
import sessionService from '../services/sessionService';
import authService from '../services/authService'; // For logout
import RecommendationDisplay from '../components/Recommendations/RecommendationDisplay'; // Import RecommendationDisplay
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // For Dashboard specific styles

function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingSession, setEditingSession] = useState(null); // Session object to edit
  const [showForm, setShowForm] = useState(false); // To toggle form visibility

  const navigate = useNavigate();

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await sessionService.getUserSessions();
      setSessions(data);
    } catch (err) {
      setError(err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        authService.logoutUser();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleLogout = () => {
    authService.logoutUser();
    navigate('/login');
  };

  const handleFormSuccess = () => {
    fetchSessions(); // Refresh the list
    setEditingSession(null); // Clear editing state
    setShowForm(false); // Hide form after successful submission
  };
  
  const handleEditSession = (session) => {
    setEditingSession(session);
    setShowForm(true); // Show form populated with session data
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionService.deleteSession(sessionId);
        fetchSessions(); // Refresh the list
      } catch (err) {
        setError(err);
        alert('Failed to delete session: ' + (err.msg || 'Unknown error'));
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
    setShowForm(false);
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      
      <div className="dashboard-content">
        {/* Recommendation Display can go here */}
        <RecommendationDisplay />

        {!showForm && (
          <button onClick={() => { setEditingSession(null); setShowForm(true); }} className="add-session-button">
            Add New Session
          </button>
        )}

        {showForm && (
          <SessionForm
            initialData={editingSession}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelEdit}
          />
        )}
        
        <SessionList
          sessions={sessions}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditSession}
          onDelete={handleDeleteSession}
          onRefresh={fetchSessions}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
