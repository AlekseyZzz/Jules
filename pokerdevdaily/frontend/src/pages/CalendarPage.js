import React from 'react';
import CalendarView from '../components/Calendar/CalendarView';
import authService from '../services/authService'; // For logout or other auth actions if needed
import { useNavigate } from 'react-router-dom'; // For potential redirects
import './CalendarPage.css'; // For page-specific styles if any

function CalendarPage() {
  const navigate = useNavigate(); // Example if you need to redirect on auth error

  // This page could have more layout or info around the calendar if needed.
  // For now, it's a simple wrapper.

  // Example of how you might handle a global auth error if not handled in service/interceptor
  // useEffect(() => {
  //   if (!authService.getToken()) {
  //     navigate('/login');
  //   }
  // }, [navigate]);

  return (
    <div className="calendar-page-container">
      <header className="calendar-page-header">
        <h1>Poker Session Calendar</h1>
      </header>
      <section className="calendar-section">
        <p>
          This calendar highlights the days on which you've recorded poker sessions. 
          Navigate through months to see your activity over time.
        </p>
        <CalendarView />
      </section>
      {/* You could add more sections here, e.g., summary stats for the selected month */}
    </div>
  );
}

export default CalendarPage;
