import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import sessionService from '../../services/sessionService';
import 'react-calendar/dist/Calendar.css'; // Default styling for react-calendar
import './CalendarView.css'; // Custom styles for highlighting

// Helper function to get date in 'YYYY-MM-DD' format from a Date object or ISO string
const getLocalDateString = (date) => {
  const d = new Date(date);
  // Adjust for timezone offset to ensure the date is correct locally
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function CalendarView() {
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [sessionDates, setSessionDates] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessionsForMonth = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Note: getUserSessions fetches ALL sessions. 
        // For performance with many sessions, you might filter by month/year on backend.
        // For now, we fetch all and process client-side.
        const sessions = await sessionService.getUserSessions();
        const datesWithSessions = new Set();
        sessions.forEach(session => {
          // Extract the date part of start_time (assuming start_time indicates the session day)
          datesWithSessions.add(getLocalDateString(session.start_time));
        });
        setSessionDates(datesWithSessions);
      } catch (err) {
        setError(err.msg || 'Failed to fetch session dates.');
        // Handle auth errors, e.g., redirect to login
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            // Potentially call authService.logoutUser() and redirect
            console.error("Auth error fetching sessions for calendar");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionsForMonth();
  }, []); // Fetch once on mount, or re-fetch if activeStartDate changes and backend supports filtering

  const tileClassName = ({ date, view }) => {
    // Add class to days in month view that have sessions
    if (view === 'month') {
      const dateStr = getLocalDateString(date);
      if (sessionDates.has(dateStr)) {
        return 'day-with-session';
      }
    }
    return null;
  };

  const handleDrillDown = (value) => {
    setActiveStartDate(value.activeStartDate);
  };
  
  // Could add onClickDay handler to show sessions for that day in future
  // const handleDayClick = (value) => {
  //   console.log('Clicked day:', getLocalDateString(value));
  //   // Potentially filter and display sessions for this day
  // };

  return (
    <div className="calendar-container">
      <h3>Session Calendar</h3>
      {isLoading && <p>Loading calendar...</p>}
      {error && <p className="error-message">{error}</p>}
      <Calendar
        onChange={setActiveStartDate} // Updates the month/year view
        value={activeStartDate}
        tileClassName={tileClassName}
        // onClickDay={handleDayClick} // Future enhancement
        onDrillDown={handleDrillDown} // Handles month/year view changes
        onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)} // Handles arrow navigation
        className="custom-calendar"
      />
      <div className="legend">
        <span className="legend-item">
          <span className="legend-color day-with-session-legend"></span> = Day with Session(s)
        </span>
      </div>
    </div>
  );
}

export default CalendarView;
