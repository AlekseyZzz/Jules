import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; // Import the actual DashboardPage
import CalendarPage from './pages/CalendarPage'; // Import CalendarPage
import authService from './services/authService'; // To check token for protected routes

// Placeholder for Home Page
const HomePage = () => (
  <div>
    <h1>Welcome to PokerDevDaily</h1>
    <p>Track your sessions, analyze your performance, and improve your game.</p>
    <p><Link to="/register">Register</Link> or <Link to="/login">Login</Link> to get started.</p>
  </div>
);

// A simple protected route component
const ProtectedRoute = ({ children }) => {
  const token = authService.getToken();
  if (!token) {
    // User not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};


function App() {
  return (
    <Router>
      <div className="App">
        <nav className="App-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            {authService.getToken() ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/calendar">Calendar</Link></li> {/* Add Calendar link */}
                {/* Logout functionality can be a button on dashboard or here */}
              </>
            ) : (
              <>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
          </ul>
        </nav>
        <main className="App-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              } 
            />
            {/* Add other routes here */}
            <Route path="*" element={<Navigate to="/" />} /> {/* Fallback for unknown routes */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
