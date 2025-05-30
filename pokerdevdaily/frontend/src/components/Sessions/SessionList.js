import React, { useEffect, useState } from 'react';
import sessionService from '../../services/sessionService';
import './SessionList.css'; // Create this file for styling the list

// Helper to format date for display
const formatDisplayDate = (isoDateString) => {
  if (!isoDateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(isoDateString).toLocaleDateString(undefined, options);
};

function SessionList({ sessions, isLoading, error, onEdit, onDelete, onRefresh }) {

  if (isLoading) {
    return <p>Loading sessions...</p>;
  }

  if (error) {
    return <p className="error-message">Error fetching sessions: {error.msg || error.toString()}</p>;
  }

  if (!sessions || sessions.length === 0) {
    return <p>No sessions recorded yet. Add one above!</p>;
  }

  return (
    <div className="session-list-container">
      <h3>Your Sessions</h3>
      <button onClick={onRefresh} disabled={isLoading} className="refresh-button">Refresh List</button>
      <table className="session-table">
        <thead>
          <tr>
            <th>Discipline</th>
            <th>Stake/Level</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Result</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(session => (
            <tr key={session.id}>
              <td>{session.discipline}</td>
              <td>{session.stake_level || '-'}</td>
              <td>{formatDisplayDate(session.start_time)}</td>
              <td>{formatDisplayDate(session.end_time)}</td>
              <td className={session.result_amount >= 0 ? 'result-positive' : 'result-negative'}>
                {session.result_amount.toFixed(2)}
              </td>
              <td className="notes-cell">{session.notes || '-'}</td>
              <td className="actions-cell">
                <button onClick={() => onEdit(session)} className="edit-btn">Edit</button>
                <button onClick={() => onDelete(session.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SessionList;
