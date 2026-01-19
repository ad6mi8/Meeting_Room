import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CreateMeetingPage from './pages/CreateMeetingPage';
import JoinMeetingPage from './pages/JoinMeetingPage';
import MeetingRoom from './pages/MeetingRoom';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <CreateMeetingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/join" 
              element={
                <ProtectedRoute>
                  <JoinMeetingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/meeting/:meetingId" 
              element={
                <ProtectedRoute>
                  <MeetingRoom />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
