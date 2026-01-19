import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCreateMeeting = () => {
    if (isAuthenticated) {
      navigate('/create');
    } else {
      navigate('/login');
    }
  };

  const handleJoinMeeting = () => {
    if (isAuthenticated) {
      navigate('/join');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <header className="landing-header">
          <h1 className="landing-title">Secure Meeting Room</h1>
          <p className="landing-subtitle">
            Privacy-first online meetings. Zero data collection. End-to-end encrypted.
          </p>
        </header>

        <div className="landing-actions">
          <Card className="action-card">
            <div className="action-icon">🎥</div>
            <h2 className="action-title">Create Meeting</h2>
            <p className="action-description">
              Start a new secure meeting room. Generate a unique ID and password.
            </p>
            <Button 
              variant="primary" 
              size="large" 
              onClick={handleCreateMeeting}
              className="action-button"
            >
              Create Meeting
            </Button>
          </Card>

          <Card className="action-card">
            <div className="action-icon">🔐</div>
            <h2 className="action-title">Join Meeting</h2>
            <p className="action-description">
              Enter a meeting ID and password to join an existing room.
            </p>
            <Button 
              variant="secondary" 
              size="large" 
              onClick={handleJoinMeeting}
              className="action-button"
            >
              Join Meeting
            </Button>
          </Card>
        </div>

        <div className="landing-features">
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Zero Data Collection</h3>
            <p className="feature-text">No tracking, no analytics, no cookies</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💾</div>
            <h3 className="feature-title">In-Memory Only</h3>
            <p className="feature-text">All data destroyed when meeting ends</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔐</div>
            <h3 className="feature-title">End-to-End Encrypted</h3>
            <p className="feature-text">Secure peer-to-peer communication</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
