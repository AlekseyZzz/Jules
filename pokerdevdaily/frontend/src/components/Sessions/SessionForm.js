import React, { useState, useEffect } from 'react';
import sessionService from '../../services/sessionService';
// Assuming FormStyles.css is in pages, adjust path or move/create a shared components.css
import '../../pages/FormStyles.css'; // Reusing existing form styles

// Helper to format date for datetime-local input
const formatDateForInput = (isoDateString) => {
  if (!isoDateString) return '';
  // datetime-local needs YYYY-MM-DDTHH:mm
  // ISO string might have seconds or Z, slice to fit
  const date = new Date(isoDateString);
  // Adjust for local timezone if backend stores in UTC
  // For simplicity, this example assumes dates are handled consistently
  // or backend expects UTC and converts. A robust solution needs careful timezone handling.
  //toISOString() returns UTC, so if we want local time in input, we need to adjust
  const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
  return localDate.toISOString().slice(0, 16);
};


function SessionForm({ initialData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    start_time: '',
    end_time: '',
    discipline: '',
    stake_level: '',
    result_amount: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(initialData && initialData.id);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        start_time: formatDateForInput(initialData.start_time) || '',
        end_time: formatDateForInput(initialData.end_time) || '',
        discipline: initialData.discipline || '',
        stake_level: initialData.stake_level || '',
        result_amount: initialData.result_amount !== null ? String(initialData.result_amount) : '',
        notes: initialData.notes || '',
      });
    } else {
      // Reset form for create mode if initialData is cleared
       setFormData({
        start_time: '',
        end_time: '',
        discipline: '',
        stake_level: '',
        result_amount: '',
        notes: '',
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic frontend validation
    if (new Date(formData.start_time) >= new Date(formData.end_time)) {
      setError('End time must be after start time.');
      setLoading(false);
      return;
    }
    if (isNaN(parseFloat(formData.result_amount))) {
        setError('Result amount must be a number.');
        setLoading(false);
        return;
    }

    // Ensure datetimes are sent in ISO 8601 format (what datetime-local provides is usually fine, but can be explicit)
    // If your backend expects UTC, ensure conversion here or that datetime-local sends it that way.
    // For this example, we assume backend handles the string from datetime-local input correctly.
    const payload = {
      ...formData,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
      result_amount: parseFloat(formData.result_amount),
    };

    try {
      if (isEditMode) {
        await sessionService.updateSession(initialData.id, payload);
      } else {
        await sessionService.createSession(payload);
      }
      if (onSuccess) onSuccess(); // Callback to refresh list or close modal
      if (!isEditMode) { // Reset form only if creating
         setFormData({ start_time: '', end_time: '', discipline: '', stake_level: '', result_amount: '', notes: '' });
      }
    } catch (err) {
      setError(err.msg || (isEditMode ? 'Failed to update session.' : 'Failed to create session.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container session-form"> {/* Add specific class if needed */}
      <h3>{isEditMode ? 'Edit Session' : 'Add New Session'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="start_time">Start Time:</label>
          <input type="datetime-local" id="start_time" name="start_time" value={formData.start_time} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="end_time">End Time:</label>
          <input type="datetime-local" id="end_time" name="end_time" value={formData.end_time} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="discipline">Discipline (e.g., NLH Cash, PLO MTT):</label>
          <input type="text" id="discipline" name="discipline" value={formData.discipline} onChange={handleChange} required placeholder="e.g., NLH Cash, $10 PLO MTT"/>
        </div>
        <div className="form-group">
          <label htmlFor="stake_level">Stake/Level (e.g., NL10, $22 Tourney):</label>
          <input type="text" id="stake_level" name="stake_level" value={formData.stake_level} onChange={handleChange} placeholder="e.g., NL10, $22 MTT"/>
        </div>
        <div className="form-group">
          <label htmlFor="result_amount">Result (+/-):</label>
          <input type="number" step="0.01" id="result_amount" name="result_amount" value={formData.result_amount} onChange={handleChange} required placeholder="e.g., -10.50 or 250"/>
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="form-actions">
            <button type="submit" disabled={loading}>
            {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Session' : 'Create Session')}
            </button>
            {onCancel && <button type="button" className="cancel-button" onClick={onCancel} disabled={loading}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}

export default SessionForm;
